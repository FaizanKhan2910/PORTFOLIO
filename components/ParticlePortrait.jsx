'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * ─────────────────────────────────────────────
 *  CONFIG — All tunables for Portrait & About Sphere
 * ─────────────────────────────────────────────
 */
export const CONFIG = {
  COUNT: 100000,
  COUNT_MOBILE: 30000,
  DOT_MIN: 0.8,
  DOT_MAX: 1.6,
  LENS_RADIUS: [90, 0.09, 140],    // [minPx, vw fraction, maxPx] region of influence
  LENS_FOLLOW: 0.12,
  LENS_FEATHER: 2.0,
  LENS_PUSH: 55.0,               // Repulsion strength: dots spread and push away from cursor

  TILT_MAX_DEG: 7.0,
  SHIFT_MAX_PX: 20.0,
  TILT_DAMPING: 0.08,

  SCATTER_SPREAD: 700.0,
  INTRO_DURATION: 2.2,
  GOLD_RATIO: 0.03,
  GOLD_COLOR: '#C9A878',

  // Face center in cutout (520×845 px), normalized
  FACE_CX: 0.496,
  FACE_CY: 0.211,

  // About 3D Particle Sphere
  SPHERE_RADIUS_DESKTOP: 200,
  SPHERE_RADIUS_MOBILE: 135,
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

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 10) continue
    d[i] = sCurve(d[i])
    d[i + 1] = sCurve(d[i + 1])
    d[i + 2] = sCurve(d[i + 2])
  }
  ctx.putImageData(src, 0, 0)

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
  const amount = 0.55

  for (let i = 0; i < sd.length; i += 4) {
    if (sd[i + 3] < 10) continue
    for (let c = 0; c < 3; c++) {
      const sharpened = sd[i + c] + amount * (sd[i + c] - bd[i + c])
      sd[i + c] = Math.max(0, Math.min(255, sharpened))
    }
  }
  ctx.putImageData(sharp, 0, 0)
}

export default function ParticlePortrait({ isLoaded = true }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const dotRef = useRef(null)
  const sparkleCanvasRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  const stateRef = useRef({
    heroScroll: 0,
    sphereMorph: 0,
    sphereFade: 1,
    sphereCenter: new THREE.Vector3(-300, 0, 0),
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
    autoSweep: { active: false, done: false, startTime: 0 },
  })

  useEffect(() => {
    stateRef.current.isLoaded = isLoaded
    if (isLoaded && !stateRef.current.hasIntroStarted) {
      stateRef.current.hasIntroStarted = true
      stateRef.current.introStartTime = performance.now()
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

  // ─── Main Three.js Scene: Portrait + Scatter + About Sphere ─────────────────
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const dotEl = dotRef.current
    const sparkleCanvas = sparkleCanvasRef.current
    if (!container || !canvas) return

    let width = window.innerWidth
    let height = window.innerHeight

    // ── Sparkle trail ──────────────────────────────────────────────────────
    let sparkles = []
    let sparkleCtx = sparkleCanvas ? sparkleCanvas.getContext('2d') : null
    if (sparkleCanvas) {
      sparkleCanvas.width = width
      sparkleCanvas.height = height
    }

    // ── Three.js scene & camera ─────────────────────────────────────────────
    const scene = new THREE.Scene()
    const fov = 45
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 4000)
    const camDist = (h) => (h / 2) / Math.tan((fov * Math.PI / 180) / 2)
    camera.position.z = camDist(height)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    // Root group holding both particles and photo plane for unified tilt & shift
    const portraitGroup = new THREE.Group()
    scene.add(portraitGroup)

    let pointsMesh = null
    let photoMesh = null
    let wireMesh = null
    let pointsGeo = null
    let pointsMat = null
    let photoMat = null
    let photoTex = null

    let lensRadius = calcLensRadius(width)
    const sphereRadius = width < 768 ? CONFIG.SPHERE_RADIUS_MOBILE : CONFIG.SPHERE_RADIUS_DESKTOP

    // ── Inner Wireframe Sphere (delicate golden geodesic mesh from screenshot) ──
    const wireGeo = new THREE.IcosahedronGeometry(sphereRadius * 0.98, 3)
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#C9A878'),
      wireframe: true,
      transparent: true,
      opacity: 0,
    })
    wireMesh = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireMesh)

    // ── Load Cutout & Sample Points ──────────────────────────────────────────
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/hero/faizan-cutout.png'

    img.onload = () => {
      if (!containerRef.current) return

      const imgW = img.naturalWidth
      const imgH = img.naturalHeight
      const aspect = imgW / imgH

      const off = document.createElement('canvas')
      off.width = imgW
      off.height = imgH
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(img, 0, 0, imgW, imgH)
      boostContrast(octx, imgW, imgH)
      const data = octx.getImageData(0, 0, imgW, imgH).data

      const isMob = width < 768
      const tgtH = isMob ? Math.min(height * 0.72, 520) : Math.min(height * 0.92, 880)
      const tgtW = tgtH * aspect
      const maxCount = isMob ? CONFIG.COUNT_MOBILE : CONFIG.COUNT

      const gc = new THREE.Color(CONFIG.GOLD_COLOR)
      const goldR = gc.r, goldG = gc.g, goldB = gc.b

      let minX = imgW, maxX = 0, minY = imgH, maxY = 0
      for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
          if (data[(y * imgW + x) * 4 + 3] > 100) {
            if (x < minX) minX = x; if (x > maxX) maxX = x
            if (y < minY) minY = y; if (y > maxY) maxY = y
          }
        }
      }

      const opaqueArea = (maxX - minX) * (maxY - minY)
      const targetCandidates = maxCount / 0.38
      const gridStep = Math.max(1, Math.sqrt((opaqueArea * 0.70) / targetCandidates))

      const collected = []
      for (let y = minY; y <= maxY; y += gridStep) {
        for (let x = minX; x <= maxX; x += gridStep) {
          const jx = Math.round(x + (Math.random() - 0.5) * gridStep * 0.9)
          const jy = Math.round(y + (Math.random() - 0.5) * gridStep * 0.9)
          if (jx < 0 || jx >= imgW || jy < 0 || jy >= imgH) continue
          const idx = (jy * imgW + jx) * 4
          if (data[idx + 3] < 100) continue

          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          if (Math.random() > Math.pow(lum + 0.08, 1.6)) continue

          collected.push({ px: jx, py: jy, r, g, b, lum })
          if (collected.length >= maxCount) break
        }
        if (collected.length >= maxCount) break
      }

      const N = collected.length

      const homePos = new Float32Array(N * 3)
      const scatterPos = new Float32Array(N * 3)
      const spherePos = new Float32Array(N * 3)
      const sphereNormals = new Float32Array(N * 3)
      const normYs = new Float32Array(N)
      const rands = new Float32Array(N)
      const rand2s = new Float32Array(N * 2)
      const colorsArr = new Float32Array(N * 3)
      const sizesArr = new Float32Array(N)
      const brightArr = new Float32Array(N)

      const spanY = Math.max(1, maxY - minY)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      // Fibonacci sphere angle constant
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const angleIncrement = Math.PI * 2 * goldenRatio

      for (let i = 0; i < N; i++) {
        const pt = collected[i]

        // 1. Home portrait position
        const hx = (pt.px / imgW - 0.5) * tgtW
        const hy = (0.5 - pt.py / imgH) * tgtH
        const faceCX = (CONFIG.FACE_CX - 0.5) * tgtW
        const faceCY = (0.5 - CONFIG.FACE_CY) * tgtH
        const dFace = Math.hypot(hx - faceCX, hy - faceCY)
        const relief = Math.max(0, 1 - dFace / 200) * 18
        const hz = (Math.random() - 0.5) * 24 + relief

        homePos[i * 3] = hx
        homePos[i * 3 + 1] = hy
        homePos[i * 3 + 2] = hz

        // 2. Intro burst scatter position
        const ang = Math.random() * Math.PI * 2
        const rad = 220 + Math.random() * 480
        scatterPos[i * 3] = hx + Math.cos(ang) * rad
        scatterPos[i * 3 + 1] = hy + Math.sin(ang) * rad + (Math.random() - 0.5) * 180
        scatterPos[i * 3 + 2] = hz + (Math.random() - 0.5) * 320

        // 3. Target position on the 3D Fibonacci Sphere (About Me)
        const t = (i + 0.5) / N
        const inclination = Math.acos(1 - 2 * t)
        const azimuth = angleIncrement * i

        // Volumetric depth: 82% on shell surface, 18% inside core
        const isCore = Math.random() < 0.18
        const rMult = isCore ? (0.35 + 0.55 * Math.random()) : (0.92 + 0.16 * (Math.random() - 0.5))
        const curR = sphereRadius * rMult

        const nx = Math.sin(inclination) * Math.cos(azimuth)
        const ny = Math.sin(inclination) * Math.sin(azimuth)
        const nz = Math.cos(inclination)

        spherePos[i * 3 + 0] = nx * curR
        spherePos[i * 3 + 1] = ny * curR
        spherePos[i * 3 + 2] = nz * curR

        sphereNormals[i * 3 + 0] = nx
        sphereNormals[i * 3 + 1] = ny
        sphereNormals[i * 3 + 2] = nz

        normYs[i] = Math.max(0, Math.min(1, (maxY - pt.py) / spanY))
        rands[i] = Math.random()
        rand2s[i * 2] = Math.random()
        rand2s[i * 2 + 1] = Math.random()

        // Color in portrait mode
        const isGold = Math.random() < CONFIG.GOLD_RATIO
        if (isGold) {
          colorsArr[i * 3] = goldR
          colorsArr[i * 3 + 1] = goldG
          colorsArr[i * 3 + 2] = goldB
        } else {
          colorsArr[i * 3] = Math.min(1, (pt.r / 255) * 1.06)
          colorsArr[i * 3 + 1] = pt.g / 255
          colorsArr[i * 3 + 2] = Math.max(0, (pt.b / 255) * 0.93)
        }

        const rawSize = CONFIG.DOT_MIN + (CONFIG.DOT_MAX - CONFIG.DOT_MIN) * pt.lum
        sizesArr[i] = rawSize * dpr
        brightArr[i] = pt.lum
      }

      pointsGeo = new THREE.BufferGeometry()
      pointsGeo.setAttribute('position', new THREE.BufferAttribute(homePos, 3))
      pointsGeo.setAttribute('aHomePos', new THREE.BufferAttribute(homePos, 3))
      pointsGeo.setAttribute('aScatterPos', new THREE.BufferAttribute(scatterPos, 3))
      pointsGeo.setAttribute('aSpherePos', new THREE.BufferAttribute(spherePos, 3))
      pointsGeo.setAttribute('aSphereNormal', new THREE.BufferAttribute(sphereNormals, 3))
      pointsGeo.setAttribute('aNormY', new THREE.BufferAttribute(normYs, 1))
      pointsGeo.setAttribute('aRandom', new THREE.BufferAttribute(rands, 1))
      pointsGeo.setAttribute('aRandom2', new THREE.BufferAttribute(rand2s, 2))
      pointsGeo.setAttribute('aColor', new THREE.BufferAttribute(colorsArr, 3))
      pointsGeo.setAttribute('aSize', new THREE.BufferAttribute(sizesArr, 1))
      pointsGeo.setAttribute('aBright', new THREE.BufferAttribute(brightArr, 1))

      // ── Custom Shader: Portrait -> Scatter -> About Sphere ────────────────
      pointsMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntroP: { value: 0 },
          uHeroScroll: { value: 0 },
          uSphereMorph: { value: 0 },
          uSphereFade: { value: 1 },
          uSphereCenter: { value: new THREE.Vector3(-300, 0, 0) },
          uCursorScreen: { value: new THREE.Vector2(-9999, -9999) },
          uResolution: { value: new THREE.Vector2(width, height) },
          uLensR: { value: lensRadius },
          uLensAlpha: { value: 0 },
          uScatterSpread: { value: CONFIG.SCATTER_SPREAD },
          uPushStr: { value: CONFIG.LENS_PUSH },
          uReducedMotion: { value: stateRef.current.prefersReducedMotion ? 1.0 : 0.0 },
          uPixelRatio: { value: dpr },
        },
        vertexShader: /* glsl */`
          uniform float uTime;
          uniform float uIntroP;
          uniform float uHeroScroll;
          uniform float uSphereMorph;
          uniform float uSphereFade;
          uniform vec3  uSphereCenter;
          uniform vec2  uCursorScreen;
          uniform vec2  uResolution;
          uniform float uLensR;
          uniform float uLensAlpha;
          uniform float uScatterSpread;
          uniform float uPushStr;
          uniform float uReducedMotion;
          uniform float uPixelRatio;

          attribute vec3  aHomePos;
          attribute vec3  aScatterPos;
          attribute vec3  aSpherePos;
          attribute vec3  aSphereNormal;
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

            // ── 1. Intro convergence into portrait ────────────────────────
            if (uReducedMotion < 0.5) {
              float delay   = (1.0 - aNormY) * 0.32 + aRandom * 0.38;
              float localP  = clamp((uIntroP - delay) / max(1.0 - delay, 0.0001), 0.0, 1.0);
              float eased   = 1.0 - pow(1.0 - localP, 3.0);
              pos           = mix(aScatterPos, aHomePos, eased);
            }

            // ── 2. Idle breathing on portrait ─────────────────────────────
            if (uIntroP >= 0.95 && uReducedMotion < 0.5 && uHeroScroll < 0.10) {
              pos.z += sin(uTime * 1.1) * 1.6 * aBright;
            }

            // ── 3. Scroll Scatter across 3D screen ────────────────────────
            float scatterAlpha = 1.0;
            if (uReducedMotion > 0.5) {
              scatterAlpha = 1.0 - smoothstep(0.05, 0.80, uHeroScroll);
            } else if (uHeroScroll > 0.03) {
              float s       = clamp((uHeroScroll - 0.03) / (0.75 - 0.03), 0.0, 1.0);
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
            }

            // ── 4. Cursor Repulsion / Spreading in Hero Mode ──────────────
            vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
            vec4 projPos = projectionMatrix * mvPos;
            vec2 ndc     = projPos.xy / projPos.w;
            vec2 screenXY= (ndc * 0.5 + 0.5) * uResolution;

            float dCursor = distance(screenXY, uCursorScreen);
            float dotMask = 1.0;

            if (uLensAlpha > 0.01 && uHeroScroll < 0.20 && uSphereMorph < 0.15 && dCursor < uLensR * 1.5) {
              float repelFactor = 1.0 - smoothstep(0.0, uLensR * 1.5, dCursor);
              vec2  pushDir     = normalize(screenXY - uCursorScreen + vec2(0.0001, 0.0001));

              float force = pow(repelFactor, 1.3) * (uPushStr + aRandom * 30.0);
              pos.xy += pushDir * (force * uLensAlpha);
              pos.z  += (repelFactor * 24.0 * (aRandom - 0.2)) * uLensAlpha;

              mvPos   = modelViewMatrix * vec4(pos, 1.0);
              projPos = projectionMatrix * mvPos;
              ndc     = projPos.xy / projPos.w;
              screenXY= (ndc * 0.5 + 0.5) * uResolution;
              dCursor = distance(screenXY, uCursorScreen);

              float clearZone = smoothstep(uLensR * 0.22, uLensR * 0.88, dCursor);
              dotMask = mix(1.0, clearZone, uLensAlpha * (1.0 - smoothstep(0.03, 0.18, uHeroScroll)));
            }

            // ── 5. MORPH & GATHER INTO ABOUT 3D PARTICLE SPHERE ───────────
            if (uSphereMorph > 0.001) {
              // Surface wave undulation on sphere
              vec3 sNorm = aSphereNormal;
              float wave1 = sin(sNorm.x * 4.0 + uTime * 2.2) * cos(sNorm.y * 4.0 + uTime * 1.8);
              float wave2 = sin(sNorm.z * 5.5 + uTime * 2.6) * 0.45;
              float wave3 = cos((sNorm.x + sNorm.z) * 4.8 - uTime * 2.0) * 0.35;
              float waveDisplacement = (wave1 + wave2 + wave3) * (15.0 * uSphereMorph);

              vec3 deformedSphere = aSpherePos + sNorm * waveDisplacement;

              // Smooth continuous 3D rotation of the sphere
              float sRotY = uTime * 0.22;
              float cosY = cos(sRotY);
              float sinY = sin(sRotY);
              vec3 rotSphere = vec3(
                deformedSphere.x * cosY - deformedSphere.z * sinY,
                deformedSphere.y,
                deformedSphere.x * sinY + deformedSphere.z * cosY
              );

              float sRotX = sin(uTime * 0.16) * 0.15;
              float cosX = cos(sRotX);
              float sinX = sin(sRotX);
              rotSphere = vec3(
                rotSphere.x,
                rotSphere.y * cosX - rotSphere.z * sinX,
                rotSphere.y * sinX + rotSphere.z * cosX
              );

              // Target world position centered at About Me
              vec3 sphereTarget = uSphereCenter + rotSphere;

              // Staggered vortex spiral convergence
              float gatherStagger = aRandom * 0.28;
              float gatherP = clamp((uSphereMorph - gatherStagger) / (1.0 - gatherStagger + 0.0001), 0.0, 1.0);
              float gatherEase = gatherP * gatherP * (3.0 - 2.0 * gatherP);

              float vortexAngle = (1.0 - gatherEase) * 3.8 + aRandom * 6.28;
              vec3 vortex = vec3(
                cos(vortexAngle),
                sin(vortexAngle),
                sin(vortexAngle * 1.6)
              ) * (38.0 * (1.0 - gatherEase) * gatherEase);

              pos = mix(pos, sphereTarget + vortex, gatherEase);
            }

            // Recalculate projection
            mvPos   = modelViewMatrix * vec4(pos, 1.0);
            projPos = projectionMatrix * mvPos;
            gl_Position = projPos;

            // ── 6. Point Size ─────────────────────────────────────────────
            float pSizePortrait = aSize * (900.0 / -mvPos.z);
            float pSizeSphere   = (1.2 + aRandom * 1.2) * uPixelRatio * (850.0 / -mvPos.z);
            float finalPSize    = mix(pSizePortrait, pSizeSphere, uSphereMorph);
            gl_PointSize        = clamp(finalPSize, 0.6, 6.0);

            // ── 7. Color & Alpha Transformation ───────────────────────────
            // Color smoothly transforms into glowing gold / cream / bronze palette on sphere
            vec3 sphereGold = mix(vec3(0.79, 0.66, 0.47), vec3(0.93, 0.90, 0.84), aRandom);
            if (aRandom > 0.88) {
              sphereGold = vec3(0.83, 0.52, 0.48); // Rose gold accent
            }
            vColor = mix(aColor, sphereGold, uSphereMorph);

            float twinkle = sin(uTime * 2.3 + aRandom * 12.56) * 0.12;
            float introFade = smoothstep(0.0, 0.14, uIntroP);
            float portraitAlpha = introFade * scatterAlpha * dotMask * (0.88 + twinkle);

            float sphereTwinkle = sin(uTime * 3.2 + aRandom * 14.0) * 0.18;
            float sphereAlpha   = (0.86 + sphereTwinkle) * uSphereFade;

            vAlpha = mix(portraitAlpha, sphereAlpha, uSphereMorph);
          }
        `,
        fragmentShader: /* glsl */`
          varying vec3  vColor;
          varying float vAlpha;

          void main() {
            vec2  c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float alpha = vAlpha * (1.0 - smoothstep(0.36, 0.50, d));
            if (alpha <= 0.002) discard;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
      })

      pointsMesh = new THREE.Points(pointsGeo, pointsMat)
      portraitGroup.add(pointsMesh)

      // ── High-res lens photo plane (Hero mode) ────────────────────────────
      const texLoader = new THREE.TextureLoader()
      photoTex = texLoader.load('/hero/faizan-cutout.png', (tex) => {
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = true
        try { tex.anisotropy = renderer.capabilities.getMaxAnisotropy() } catch (_) { }
        tex.needsUpdate = true
      })

      const planeGeo = new THREE.PlaneGeometry(tgtW, tgtH)
      photoMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTexture: { value: photoTex },
          uCursorScreen: { value: new THREE.Vector2(-9999, -9999) },
          uResolution: { value: new THREE.Vector2(width, height) },
          uLensR: { value: lensRadius },
          uLensAlpha: { value: 0 },
          uHeroScroll: { value: 0 },
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
          uniform float uHeroScroll;
          varying vec2 vUv;
          varying vec2 vScreenPos;
          void main() {
            vec4 col = texture2D(uTexture, vUv);
            if (col.a < 0.01) discard;
            float d    = distance(vScreenPos, uCursorScreen);
            float mask = 1.0 - smoothstep(uLensR * 0.25, uLensR * 0.95, d);
            float sFade= 1.0 - smoothstep(0.03, 0.18, uHeroScroll);
            float a    = col.a * mask * uLensAlpha * sFade;
            if (a <= 0.002) discard;
            gl_FragColor = vec4(col.rgb, a);
          }
        `,
      })

      photoMesh = new THREE.Mesh(planeGeo, photoMat)
      photoMesh.position.z = -1
      portraitGroup.add(photoMesh)

      stateRef.current.faceCenterWorld = {
        x: (CONFIG.FACE_CX - 0.5) * tgtW,
        y: (0.5 - CONFIG.FACE_CY) * tgtH,
        tgtW,
        tgtH,
      }
    } // end img.onload

    // ── Interaction Handlers (Window-level mouse tracking) ─────────────────
    const onMouseMove = (e) => {
      stateRef.current.isTouch = false
      stateRef.current.lastInteractionTime = performance.now()
      const mx = e.clientX
      const my = e.clientY
      stateRef.current.mouseRaw = { x: mx, y: my }
      stateRef.current.mouseTarget = {
        x: (mx / window.innerWidth - 0.5) * 2,
        y: (my / window.innerHeight - 0.5) * 2,
        active: true
      }

      stateRef.current.autoSweep.active = false
      stateRef.current.autoSweep.done = true

      if (sparkles.length < 32 && Math.random() < 0.5 && stateRef.current.heroScroll < 0.15) {
        sparkles.push({
          x: mx, y: my,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6 - 0.5,
          size: 1.8 + Math.random() * 2.2,
          alpha: 1.0,
          color: Math.random() < 0.35 ? CONFIG.GOLD_COLOR : '#EDE6D6',
        })
      }
    }

    const onTouchMove = (e) => {
      if (e.touches?.[0]) {
        stateRef.current.isTouch = true
        stateRef.current.lastInteractionTime = performance.now()
        const mx = e.touches[0].clientX
        const my = e.touches[0].clientY
        stateRef.current.mouseRaw = { x: mx, y: my }
        stateRef.current.mouseTarget = {
          x: (mx / window.innerWidth - 0.5) * 2,
          y: (my / window.innerHeight - 0.5) * 2,
          active: true
        }
      }
    }

    const onMouseLeave = () => {
      stateRef.current.mouseTarget.active = false
      stateRef.current.mouseRaw = { x: -9999, y: -9999 }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)

    // ── Scroll Tracking: Measures Live Viewport Offsets ───────────────────
    const updateScrollMetrics = () => {
      const heroEl = document.getElementById('hero-wrapper')
      const aboutEl = document.getElementById('about')
      const vh = window.innerHeight

      // 1. Hero scroll progress (0..1)
      let heroP = 0
      if (heroEl) {
        const hRect = heroEl.getBoundingClientRect()
        const hScrollable = heroEl.offsetHeight - vh
        heroP = hScrollable > 0 ? Math.max(0, Math.min(1, -hRect.top / hScrollable)) : 0
      }

      // 2. About section gather progress (0..1)
      let aboutGatherP = 0
      let aboutFade = 1.0
      let targetX = -window.innerWidth * 0.22
      let targetY = 0

      if (aboutEl) {
        const aRect = aboutEl.getBoundingClientRect()
        // Gather starts when About is near entering bottom (vh * 1.15) and finishes when About is centered
        const gatherStart = vh * 1.15
        const gatherEnd = vh * 0.30
        aboutGatherP = Math.max(0, Math.min(1, (gatherStart - aRect.top) / (gatherStart - gatherEnd)))

        // Fade out when scrolling past About into Work
        if (aRect.bottom < vh * 0.70) {
          aboutFade = Math.max(0, Math.min(1, aRect.bottom / (vh * 0.70)))
        }

        // Align directly centered on "About Me." title
        const anchorEl = document.getElementById('about-sphere-anchor') || aboutEl.querySelector('h2')
        if (anchorEl) {
          const aBox = anchorEl.getBoundingClientRect()
          // Exact center of the heading / anchor
          const screenTargetX = aBox.left + aBox.width * 0.5
          const screenTargetY = aBox.top + aBox.height * 0.5

          // Convert screen pixels to Three.js centered world units at z=0
          targetX = screenTargetX - window.innerWidth * 0.5
          targetY = window.innerHeight * 0.5 - screenTargetY
        }
      }

      const st = stateRef.current
      st.heroScroll = heroP
      st.sphereMorph = aboutGatherP
      st.sphereFade = aboutFade
      st.sphereCenter.set(targetX, targetY, 0)
    }

    window.addEventListener('scroll', updateScrollMetrics, { passive: true })
    updateScrollMetrics()

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.position.z = camDist(height)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

      lensRadius = calcLensRadius(width)
      if (sparkleCanvas) {
        sparkleCanvas.width = width
        sparkleCanvas.height = height
      }
      if (pointsMat) {
        pointsMat.uniforms.uResolution.value.set(width, height)
        pointsMat.uniforms.uLensR.value = lensRadius
      }
      if (photoMat) {
        photoMat.uniforms.uResolution.value.set(width, height)
        photoMat.uniforms.uLensR.value = lensRadius
      }
      updateScrollMetrics()
    }
    window.addEventListener('resize', onResize)

    // ── RAF 60FPS Animation Loop ──────────────────────────────────────────
    let rafId = 0
    let tiltX = 0, tiltY = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      const now = performance.now()
      const timeSec = now * 0.001
      const st = stateRef.current

      updateScrollMetrics()

      // Pause WebGL rendering loop when scrolled past About into Work/Projects section (zero GPU lag)
      if (st.heroScroll >= 1.0 && st.sphereFade <= 0.001) {
        return
      }

      let introP = 1.0
      if (st.isLoaded && st.introStartTime > 0) {
        introP = Math.min(1.0, (now - st.introStartTime) / 1000 / CONFIG.INTRO_DURATION)
      } else if (!st.isLoaded) {
        introP = 0.0
      }

      // Auto-sweep across face on initial load
      const sweep = st.autoSweep
      if (introP >= 1.0 && !sweep.done && !sweep.active && !st.mouseTarget.active && st.heroScroll < 0.05) {
        if (!sweep._pendingStart) { sweep._pendingStart = now }
        else if (now - sweep._pendingStart > 400) {
          sweep.active = true
          sweep.startTime = now
          sweep._pendingStart = null
        }
      }

      let targetLensX = st.mouseRaw.x
      let targetLensY = st.mouseRaw.y
      let targetScale = st.mouseTarget.active && st.heroScroll < 0.15 ? 1.0 : 0.0

      const idleElapsed = (now - st.lastInteractionTime) / 1000

      if (sweep.active && st.faceCenterWorld) {
        const sweepDur = 2200
        const t = (now - sweep.startTime) / sweepDur
        if (t >= 1.0) {
          sweep.active = false
          sweep.done = true
        } else {
          const faceScreenX = width * 0.5 + (portraitGroup.position.x || 0)
          const faceScreenY = height * 0.5 - st.faceCenterWorld.y * (height / (st.faceCenterWorld.tgtH || height))
          const sweepRadius = st.faceCenterWorld.tgtW * 0.22
          const angle = Math.PI + Math.sin(t * Math.PI) * Math.PI * 0.6
          targetLensX = faceScreenX + Math.cos(angle) * sweepRadius
          targetLensY = faceScreenY + Math.sin(angle) * sweepRadius * 0.4
          targetScale = 1.0
          st.mouseTarget.x = (targetLensX / width - 0.5) * 2
          st.mouseTarget.y = (targetLensY / height - 0.5) * 2
        }
      }

      // Lens lerp
      const lens = st.lensCurrent
      lens.x += (targetLensX - lens.x) * CONFIG.LENS_FOLLOW
      lens.y += (targetLensY - lens.y) * CONFIG.LENS_FOLLOW

      const springK = 0.18, springDamp = 0.72
      lens.velScale += (targetScale - lens.scale) * springK
      lens.velScale *= springDamp
      lens.scale += lens.velScale
      if (lens.scale < 0.001 && targetScale === 0) { lens.scale = 0; lens.velScale = 0 }

      const glCursor = new THREE.Vector2(lens.x, height - lens.y)

      // Parallax Tilt & Shift (damped in hero mode)
      const tnx = st.mouseTarget.active ? st.mouseTarget.x : 0
      const tny = st.mouseTarget.active ? st.mouseTarget.y : 0
      tiltX += (tnx - tiltX) * CONFIG.TILT_DAMPING
      tiltY += (tny - tiltY) * CONFIG.TILT_DAMPING

      const maxTiltRad = CONFIG.TILT_MAX_DEG * Math.PI / 180
      const tiltInfluence = 1.0 - smoothstep(0.0, 0.5, st.heroScroll)
      portraitGroup.rotation.y = tiltX * maxTiltRad * tiltInfluence
      portraitGroup.rotation.x = -tiltY * maxTiltRad * tiltInfluence
      portraitGroup.position.x = tiltX * CONFIG.SHIFT_MAX_PX * tiltInfluence
      portraitGroup.position.y = ((window.innerWidth < 768 ? 0 : -height * 0.03) - tiltY * CONFIG.SHIFT_MAX_PX) * tiltInfluence

      // Update Shader Uniforms
      if (pointsMat) {
        pointsMat.uniforms.uTime.value = timeSec
        pointsMat.uniforms.uIntroP.value = introP
        pointsMat.uniforms.uHeroScroll.value = st.heroScroll
        pointsMat.uniforms.uSphereMorph.value = st.sphereMorph
        pointsMat.uniforms.uSphereFade.value = st.sphereFade
        pointsMat.uniforms.uSphereCenter.value.copy(st.sphereCenter)
        pointsMat.uniforms.uCursorScreen.value.copy(glCursor)
        pointsMat.uniforms.uLensR.value = lensRadius * lens.scale
        pointsMat.uniforms.uLensAlpha.value = lens.scale
      }
      if (photoMat) {
        photoMat.uniforms.uCursorScreen.value.copy(glCursor)
        photoMat.uniforms.uLensR.value = lensRadius * lens.scale
        photoMat.uniforms.uLensAlpha.value = lens.scale
        photoMat.uniforms.uHeroScroll.value = st.heroScroll
      }

      // Update Inner Wireframe Mesh
      if (wireMesh) {
        wireMesh.position.copy(st.sphereCenter)
        wireMesh.rotation.y = timeSec * 0.22
        wireMesh.rotation.x = Math.sin(timeSec * 0.16) * 0.15
        const wireScale = Math.max(0.001, st.sphereMorph)
        wireMesh.scale.setScalar(wireScale)
        wireMat.opacity = st.sphereMorph * st.sphereFade * 0.16
      }

      // Center Dot at Cursor (Hero only)
      if (dotEl) {
        const show = st.mouseTarget.active && st.heroScroll < 0.15
        dotEl.style.transform = `translate3d(${st.mouseRaw.x}px,${st.mouseRaw.y}px,0) translate(-50%,-50%)`
        dotEl.style.opacity = show ? '1' : '0'
      }

      // Sparkle Trail
      if (sparkleCtx && sparkles.length > 0) {
        sparkleCtx.clearRect(0, 0, width, height)
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const sp = sparkles[i]
          sp.x += sp.vx; sp.y += sp.vy; sp.alpha -= 0.03
          if (sp.alpha <= 0) { sparkles.splice(i, 1); continue }
          sparkleCtx.save()
          sparkleCtx.globalAlpha = Math.max(0, sp.alpha)
          sparkleCtx.fillStyle = sp.color
          sparkleCtx.shadowColor = sp.color
          sparkleCtx.shadowBlur = 6
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
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('scroll', updateScrollMetrics)
      window.removeEventListener('resize', onResize)
      if (pointsGeo) pointsGeo.dispose()
      if (pointsMat) pointsMat.dispose()
      if (photoMat) photoMat.dispose()
      if (photoTex) photoTex.dispose()
      if (wireGeo) wireGeo.dispose()
      if (wireMat) wireMat.dispose()
      renderer.dispose()
    }
  }, [isMobile])

  // Helper smoothstep for JS
  function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
    return x * x * (3 - 2 * x)
  }

  // ── JSX: Fixed Full-Screen Viewport Canvas (Spans Hero & About) ────────────
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      <canvas
        ref={sparkleCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle center dot during hero mode */}
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
        }}
      />
    </div>
  )
}
