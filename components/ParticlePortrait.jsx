'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * ─────────────────────────────────────────────
 *  CONFIG — all tunables in one place
 * ─────────────────────────────────────────────
 *  COUNT          total particles on desktop
 *  COUNT_MOBILE   total particles on mobile
 *  DOT_MIN        min dot radius in px (before DPR)
 *  DOT_MAX        max dot radius in px (before DPR)
 *  LENS_RADIUS    [minPx, vwFraction, maxPx]
 * ─────────────────────────────────────────────
 */
export const CONFIG = {
  COUNT:         100000,
  COUNT_MOBILE:   30000,
  DOT_MIN:         0.8,
  DOT_MAX:         1.6,
  LENS_RADIUS:   [90, 0.09, 140],    // [minPx, vw fraction, maxPx] region of influence
  LENS_FOLLOW:     0.12,
  LENS_FEATHER:    2.0,
  LENS_PUSH:       55.0,               // Repulsion strength: dots spread and push away from cursor

  TILT_MAX_DEG:    7.0,
  SHIFT_MAX_PX:   20.0,
  TILT_DAMPING:    0.08,

  SCATTER_SPREAD:   700.0,
  SCATTER_START:    0.03,
  SCATTER_END:      0.90,
  SCATTER_FADE_START: 0.72,

  INTRO_DURATION:   2.2,
  GOLD_RATIO:       0.03,
  GOLD_COLOR:    '#C9A878',

  // Face center in cutout (520×845 px), normalized
  FACE_CX: 0.496,
  FACE_CY: 0.211,
}

function calcLensRadius(w) {
  const [minPx, vw, maxPx] = CONFIG.LENS_RADIUS
  return Math.max(minPx, Math.min(maxPx, w * vw))
}

/** Fast S-curve on 0–255 value → 0–255 */
function sCurve(v) {
  const t = v / 255
  return (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)) * 255
}

/** Apply contrast boost (S-curve + unsharp mask blend) to ImageData in-place */
function boostContrast(ctx, w, h) {
  const src = ctx.getImageData(0, 0, w, h)
  const d = src.data

  // 1. S-curve
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 10) continue
    d[i]     = sCurve(d[i])
    d[i + 1] = sCurve(d[i + 1])
    d[i + 2] = sCurve(d[i + 2])
  }
  ctx.putImageData(src, 0, 0)

  // 2. Unsharp mask: draw blurred copy on separate canvas then blend
  const blurCanvas = document.createElement('canvas')
  blurCanvas.width = w
  blurCanvas.height = h
  const blurCtx = blurCanvas.getContext('2d')
  blurCtx.filter = 'blur(1.4px)'
  blurCtx.drawImage(ctx.canvas, 0, 0)
  blurCtx.filter = 'none'

  const sharp = ctx.getImageData(0, 0, w, h)
  const blurImg = blurCtx.getImageData(0, 0, w, h)
  const sd = sharp.data
  const bd = blurImg.data
  const amount = 0.55   // blend strength

  for (let i = 0; i < sd.length; i += 4) {
    if (sd[i + 3] < 10) continue
    for (let c = 0; c < 3; c++) {
      const sharpened = sd[i + c] + amount * (sd[i + c] - bd[i + c])
      sd[i + c] = Math.max(0, Math.min(255, sharpened))
    }
  }
  ctx.putImageData(sharp, 0, 0)
}

export default function ParticlePortrait({
  scrollProgress = 0,
  isLoaded = true,
  onHeroHover = () => {},
}) {
  const containerRef = useRef(null)
  const canvasRef    = useRef(null)
  const dotRef       = useRef(null)
  const sparkleCanvasRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  const stateRef = useRef({
    scrollProgress: 0,
    isLoaded: false,
    introStartTime: 0,
    hasIntroStarted: false,
    mouseTarget: { x: 0, y: 0, active: false },
    mouseRaw: { x: -9999, y: -9999 },
    lensCurrent: { x: 0, y: 0, scale: 0, velScale: 0 },
    lastInteractionTime: performance.now(),
    isTouch: false,
    prefersReducedMotion: false,
    isVisible: true,
    // Auto-sweep: runs once after intro to show the lens effect
    autoSweep: { active: false, done: false, startTime: 0 },
  })

  useEffect(() => { stateRef.current.scrollProgress = scrollProgress }, [scrollProgress])

  useEffect(() => {
    stateRef.current.isLoaded = isLoaded
    if (isLoaded && !stateRef.current.hasIntroStarted) {
      stateRef.current.hasIntroStarted = true
      stateRef.current.introStartTime  = performance.now()
    }
  }, [isLoaded])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    stateRef.current.prefersReducedMotion = mq.matches
    const onMQ = (e) => { stateRef.current.prefersReducedMotion = e.matches }
    mq.addEventListener('change', onMQ)
    return () => {
      window.removeEventListener('resize', checkMobile)
      mq.removeEventListener('change', onMQ)
    }
  }, [])

  // ─── Main Three.js effect ───────────────────────────────────────────────────
  useEffect(() => {
    const container    = containerRef.current
    const canvas       = canvasRef.current
    const dotEl        = dotRef.current
    const sparkleCanvas= sparkleCanvasRef.current
    if (!container || !canvas) return

    let width  = container.clientWidth  || window.innerWidth
    let height = container.clientHeight || window.innerHeight

    // ── Sparkle trail ──────────────────────────────────────────────────────
    let sparkles = []
    let sparkleCtx = sparkleCanvas ? sparkleCanvas.getContext('2d') : null
    if (sparkleCanvas) { sparkleCanvas.width = width; sparkleCanvas.height = height }

    // ── Three.js scene ─────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const fov    = 45
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 4000)
    const camDist = (h) => (h / 2) / Math.tan((fov * Math.PI / 180) / 2)
    camera.position.z = camDist(height)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const portraitGroup = new THREE.Group()
    scene.add(portraitGroup)

    let pointsMesh    = null
    let photoMesh     = null
    let pointsGeo     = null
    let pointsMat     = null
    let photoMat      = null
    let photoTex      = null

    let lensRadius = calcLensRadius(width)

    // ── Load cutout, process, sample points ───────────────────────────────
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/hero/faizan-cutout.png'

    img.onload = () => {
      if (!containerRef.current) return

      const imgW   = img.naturalWidth
      const imgH   = img.naturalHeight
      const aspect = imgW / imgH

      // Offscreen canvas with contrast boost
      const off = document.createElement('canvas')
      off.width  = imgW
      off.height = imgH
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(img, 0, 0, imgW, imgH)
      boostContrast(octx, imgW, imgH)
      const imgData = octx.getImageData(0, 0, imgW, imgH)
      const data    = imgData.data

      // Portrait display size (head-to-waist in viewport)
      const isMob   = width < 768
      const tgtH    = isMob ? Math.min(height * 0.72, 520) : Math.min(height * 0.92, 880)
      const tgtW    = tgtH * aspect
      const maxCount= isMob ? CONFIG.COUNT_MOBILE : CONFIG.COUNT

      // Gold color
      const gc = new THREE.Color(CONFIG.GOLD_COLOR)
      const goldR = gc.r, goldG = gc.g, goldB = gc.b

      // ── Rejection sampling: prob = lum^1.6 ─────────────────────────────
      const collected = []
      const step = 1   // scan every pixel; rejection rate handles density

      // We scan every pixel in a bounding box and accept probabilistically
      // First find bounding box
      let minX = imgW, maxX = 0, minY = imgH, maxY = 0
      for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
          if (data[(y * imgW + x) * 4 + 3] > 100) {
            if (x < minX) minX = x; if (x > maxX) maxX = x
            if (y < minY) minY = y; if (y > maxY) maxY = y
          }
        }
      }

      // Adaptive grid step so we collect roughly maxCount candidates before rejection
      // With prob ~ lum^1.6 avg ≈ 0.35, we need ~maxCount/0.35 candidate pixels
      const opaqueArea = (maxX - minX) * (maxY - minY)
      const fillRatio  = 0.70   // approx opaque fraction
      const targetCandidates = maxCount / 0.38
      const gridStep   = Math.max(step, Math.sqrt((opaqueArea * fillRatio) / targetCandidates))

      for (let y = minY; y <= maxY; y += gridStep) {
        for (let x = minX; x <= maxX; x += gridStep) {
          // jitter within grid cell
          const jx = Math.round(x + (Math.random() - 0.5) * gridStep * 0.9)
          const jy = Math.round(y + (Math.random() - 0.5) * gridStep * 0.9)
          if (jx < 0 || jx >= imgW || jy < 0 || jy >= imgH) continue
          const idx = (jy * imgW + jx) * 4
          if (data[idx + 3] < 100) continue

          const r   = data[idx]
          const g   = data[idx + 1]
          const b   = data[idx + 2]
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          // Rejection: bright pixels accepted more often
          if (Math.random() > Math.pow(lum + 0.08, 1.6)) continue

          collected.push({ px: jx, py: jy, r, g, b, lum })
          if (collected.length >= maxCount) break
        }
        if (collected.length >= maxCount) break
      }

      const N = collected.length

      const homePos   = new Float32Array(N * 3)
      const scatterPos= new Float32Array(N * 3)
      const normYs    = new Float32Array(N)
      const rands     = new Float32Array(N)
      const rand2s    = new Float32Array(N * 2)
      const colorsArr = new Float32Array(N * 3)
      const sizesArr  = new Float32Array(N)
      const brightArr = new Float32Array(N)

      const spanY = Math.max(1, maxY - minY)
      const dpr   = Math.min(window.devicePixelRatio || 1, 2)

      for (let i = 0; i < N; i++) {
        const pt = collected[i]

        // Map pixel → Three.js world coordinates (centered)
        const hx = (pt.px / imgW - 0.5) * tgtW
        const hy = (0.5 - pt.py / imgH) * tgtH

        // Subtle 3D curvature: face slightly forward
        const faceCX = (CONFIG.FACE_CX - 0.5) * tgtW
        const faceCY = (0.5 - CONFIG.FACE_CY) * tgtH
        const dFace  = Math.hypot(hx - faceCX, hy - faceCY)
        const relief = Math.max(0, 1 - dFace / 200) * 18
        const hz     = (Math.random() - 0.5) * 24 + relief

        homePos[i * 3]     = hx
        homePos[i * 3 + 1] = hy
        homePos[i * 3 + 2] = hz

        // Intro: scatter outward in a sphere
        const ang = Math.random() * Math.PI * 2
        const rad = 220 + Math.random() * 480
        scatterPos[i * 3]     = hx + Math.cos(ang) * rad
        scatterPos[i * 3 + 1] = hy + Math.sin(ang) * rad + (Math.random() - 0.5) * 180
        scatterPos[i * 3 + 2] = hz + (Math.random() - 0.5) * 320

        normYs[i]      = Math.max(0, Math.min(1, (maxY - pt.py) / spanY))
        rands[i]       = Math.random()
        rand2s[i * 2]  = Math.random()
        rand2s[i * 2+1]= Math.random()

        // ── Color: actual photo pixel with warm shift + gold accents ──────
        const isGold = Math.random() < CONFIG.GOLD_RATIO
        if (isGold) {
          colorsArr[i * 3]     = goldR
          colorsArr[i * 3 + 1] = goldG
          colorsArr[i * 3 + 2] = goldB
        } else {
          // Apply slight warmth: boost red, reduce blue a touch
          const wr = Math.min(1, (pt.r / 255) * 1.06)
          const wg = pt.g / 255
          const wb = Math.max(0, (pt.b / 255) * 0.93)
          colorsArr[i * 3]     = wr
          colorsArr[i * 3 + 1] = wg
          colorsArr[i * 3 + 2] = wb
        }

        // ── Dot size: luminance-driven, DOT_MIN..DOT_MAX * DPR ───────────
        const rawSize = CONFIG.DOT_MIN + (CONFIG.DOT_MAX - CONFIG.DOT_MIN) * pt.lum
        sizesArr[i]   = rawSize * dpr
        brightArr[i]  = pt.lum
      }

      pointsGeo = new THREE.BufferGeometry()
      pointsGeo.setAttribute('position',    new THREE.BufferAttribute(homePos,    3))
      pointsGeo.setAttribute('aHomePos',    new THREE.BufferAttribute(homePos,    3))
      pointsGeo.setAttribute('aScatterPos', new THREE.BufferAttribute(scatterPos, 3))
      pointsGeo.setAttribute('aNormY',      new THREE.BufferAttribute(normYs,     1))
      pointsGeo.setAttribute('aRandom',     new THREE.BufferAttribute(rands,      1))
      pointsGeo.setAttribute('aRandom2',    new THREE.BufferAttribute(rand2s,     2))
      pointsGeo.setAttribute('aColor',      new THREE.BufferAttribute(colorsArr,  3))
      pointsGeo.setAttribute('aSize',       new THREE.BufferAttribute(sizesArr,   1))
      pointsGeo.setAttribute('aBright',     new THREE.BufferAttribute(brightArr,  1))

      // ── Shader material ────────────────────────────────────────────────
      pointsMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime:          { value: 0 },
          uIntroP:        { value: 0 },
          uScrollP:       { value: 0 },
          uCursorScreen:  { value: new THREE.Vector2(-9999, -9999) },
          uResolution:    { value: new THREE.Vector2(width, height) },
          uLensR:         { value: lensRadius },
          uLensAlpha:     { value: 0 },
          uScatterSpread: { value: CONFIG.SCATTER_SPREAD },
          uPushStr:       { value: CONFIG.LENS_PUSH },
          uReducedMotion: { value: stateRef.current.prefersReducedMotion ? 1.0 : 0.0 },
        },
        vertexShader: /* glsl */`
          uniform float uTime;
          uniform float uIntroP;
          uniform float uScrollP;
          uniform vec2  uCursorScreen;
          uniform vec2  uResolution;
          uniform float uLensR;
          uniform float uLensAlpha;
          uniform float uScatterSpread;
          uniform float uPushStr;
          uniform float uReducedMotion;

          attribute vec3  aHomePos;
          attribute vec3  aScatterPos;
          attribute float aNormY;
          attribute float aRandom;
          attribute vec2  aRandom2;
          attribute vec3  aColor;
          attribute float aSize;
          attribute float aBright;

          varying vec3  vColor;
          varying float vAlpha;

          void main() {
            vec3 pos = aHomePos;

            // ── 1. Intro convergence ──────────────────────────────────────
            if (uReducedMotion < 0.5) {
              float delay   = (1.0 - aNormY) * 0.32 + aRandom * 0.38;
              float localP  = clamp((uIntroP - delay) / max(1.0 - delay, 0.0001), 0.0, 1.0);
              float eased   = 1.0 - pow(1.0 - localP, 3.0);
              pos            = mix(aScatterPos, aHomePos, eased);
            }

            // ── 2. Idle breathing ─────────────────────────────────────────
            if (uIntroP >= 0.95 && uReducedMotion < 0.5) {
              pos.z += sin(uTime * 1.1) * 1.6 * aBright;
            }

            // ── 3. Scroll scatter ─────────────────────────────────────────
            float scatterAlpha = 1.0;
            if (uReducedMotion > 0.5) {
              scatterAlpha = 1.0 - smoothstep(0.05, 0.80, uScrollP);
            } else if (uScrollP > 0.03) {
              float s       = clamp((uScrollP - 0.03) / (0.90 - 0.03), 0.0, 1.0);
              float stagger = (1.0 - aNormY) * 0.22 + aRandom * 0.28;
              if (s > stagger) {
                float ls    = (s - stagger) / max(1.0 - stagger, 0.0001);
                float ease  = ls * ls * (3.0 - 2.0 * ls);

                vec3 outDir  = normalize(vec3(aHomePos.xy, (aRandom2.x - 0.5) * 60.0) + vec3(0.001));
                vec3 randDir = normalize(vec3(aRandom - 0.5, aRandom2.y - 0.5, aRandom2.x - 0.5));
                vec3 dir     = normalize(outDir * 0.6 + randDir * 0.6);
                float spread = uScatterSpread + aRandom * 420.0;

                float swAngle = ease * 3.0 + aRandom * 6.28318;
                vec3 swirl    = vec3(cos(swAngle), sin(swAngle), sin(swAngle * 1.4)) * (38.0 * ease);

                pos = mix(aHomePos, aHomePos + dir * spread * ease + swirl, ease);
              }

              if (uScrollP > 0.72) {
                scatterAlpha = 1.0 - smoothstep(0.72, 0.98, uScrollP);
              }
            }

            // ── 4. Clip-space coords for lens interaction ─────────────────
            vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
            vec4 projPos = projectionMatrix * mvPos;
            vec2 ndc     = projPos.xy / projPos.w;
            vec2 screenXY= (ndc * 0.5 + 0.5) * uResolution;

            // ── 5. Particle spreading / repulsion away from cursor ─────────
            float dCursor = distance(screenXY, uCursorScreen);
            if (uLensAlpha > 0.01 && uScrollP < 0.20 && dCursor < uLensR * 1.5) {
              float repelFactor = 1.0 - smoothstep(0.0, uLensR * 1.5, dCursor);
              vec2  pushDir     = normalize(screenXY - uCursorScreen + vec2(0.0001, 0.0001));

              // Physical push so dots disperse and spread away from cursor
              float force = pow(repelFactor, 1.3) * (uPushStr + aRandom * 30.0);
              pos.xy += pushDir * (force * uLensAlpha);
              pos.z  += (repelFactor * 24.0 * (aRandom - 0.2)) * uLensAlpha;

              // Recompute after push
              mvPos   = modelViewMatrix * vec4(pos, 1.0);
              projPos = projectionMatrix * mvPos;
              ndc     = projPos.xy / projPos.w;
              screenXY= (ndc * 0.5 + 0.5) * uResolution;
              dCursor = distance(screenXY, uCursorScreen);
            }

            gl_Position = projPos;

            // ── 6. Point size ─────────────────────────────────────────────
            // aSize already has DPR baked in; perspective scale via -mvPos.z
            float pSize   = aSize * (900.0 / -mvPos.z);
            gl_PointSize  = clamp(pSize, 0.5, 6.0);

            // ── 7. Alpha: soft organic clear zone + twinkle ───────────────
            // As dots spread outward, they organically dissolve in the inner region
            float clearZone = smoothstep(uLensR * 0.22, uLensR * 0.88, dCursor);
            float dotMask   = mix(1.0, clearZone, uLensAlpha * (1.0 - smoothstep(0.03, 0.18, uScrollP)));
            float twinkle   = sin(uTime * 2.3 + aRandom * 12.56) * 0.12;
            float introFade = smoothstep(0.0, 0.14, uIntroP);

            vColor = aColor;
            vAlpha = introFade * scatterAlpha * dotMask * (0.88 + twinkle);
          }
        `,
        fragmentShader: /* glsl */`
          varying vec3  vColor;
          varying float vAlpha;

          void main() {
            vec2  c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            // Soft round sprite with anti-alias falloff
            float alpha = vAlpha * (1.0 - smoothstep(0.36, 0.50, d));
            if (alpha <= 0.002) discard;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
      })

      pointsMesh = new THREE.Points(pointsGeo, pointsMat)
      portraitGroup.add(pointsMesh)

      // ── High-res lens photo plane ────────────────────────────────────────
      // Load fresh from TextureLoader (no canvas downgrade) for crisp reveal
      const texLoader = new THREE.TextureLoader()
      photoTex = texLoader.load('/hero/faizan-cutout.png', (tex) => {
        tex.minFilter    = THREE.LinearMipmapLinearFilter
        tex.magFilter    = THREE.LinearFilter
        tex.generateMipmaps = true
        try { tex.anisotropy = renderer.capabilities.getMaxAnisotropy() } catch (_) {}
        tex.needsUpdate  = true
      })

      const planeGeo = new THREE.PlaneGeometry(tgtW, tgtH)
      photoMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTexture:      { value: photoTex },
          uCursorScreen: { value: new THREE.Vector2(-9999, -9999) },
          uResolution:   { value: new THREE.Vector2(width, height) },
          uLensR:        { value: lensRadius },
          uLensAlpha:    { value: 0 },
          uScrollP:      { value: 0 },
        },
        vertexShader: /* glsl */`
          varying vec2 vUv;
          varying vec2 vScreenPos;
          uniform vec2 uResolution;
          void main() {
            vUv = uv;
            vec4 mv  = modelViewMatrix * vec4(position, 1.0);
            vec4 proj= projectionMatrix * mv;
            vScreenPos = (proj.xy / proj.w * 0.5 + 0.5) * uResolution;
            gl_Position = proj;
          }
        `,
        fragmentShader: /* glsl */`
          uniform sampler2D uTexture;
          uniform vec2  uCursorScreen;
          uniform float uLensR;
          uniform float uLensAlpha;
          uniform float uScrollP;
          varying vec2 vUv;
          varying vec2 vScreenPos;
          void main() {
            vec4 col = texture2D(uTexture, vUv);
            if (col.a < 0.01) discard;
            float d    = distance(vScreenPos, uCursorScreen);
            // Soft organic reveal matching the parted particles, with zero circular ring or hard edge
            float mask = 1.0 - smoothstep(uLensR * 0.25, uLensR * 0.95, d);
            float sFade= 1.0 - smoothstep(0.03, 0.18, uScrollP);
            float a    = col.a * mask * uLensAlpha * sFade;
            if (a <= 0.002) discard;
            gl_FragColor = vec4(col.rgb, a);
          }
        `,
      })

      photoMesh = new THREE.Mesh(planeGeo, photoMat)
      photoMesh.position.z = -1
      portraitGroup.add(photoMesh)

      // Store face center in world-space for auto-sweep
      stateRef.current.faceCenterWorld = {
        x: (CONFIG.FACE_CX - 0.5) * tgtW,
        y: (0.5 - CONFIG.FACE_CY) * tgtH,
        tgtW,
        tgtH,
      }
    } // end img.onload

    // ── Interaction handlers ──────────────────────────────────────────────
    const onMouseMove = (e) => {
      stateRef.current.isTouch = false
      stateRef.current.lastInteractionTime = performance.now()
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      stateRef.current.mouseRaw    = { x: mx, y: my }
      stateRef.current.mouseTarget = { x: (mx / rect.width - 0.5) * 2, y: (my / rect.height - 0.5) * 2, active: true }

      // Cancel auto-sweep on user interaction
      stateRef.current.autoSweep.active = false
      stateRef.current.autoSweep.done   = true

      if (sparkles.length < 32 && Math.random() < 0.5) {
        const gc = new THREE.Color(CONFIG.GOLD_COLOR)
        sparkles.push({
          x: mx, y: my,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6 - 0.5,
          size: 1.8 + Math.random() * 2.2,
          alpha: 1.0,
          color: Math.random() < 0.35 ? CONFIG.GOLD_COLOR : '#EDE6D6',
        })
      }
      onHeroHover(true)
    }

    const onMouseLeave = () => {
      stateRef.current.mouseTarget.active = false
      stateRef.current.mouseRaw = { x: -9999, y: -9999 }
      onHeroHover(false)
    }

    const onTouchStart = (e) => {
      stateRef.current.isTouch = true
      stateRef.current.lastInteractionTime = performance.now()
      stateRef.current.autoSweep.active = false
      stateRef.current.autoSweep.done   = true
      if (e.touches?.[0]) {
        const rect = container.getBoundingClientRect()
        const mx = e.touches[0].clientX - rect.left
        const my = e.touches[0].clientY - rect.top
        stateRef.current.mouseRaw    = { x: mx, y: my }
        stateRef.current.mouseTarget = { x: (mx / rect.width - 0.5) * 2, y: (my / rect.height - 0.5) * 2, active: true }
      }
    }

    const onTouchMove = (e) => {
      if (e.touches?.[0]) {
        stateRef.current.lastInteractionTime = performance.now()
        const rect = container.getBoundingClientRect()
        const mx = e.touches[0].clientX - rect.left
        const my = e.touches[0].clientY - rect.top
        stateRef.current.mouseRaw    = { x: mx, y: my }
        stateRef.current.mouseTarget = { x: (mx / rect.width - 0.5) * 2, y: (my / rect.height - 0.5) * 2, active: true }
      }
    }

    const onTouchEnd = () => { stateRef.current.mouseTarget.active = false }

    container.addEventListener('mousemove',  onMouseMove)
    container.addEventListener('mouseenter', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove',  onTouchMove,  { passive: true })
    container.addEventListener('touchend',   onTouchEnd,   { passive: true })

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!containerRef.current) return
      width  = containerRef.current.clientWidth  || window.innerWidth
      height = containerRef.current.clientHeight || window.innerHeight
      camera.aspect = width / height
      camera.position.z = camDist(height)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      lensRadius = calcLensRadius(width)
      if (sparkleCanvas) { sparkleCanvas.width = width; sparkleCanvas.height = height }
      if (pointsMat) { pointsMat.uniforms.uResolution.value.set(width, height); pointsMat.uniforms.uLensR.value = lensRadius }
      if (photoMat)  { photoMat.uniforms.uResolution.value.set(width, height);  photoMat.uniforms.uLensR.value  = lensRadius }
    }
    window.addEventListener('resize', onResize)

    // ── Intersection observer ─────────────────────────────────────────────
    let isIntersecting = true
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { isIntersecting = e.isIntersecting; stateRef.current.isVisible = e.isIntersecting })
    }, { threshold: 0.05 })
    observer.observe(container)

    // ── RAF loop ──────────────────────────────────────────────────────────
    let rafId = 0
    let tiltX = 0, tiltY = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      if (!isIntersecting) return

      const now    = performance.now()
      const timeSec= now * 0.001
      const st     = stateRef.current

      // Intro progress
      let introP = 1.0
      if (st.isLoaded && st.introStartTime > 0) {
        introP = Math.min(1.0, (now - st.introStartTime) / 1000 / CONFIG.INTRO_DURATION)
      } else if (!st.isLoaded) {
        introP = 0.0
      }

      // ── Auto-sweep after intro ──────────────────────────────────────────
      const sweep = st.autoSweep
      if (introP >= 1.0 && !sweep.done && !sweep.active && !st.mouseTarget.active) {
        // Delay 0.4s after intro completes before starting sweep
        if (!sweep._pendingStart) { sweep._pendingStart = now }
        else if (now - sweep._pendingStart > 400) {
          sweep.active    = true
          sweep.startTime = now
          sweep._pendingStart = null
        }
      }

      let targetLensX = st.mouseRaw.x
      let targetLensY = st.mouseRaw.y
      let targetScale = st.mouseTarget.active && st.scrollProgress < 0.25 ? 1.0 : 0.0

      const idleElapsed = (now - st.lastInteractionTime) / 1000

      if (sweep.active && st.faceCenterWorld) {
        // 2s sweep: arc across the face from left to right and back to center
        const sweepDur = 2200   // ms
        const t = (now - sweep.startTime) / sweepDur
        if (t >= 1.0) {
          sweep.active = false
          sweep.done   = true
        } else {
          // Project face center to screen space
          // Simple estimate: portrait is centered horizontally, face at faceCY from top
          const faceScreenX = width * 0.5 + (portraitGroup.position.x || 0)
          const faceScreenY = height * 0.5 - st.faceCenterWorld.y * (height / (st.faceCenterWorld.tgtH || height))
          const sweepRadius = st.faceCenterWorld.tgtW * 0.22
          const angle = Math.PI + Math.sin(t * Math.PI) * Math.PI * 0.6
          targetLensX  = faceScreenX + Math.cos(angle) * sweepRadius
          targetLensY  = faceScreenY + Math.sin(angle) * sweepRadius * 0.4
          targetScale  = 1.0
          st.mouseTarget.x = (targetLensX / width  - 0.5) * 2
          st.mouseTarget.y = (targetLensY / height - 0.5) * 2
        }
      } else if (idleElapsed > 3.0 && (isMobile || st.isTouch || !st.mouseTarget.active)) {
        // Lissajous drift over face
        const cx = width  * 0.50
        const cy = height * (isMobile ? 0.38 : 0.44)
        const rx = width  * (isMobile ? 0.18 : 0.13)
        const ry = height * (isMobile ? 0.10 : 0.14)
        const lT = (idleElapsed - 3.0) * 0.9
        targetLensX = cx + Math.sin(lT)         * rx
        targetLensY = cy + Math.sin(lT * 1.5 + 0.6) * ry
        targetScale = st.scrollProgress < 0.25 ? 1.0 : 0.0
        st.mouseTarget.x = (targetLensX / width  - 0.5) * 1.2
        st.mouseTarget.y = (targetLensY / height - 0.5) * 1.2
      }

      // Lens lerp + spring scale
      const lens = st.lensCurrent
      lens.x += (targetLensX - lens.x) * CONFIG.LENS_FOLLOW
      lens.y += (targetLensY - lens.y) * CONFIG.LENS_FOLLOW

      const springK  = 0.18, springDamp = 0.72
      lens.velScale += (targetScale - lens.scale) * springK
      lens.velScale *= springDamp
      lens.scale    += lens.velScale
      if (lens.scale < 0.001 && targetScale === 0) { lens.scale = 0; lens.velScale = 0 }

      // GL cursor (Y flipped)
      const glCursor = new THREE.Vector2(lens.x, height - lens.y)

      // Tilt & shift
      const tnx = st.mouseTarget.active || idleElapsed > 3.0 ? st.mouseTarget.x : 0
      const tny = st.mouseTarget.active || idleElapsed > 3.0 ? st.mouseTarget.y : 0
      tiltX += (tnx - tiltX) * CONFIG.TILT_DAMPING
      tiltY += (tny - tiltY) * CONFIG.TILT_DAMPING

      const maxTiltRad = CONFIG.TILT_MAX_DEG * Math.PI / 180
      portraitGroup.rotation.y  =  tiltX * maxTiltRad
      portraitGroup.rotation.x  = -tiltY * maxTiltRad
      portraitGroup.position.x  =  tiltX * CONFIG.SHIFT_MAX_PX
      portraitGroup.position.y  = (isMobile ? 0 : -height * 0.03) - tiltY * CONFIG.SHIFT_MAX_PX

      // Update uniforms
      if (pointsMat) {
        pointsMat.uniforms.uTime.value         = timeSec
        pointsMat.uniforms.uIntroP.value       = introP
        pointsMat.uniforms.uScrollP.value      = st.scrollProgress
        pointsMat.uniforms.uCursorScreen.value .copy(glCursor)
        pointsMat.uniforms.uLensR.value        = lensRadius * lens.scale
        pointsMat.uniforms.uLensAlpha.value    = lens.scale
      }
      if (photoMat) {
        photoMat.uniforms.uCursorScreen.value.copy(glCursor)
        photoMat.uniforms.uLensR.value       = lensRadius * lens.scale
        photoMat.uniforms.uLensAlpha.value   = lens.scale
        photoMat.uniforms.uScrollP.value     = st.scrollProgress
      }

      // Dot HTML
      if (dotEl) {
        const show = st.mouseTarget.active && st.scrollProgress < 0.25
        dotEl.style.transform = `translate3d(${st.mouseRaw.x}px,${st.mouseRaw.y}px,0) translate(-50%,-50%)`
        dotEl.style.opacity   = show ? '1' : '0'
      }

      // Sparkle trail
      if (sparkleCtx && sparkles.length > 0) {
        sparkleCtx.clearRect(0, 0, width, height)
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const sp = sparkles[i]
          sp.x += sp.vx; sp.y += sp.vy; sp.alpha -= 0.03
          if (sp.alpha <= 0) { sparkles.splice(i, 1); continue }
          sparkleCtx.save()
          sparkleCtx.globalAlpha = Math.max(0, sp.alpha)
          sparkleCtx.fillStyle   = sp.color
          sparkleCtx.shadowColor = sp.color
          sparkleCtx.shadowBlur  = 6
          sparkleCtx.beginPath()
          sparkleCtx.arc(sp.x, sp.y, sp.size * sp.alpha, 0, Math.PI * 2)
          sparkleCtx.fill()
          sparkleCtx.restore()
        }
      }

      renderer.render(scene, camera)
    }

    rafId = requestAnimationFrame(animate)

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      container.removeEventListener('mousemove',  onMouseMove)
      container.removeEventListener('mouseenter', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove',  onTouchMove)
      container.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('resize',        onResize)
      if (pointsGeo) pointsGeo.dispose()
      if (pointsMat) pointsMat.dispose()
      if (photoMat)  photoMat.dispose()
      if (photoTex)  photoTex.dispose()
      renderer.dispose()
    }
  }, [isMobile]) // remount only on mobile↔desktop switch

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      data-hero-cursor="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        cursor: 'none',
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 1 }}
      />

      {/* Bottom fade gradient — blends portrait into background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18%',
          background: 'linear-gradient(to bottom, transparent 0%, #0C0C0E 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Sparkle trail canvas */}
      <canvas
        ref={sparkleCanvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}
      />

      {/* Small center dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#EDE6D6',
          boxShadow: '0 0 8px rgba(237,230,214,0.9)',
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform, opacity',
          zIndex: 5,
        }}
      />
    </div>
  )
}
