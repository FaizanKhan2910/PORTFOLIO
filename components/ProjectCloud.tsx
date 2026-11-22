'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface ProjectCloudData {
  num: string
  name: string
  sub: string
  category?: string
  headline: string
  desc: string
  problemSolved: string
  targetAudience: string
  capabilities: string[]
  metrics: string
  results: { label: string; value: string }[]
  tags: string[]
  accent: string
}

interface ProjectCloudProps {
  project: ProjectCloudData
  isActive: boolean
  isLeft: boolean // If card is left, cloud is right; if card is right, cloud is left
  isMobile: boolean
}

interface CloudParticle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  color: string
  baseAlpha: number
  alpha: number
  angle: number
  angularSpeed: number
  radiusX: number
  radiusY: number
  wobbleSpeed: number
  wobblePhase: number
}

const GOLD_DUST_PALETTE = ['#FFF8E6', '#F5B942', '#E5A97B', '#C98A3C', '#E8C585']

export default function ProjectCloud({
  project,
  isActive,
  isLeft,
  isMobile,
}: ProjectCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const particlesRef = useRef<CloudParticle[]>([])
  const animFrameRef = useRef<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mq.matches)
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [])

  // Canvas particle cloud simulation
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = container.clientWidth || (isMobile ? 320 : 540))
    let height = (canvas.height = container.clientHeight || (isMobile ? 260 : 420))

    const handleResize = () => {
      if (!canvas || !container) return
      width = canvas.width = container.clientWidth || (isMobile ? 320 : 540)
      height = canvas.height = container.clientHeight || (isMobile ? 260 : 420)
      initCloudParticles(width, height)
    }

    const initCloudParticles = (w: number, h: number) => {
      const count = isMobile ? 55 : 135
      const cx = w * 0.5
      const cy = h * 0.5

      const particles: CloudParticle[] = []
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        // Organic irregular cloud dispersion
        const rx = (isMobile ? 70 : 160) + (Math.random() - 0.5) * (isMobile ? 50 : 110)
        const ry = (isMobile ? 55 : 120) + (Math.random() - 0.5) * (isMobile ? 40 : 80)
        const x = cx + Math.cos(angle) * rx
        const y = cy + Math.sin(angle) * ry

        particles.push({
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 80,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: 0.8 + Math.random() * (isMobile ? 1.6 : 2.4),
          color: GOLD_DUST_PALETTE[Math.floor(Math.random() * GOLD_DUST_PALETTE.length)],
          baseAlpha: 0.25 + Math.random() * 0.65,
          alpha: isActive ? 0.35 + Math.random() * 0.55 : 0.05,
          angle,
          angularSpeed: (0.3 + Math.random() * 0.7) * (i % 2 === 0 ? 1 : -1),
          radiusX: rx,
          radiusY: ry,
          wobbleSpeed: 0.015 + Math.random() * 0.03,
          wobblePhase: Math.random() * Math.PI * 2,
        })
      }
      particlesRef.current = particles
    }

    initCloudParticles(width, height)
    window.addEventListener('resize', handleResize)

    let lastTime = performance.now()
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05)
      lastTime = now

      ctx.clearRect(0, 0, width, height)
      const particles = particlesRef.current
      const cx = width * 0.5
      const cy = height * 0.5

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          p.angle += p.angularSpeed * 0.45 * dt
          p.wobblePhase += p.wobbleSpeed

          // Target position in the organic cloud
          const wobble = Math.sin(p.wobblePhase) * 12
          const targetX = cx + Math.cos(p.angle) * (p.radiusX + wobble)
          const targetY = cy + Math.sin(p.angle) * (p.radiusY + wobble * 0.7)

          if (isActive) {
            // Spring gather into organic cloud
            p.x += (targetX - p.x) * 3.5 * dt
            p.y += (targetY - p.y) * 3.5 * dt
            p.alpha += (p.baseAlpha - p.alpha) * 4.0 * dt
          } else {
            // Gentle outward dispersal
            const dx = p.x - cx
            const dy = p.y - cy
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            p.x += (dx / dist) * 18 * dt
            p.y += (dy / dist) * 18 * dt
            p.alpha += (0 - p.alpha) * 3.0 * dt
          }
        } else {
          p.alpha = isActive ? p.baseAlpha : 0
        }

        if (p.alpha > 0.02) {
          ctx.save()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha
          ctx.shadowColor = '#F5B942'
          ctx.shadowBlur = p.size > 1.6 ? 7 : 3
          ctx.fill()
          ctx.restore()
        }
      }

      // Draw occasional subtle constellation wisps inside the active cloud
      if (isActive && !reducedMotion) {
        const limit = isMobile ? 30 : 60
        for (let i = 0; i < limit; i++) {
          const p1 = particles[i]
          if (!p1 || p1.alpha < 0.2) continue
          for (let j = i + 1; j < limit; j++) {
            const p2 = particles[j]
            if (!p2 || p2.alpha < 0.2) continue
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const d2 = dx * dx + dy * dy
            const maxD = isMobile ? 45 : 62
            if (d2 < maxD * maxD) {
              const dist = Math.sqrt(d2)
              const lineAlpha = (1 - dist / maxD) * 0.16 * Math.min(p1.alpha, p2.alpha)
              ctx.save()
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = '#E5A97B'
              ctx.globalAlpha = lineAlpha
              ctx.lineWidth = 0.6
              ctx.stroke()
              ctx.restore()
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isActive, isMobile, reducedMotion])

  return (
    <div
      ref={containerRef}
      className="project-particle-cloud"
      style={{
        position: isMobile ? 'relative' : 'absolute',
        ...(isMobile
          ? {
              width: '100%',
              marginTop: '16px',
            }
          : isLeft
          ? {
              left: 'calc(50% + 44px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'calc(50% - 50px)',
              maxWidth: '540px',
            }
          : {
              right: 'calc(50% + 44px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'calc(50% - 50px)',
              maxWidth: '540px',
            }),
        minHeight: isMobile ? 'auto' : '380px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 7,
      }}
    >
      {/* ── Background Organic Gold Particle Cloud Canvas ────────────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Subtle Golden Nebula Ambient Backlight (Organic, NO box outline) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: isActive
            ? 'radial-gradient(ellipse at 50% 50%, rgba(229, 169, 123, 0.15) 0%, rgba(245, 185, 66, 0.05) 45%, transparent 75%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(229, 169, 123, 0.02) 0%, transparent 60%)',
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Staggered Project Technical Story Inside Cloud ───────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          padding: isMobile ? '16px 14px' : '24px 26px',
          opacity: isActive ? 1 : (isMobile ? 0.95 : 0),
          transform: isActive
            ? 'translate3d(0, 0, 0)'
            : (isMobile ? 'none' : 'translate3d(0, 14px, 0) scale(0.97)'),
          transition:
            'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isActive || isMobile ? 'auto' : 'none',
          background: isMobile
            ? 'rgba(12, 12, 15, 0.75)'
            : 'rgba(10, 10, 12, 0.55)',
          borderRadius: '16px',
          border: isMobile
            ? '1px solid rgba(229, 169, 123, 0.18)'
            : '1px solid rgba(229, 169, 123, 0.14)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: isActive
            ? '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(229, 169, 123, 0.12)'
            : 'none',
        }}
      >
        {/* Header Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            borderBottom: '1px solid rgba(229, 169, 123, 0.14)',
            paddingBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#F5B942',
                boxShadow: '0 0 8px #F5B942',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '9.5px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                color: '#E5A97B',
                textTransform: 'uppercase',
              }}
            >
              Architecture &amp; Impact Cloud // {project.num}
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: '10px',
              color: 'rgba(240, 236, 227, 0.65)',
              letterSpacing: '0.5px',
            }}
          >
            {project.name}
          </span>
        </div>

        {/* One-Line Core Purpose */}
        <div
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: isMobile ? '12.5px' : '14px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.35,
            marginBottom: '10px',
            letterSpacing: '-0.2px',
          }}
        >
          {project.headline}
        </div>

        {/* Problem Solved & Who Benefits */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '8px' : '12px',
            marginBottom: '12px',
            background: 'rgba(18, 18, 22, 0.65)',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(229, 169, 123, 0.1)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#E5A97B',
                textTransform: 'uppercase',
                marginBottom: '3px',
              }}
            >
              Problem Solved
            </div>
            <div
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '10.5px' : '11px',
                color: '#C6C2BC',
                lineHeight: 1.45,
              }}
            >
              {project.problemSolved}
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#F5B942',
                textTransform: 'uppercase',
                marginBottom: '3px',
              }}
            >
              Who Benefits
            </div>
            <div
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '10.5px' : '11px',
                color: '#C6C2BC',
                lineHeight: 1.45,
              }}
            >
              {project.targetAudience}
            </div>
          </div>
        </div>

        {/* Key Capabilities List */}
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#E5A97B',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Core Capabilities
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {project.capabilities.map((cap, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  fontFamily: 'var(--font-space)',
                  fontSize: isMobile ? '10px' : '11px',
                  color: '#DDD8D0',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: '#F5B942', fontSize: '8px' }}>◆</span>
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Measurable Results & Performance Figures */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          {project.results.map((res, i) => (
            <div
              key={i}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(245, 185, 66, 0.08)',
                border: '1px solid rgba(245, 185, 66, 0.28)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 700,
                  color: '#F5B942',
                }}
              >
                {res.value}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '9.5px',
                  color: '#9A9592',
                  letterSpacing: '0.4px',
                }}
              >
                {res.label}
              </span>
            </div>
          ))}
        </div>

        {/* Technology Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '9px',
                letterSpacing: '0.6px',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#BDB8B3',
                border: '1px solid rgba(229, 169, 123, 0.15)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
