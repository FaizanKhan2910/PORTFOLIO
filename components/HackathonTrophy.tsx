'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface DustParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
}

interface SparkParticle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  life: number
  decay: number
}

interface HackathonTrophyProps {
  isMobile?: boolean
}

export default function HackathonTrophy({ isMobile = false }: HackathonTrophyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const shakeWrapperRef = useRef<HTMLDivElement | null>(null)
  const trophyRef = useRef<HTMLDivElement | null>(null)
  const shockwaveRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const rafIdRef = useRef<number | null>(null)
  const dustParticlesRef = useRef<DustParticle[]>([])
  const sparkParticlesRef = useRef<SparkParticle[]>([])
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const activeAnimsRef = useRef<Animation[]>([])
  const hasPlayedRef = useRef<boolean>(false)
  const isPlayingRef = useRef<boolean>(false)

  const [hasStarted, setHasStarted] = useState(false)
  const [isReplaying, setIsReplaying] = useState(false)

  // Clear all pending timers and animations
  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    activeAnimsRef.current.forEach(anim => {
      try {
        anim.cancel()
      } catch {
        // ignore if already finished/cancelled
      }
    })
    activeAnimsRef.current = []

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    dustParticlesRef.current = []
    sparkParticlesRef.current = []

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
      }
    }
  }, [])

  // Canvas resize and DPR scaling
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
  }, [])

  // Particle update and render loop
  const startParticleLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    const loop = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      // Clear using raw pixel dimensions
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      let activeCount = 0

      // Update and draw dust cloud:
      // ~65 soft circles (rgba(176,158,128,~0.22))
      // spread outward horizontally, drift up slightly, grow in radius (+0.35/frame),
      // fade out (life -= .013/frame), velocity damping 0.95
      const dust = dustParticlesRef.current
      for (let i = 0; i < dust.length; i++) {
        const p = dust[i]
        if (p.life > 0) {
          activeCount++
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.95
          p.vy *= 0.95
          p.radius += 0.35
          p.life -= 0.013

          if (p.life > 0) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, Math.max(0.1, p.radius), 0, Math.PI * 2)
            ctx.fillStyle = `rgba(176, 158, 128, ${Math.max(0, 0.22 * p.life)})`
            ctx.fill()
          }
        }
      }

      // Update and draw gold sparks:
      // ~45 small bright dots (rgba(243,223,174)), radius 1 to 3.2,
      // velocity random up to +-7 x and -3 to -12 y, gravity +0.4/frame, fade fast
      const sparks = sparkParticlesRef.current
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i]
        if (s.life > 0) {
          activeCount++
          s.vy += 0.4 // gravity
          s.x += s.vx
          s.y += s.vy
          s.life -= s.decay

          if (s.life > 0) {
            ctx.beginPath()
            ctx.arc(s.x, s.y, Math.max(0.1, s.radius), 0, Math.PI * 2)
            ctx.fillStyle = `rgba(243, 223, 174, ${Math.max(0, s.life)})`
            ctx.shadowColor = 'rgba(243, 223, 174, 0.85)'
            ctx.shadowBlur = 5
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
      }

      if (activeCount > 0) {
        rafIdRef.current = requestAnimationFrame(loop)
      } else {
        rafIdRef.current = null
      }
    }

    rafIdRef.current = requestAnimationFrame(loop)
  }, [])

  // Spawns dust and sparks at impact
  const spawnParticles = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const impactX = rect.width / 2
    const impactY = rect.height - 60 // 60px above bottom (on floor line)

    // Mobile: reduce particle counts by ~40% under 640px width
    const isSmall = rect.width < 640
    const dustCount = isSmall ? Math.round(65 * 0.6) : 65
    const sparkCount = isSmall ? Math.round(45 * 0.6) : 45

    const dust: DustParticle[] = []
    for (let i = 0; i < dustCount; i++) {
      // Horizontal outward spread
      const side = Math.random() < 0.5 ? -1 : 1
      const speed = 2.0 + Math.random() * 7.5
      dust.push({
        x: impactX + (Math.random() - 0.5) * 24,
        y: impactY - Math.random() * 4,
        vx: side * speed + (Math.random() - 0.5) * 1.5,
        vy: -0.4 - Math.random() * 1.8, // drift up slightly
        radius: 6 + Math.random() * 7,
        life: 1.0,
      })
    }
    dustParticlesRef.current = dust

    const sparks: SparkParticle[] = []
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x: impactX + (Math.random() - 0.5) * 12,
        y: impactY - Math.random() * 4,
        radius: 1.0 + Math.random() * 2.2, // radius 1 to 3.2
        vx: (Math.random() * 14) - 7, // +-7 x
        vy: -(3 + Math.random() * 9), // -3 to -12 y
        life: 1.0,
        decay: 0.024 + Math.random() * 0.012, // fade fast
      })
    }
    sparkParticlesRef.current = sparks

    startParticleLoop()
  }, [startParticleLoop])

  // Primary animation orchestrator
  const playSequence = useCallback(() => {
    cleanup()
    isPlayingRef.current = true
    setHasStarted(true)
    setIsReplaying(true)

    const trophyEl = trophyRef.current
    const shockwaveEl = shockwaveRef.current
    const shakeWrapperEl = shakeWrapperRef.current
    const containerEl = containerRef.current

    if (!trophyEl || !containerEl) return

    // Ensure canvas matches container dimensions before starting
    syncCanvasSize()

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      trophyEl.style.transform = 'translate3d(-50%, 0px, 0px) scaleY(1)'
      trophyEl.style.opacity = '1'

      lineRefs.current.forEach(line => {
        if (line) {
          line.style.opacity = '1'
          line.style.transform = 'translateY(0px) scale(1)'
          line.style.filter = 'none'
        }
      })
      isPlayingRef.current = false
      setIsReplaying(false)
      return
    }

    // Reset initial visual states
    lineRefs.current.forEach(line => {
      if (line) {
        line.style.opacity = '0'
        line.style.transform = 'translateY(34px) scale(0.92)'
        line.style.filter = 'blur(10px)'
      }
    })

    if (shockwaveEl) {
      shockwaveEl.style.opacity = '0'
      shockwaveEl.style.transform = 'translate(-50%, 50%) scale(1, 1)'
    }

    // 1. Calculate drop distance from strictly ABOVE the viewport
    const containerRect = containerEl.getBoundingClientRect()
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900
    // Guarantee startY is far above the top of the browser window (strictly negative)
    const startY = -Math.max(viewportHeight + 500, Math.abs(containerRect.bottom) + 400)

    trophyEl.style.transform = `translate3d(-50%, ${startY}px, 0px) rotateY(0deg)`
    trophyEl.style.opacity = '1'
    trophyEl.style.transformOrigin = 'bottom center'

    // Drop animation: ~780ms, accelerating downwards like gravity, spinning 720deg
    const dropAnim = trophyEl.animate(
      [
        { transform: `translate3d(-50%, ${startY}px, 0px) rotateY(0deg)` },
        { transform: `translate3d(-50%, 0px, 0px) rotateY(720deg)` },
      ],
      {
        duration: 780,
        easing: 'cubic-bezier(0.6, 0, 1, 0.5)',
        fill: 'forwards',
      }
    )
    activeAnimsRef.current.push(dropAnim)

    dropAnim.onfinish = () => {
      // 3. Impact triggers:
      // a) Section shakes: translate keyframes: -7,5 / 6,-4 / -3,2 / 0 over 380ms
      if (shakeWrapperEl) {
        const shakeAnim = shakeWrapperEl.animate(
          [
            { transform: 'translate(0px, 0px)' },
            { transform: 'translate(-7px, 5px)', offset: 0.16 },
            { transform: 'translate(6px, -4px)', offset: 0.45 },
            { transform: 'translate(-3px, 2px)', offset: 0.74 },
            { transform: 'translate(0px, 0px)', offset: 1.0 },
          ],
          {
            duration: 380,
            easing: 'ease-out',
          }
        )
        activeAnimsRef.current.push(shakeAnim)
      }

      // b) Trophy squash-bounce: scaleY .84 -> translateY(-20px) scaleY 1.04 -> settle, 480ms ease-out, transform-origin bottom center
      const bounceAnim = trophyEl.animate(
        [
          { transform: 'translate3d(-50%, 0px, 0px) rotateY(720deg) scaleY(0.84) scaleX(1.12)' },
          { transform: 'translate3d(-50%, -20px, 0px) rotateY(720deg) scaleY(1.04) scaleX(0.98)', offset: 0.44 },
          { transform: 'translate3d(-50%, 0px, 0px) rotateY(720deg) scaleY(1.0) scaleX(1.0)', offset: 1.0 },
        ],
        {
          duration: 480,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
      activeAnimsRef.current.push(bounceAnim)

      // c) Shockwave: 20px gold ring (2px border) scaling to x18 horizontally / x5 vertically, fading over 900ms
      if (shockwaveEl) {
        const shockAnim = shockwaveEl.animate(
          [
            { transform: 'translate(-50%, 50%) scale(1, 1)', opacity: 0.95 },
            { transform: 'translate(-50%, 50%) scale(18, 5)', opacity: 0 },
          ],
          {
            duration: 900,
            easing: 'cubic-bezier(0.1, 0.4, 0.2, 1)',
            fill: 'forwards',
          }
        )
        activeAnimsRef.current.push(shockAnim)
      }

      // d) Dust cloud + Gold sparks on canvas
      spawnParticles()

      // 4. Staggered text reveals:
      // 3 lines fade/slide/unblur in, staggered by 300ms starting 250ms after impact
      // Each line: 0.7s, cubic-bezier(.2,.9,.2,1)
      const animateLine = (index: number) => {
        const lineEl = lineRefs.current[index]
        if (!lineEl) return
        const lineAnim = lineEl.animate(
          [
            { opacity: 0, transform: 'translateY(34px) scale(0.92)', filter: 'blur(10px)' },
            { opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' },
          ],
          {
            duration: 700,
            easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
            fill: 'forwards',
          }
        )
        activeAnimsRef.current.push(lineAnim)
      }

      const t1 = setTimeout(() => animateLine(0), 250)
      const t2 = setTimeout(() => animateLine(1), 550)
      const t3 = setTimeout(() => {
        animateLine(2)
        isPlayingRef.current = false
        setIsReplaying(false)
      }, 850)

      timeoutsRef.current.push(t1, t2, t3)
    }
  }, [cleanup, spawnParticles, syncCanvasSize])

  // IntersectionObserver for scroll-into-view (threshold 0.5, play once)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true
          observer.disconnect()
          playSequence()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cleanup()
    }
  }, [playSequence, cleanup])

  // ResizeObserver for canvas responsiveness
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const resizeObserver = new ResizeObserver(() => {
      syncCanvasSize()
    })

    resizeObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
    }
  }, [syncCanvasSize])

  const handleReplayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playSequence()
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '340px' : '440px',
        marginBottom: isMobile ? '60px' : '100px',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        userSelect: 'none',
      }}
    >
      {/* Replay Button */}
      <button
        type="button"
        onClick={handleReplayClick}
        aria-label="Replay hackathon trophy animation"
        style={{
          position: 'absolute',
          top: isMobile ? '-32px' : '-44px',
          right: '0',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          background: 'rgba(20, 20, 24, 0.6)',
          border: '1px solid rgba(200, 169, 122, 0.25)',
          borderRadius: '100px',
          color: '#c8a97a',
          fontFamily: 'var(--font-space)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'all 0.25s cubic-bezier(0.2, 0.9, 0.2, 1)',
          zIndex: 20,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#c8a97a'
          e.currentTarget.style.color = '#f1ede4'
          e.currentTarget.style.boxShadow = '0 0 16px rgba(200, 169, 122, 0.35)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(200, 169, 122, 0.25)'
          e.currentTarget.style.color = '#c8a97a'
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isReplaying ? 'rotate(-360deg)' : 'none',
            transition: isReplaying ? 'transform 0.78s cubic-bezier(0.6, 0, 1, 0.5)' : 'none',
          }}
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
        </svg>
        <span>Replay</span>
      </button>

      {/* Shake container: shakes the entire scene on trophy impact */}
      <div
        ref={shakeWrapperRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: isMobile ? '340px' : '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingBottom: '180px', // Leaves dedicated room for the 108px trophy on the floor line
        }}
      >
        {/* Three Reveal Lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 2,
            marginTop: isMobile ? '12px' : '20px',
          }}
        >
          {/* Line 1: 3 entered. */}
          <div
            ref={el => {
              lineRefs.current[0] = el
            }}
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(34px, 7vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              opacity: hasStarted ? 0 : 0,
              transform: 'translateY(34px) scale(0.92)',
              filter: 'blur(10px)',
              willChange: 'transform, opacity, filter',
            }}
          >
            <span style={{ color: '#f1ede4' }}>3</span>
            <span style={{ color: '#c8a97a' }}> entered.</span>
          </div>

          {/* Line 2: 3 won. */}
          <div
            ref={el => {
              lineRefs.current[1] = el
            }}
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(34px, 7vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              opacity: hasStarted ? 0 : 0,
              transform: 'translateY(34px) scale(0.92)',
              filter: 'blur(10px)',
              willChange: 'transform, opacity, filter',
            }}
          >
            <span style={{ color: '#f1ede4' }}>3</span>
            <span style={{ color: '#c98b7e' }}> won.</span>
          </div>

          {/* Line 3: 0 losses. */}
          <div
            ref={el => {
              lineRefs.current[2] = el
            }}
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(34px, 7vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              opacity: hasStarted ? 0 : 0,
              transform: 'translateY(34px) scale(0.92)',
              filter: 'blur(10px)',
              willChange: 'transform, opacity, filter',
            }}
          >
            <span style={{ color: '#f1ede4' }}>0</span>
            <span style={{ color: '#77716b' }}> losses.</span>
          </div>
        </div>

        {/* Floor Line: 1px gold gradient line with soft glow, ~60px above section bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(200, 169, 122, 0.15) 15%, #c8a97a 50%, rgba(200, 169, 122, 0.15) 85%, transparent 100%)',
            boxShadow:
              '0 0 16px rgba(200, 169, 122, 0.45), 0 0 4px rgba(200, 169, 122, 0.7)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Soft Ambient Floor Glow beneath impact */}
        <div
          style={{
            position: 'absolute',
            bottom: '54px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: '18px',
            background:
              'radial-gradient(ellipse at center, rgba(200, 169, 122, 0.35) 0%, rgba(200, 169, 122, 0.08) 50%, transparent 80%)',
            filter: 'blur(5px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Shockwave: 20px gold ring (2px border) at the impact point that scales to x18 horizontally / x5 vertically */}
        <div
          ref={shockwaveRef}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid rgba(243, 223, 174, 0.95)',
            boxShadow:
              '0 0 14px rgba(200, 169, 122, 0.75), inset 0 0 8px rgba(200, 169, 122, 0.5)',
            transform: 'translate(-50%, 50%) scale(1, 1)',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 3,
            willChange: 'transform, opacity',
          }}
        />

        {/* Trophy (90x108px): drops from above viewport, spins 720deg, squash-bounces on impact */}
        <div
          ref={trophyRef}
          style={{
            position: 'absolute',
            bottom: '60px', // rests squarely on the 60px floor line
            left: '50%',
            width: '90px',
            height: '108px',
            transform: 'translate3d(-50%, -1000px, 0px)', // initial offscreen position
            opacity: 0,
            transformOrigin: 'bottom center',
            zIndex: 4,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        >
          <svg
            viewBox="0 0 100 120"
            width={90}
            height={108}
            style={{
              overflow: 'visible',
              display: 'block',
              filter: 'drop-shadow(0 6px 20px rgba(200, 169, 122, 0.35))',
            }}
          >
            <defs>
              <linearGradient id="trophyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8f6f3d" />
                <stop offset="50%" stopColor="#f3dfae" />
                <stop offset="100%" stopColor="#a98245" />
              </linearGradient>
            </defs>

            {/* Left handle: 6px stroke */}
            <path
              d="M25 18H10C10 40 20 46 30 48"
              fill="none"
              stroke="url(#trophyGoldGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right handle: 6px stroke (mirror) */}
            <path
              d="M75 18H90C90 40 80 46 70 48"
              fill="none"
              stroke="url(#trophyGoldGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stem rect */}
            <rect
              x="45"
              y="70"
              width="10"
              height="22"
              rx="1"
              fill="url(#trophyGoldGrad)"
            />

            {/* Cup path: M25 8H75V40C75 62 62 72 50 72C38 72 25 62 25 40Z */}
            <path
              d="M25 8H75V40C75 62 62 72 50 72C38 72 25 62 25 40Z"
              fill="url(#trophyGoldGrad)"
            />

            {/* Subtle cup lip specular highlight */}
            <ellipse
              cx="50"
              cy="8"
              rx="25"
              ry="2.5"
              fill="#f3dfae"
              opacity="0.65"
            />

            {/* Small white star on the cup */}
            <polygon
              points="50,28 52.2,34.5 58,35.1 53.7,39 55,44.8 50,41.8 45,44.8 46.3,39 42,35.1 47.8,34.5"
              fill="#ffffff"
              opacity="0.95"
              style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))' }}
            />

            {/* Base rect */}
            <rect
              x="28"
              y="92"
              width="44"
              height="10"
              rx="2"
              fill="url(#trophyGoldGrad)"
            />

            {/* Darker plinth (#6d5230) */}
            <rect
              x="20"
              y="102"
              width="60"
              height="14"
              rx="3"
              fill="#6d5230"
            />
            {/* Plinth top edge subtle highlight */}
            <line
              x1="22"
              y1="102"
              x2="78"
              y2="102"
              stroke="#8f6f3d"
              strokeWidth="1.5"
              opacity="0.75"
            />
          </svg>
        </div>

        {/* Canvas Overlay for Dust Cloud and Gold Sparks */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  )
}
