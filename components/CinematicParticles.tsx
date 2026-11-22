'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  baseAlpha: number
  alpha: number
  color: string
  pulseSpeed: number
  pulsePhase: number
  driftSpeed: number
  driftPhase: number
}

interface CinematicParticlesProps {
  section?: 'hero' | 'about' | 'continuous'
  isMobile?: boolean
  className?: string
  style?: React.CSSProperties
}

const GOLD_PALETTE = [
  '#FFF4D0', // Pale bright gold
  '#F5B942', // Warm amber gold
  '#E5A97B', // Soft bronze gold
  '#D49B55', // Metallic gold
  '#E8C585', // Radiant gold
]

export default function CinematicParticles({
  section = 'hero',
  isMobile = false,
  className = '',
  style = {},
}: CinematicParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })
  const particlesRef = useRef<Particle[]>([])
  const animFrameId = useRef<number | null>(null)
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

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = container.clientWidth || window.innerWidth)
    let height = (canvas.height = container.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas || !container) return
      width = canvas.width = container.clientWidth || window.innerWidth
      height = canvas.height = container.clientHeight || window.innerHeight
      initParticles(width, height)
    }

    const initParticles = (w: number, h: number) => {
      // Density calibrated to avoid visual noise while providing organic depth
      const count = isMobile
        ? section === 'about' ? 24 : 32
        : section === 'about' ? 55 : 75

      const particles: Particle[] = []
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const size = isMobile
          ? 0.8 + Math.random() * 1.4
          : 0.9 + Math.random() * 1.9

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.15 - Math.random() * 0.35,
          size,
          baseAlpha: 0.2 + Math.random() * 0.55,
          alpha: 0.2 + Math.random() * 0.55,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          pulseSpeed: 0.015 + Math.random() * 0.025,
          pulsePhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.008 + Math.random() * 0.018,
          driftPhase: Math.random() * Math.PI * 2,
        })
      }
      particlesRef.current = particles
    }

    initParticles(width, height)
    window.addEventListener('resize', handleResize)

    // Mouse tracking for subtle natural repulsion
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    // Animation Loop
    let lastTime = performance.now()
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05)
      lastTime = now

      ctx.clearRect(0, 0, width, height)
      const particles = particlesRef.current
      const mouse = mouseRef.current

      const connectionDist = isMobile ? 48 : (section === 'about' ? 75 : 65)
      const repulsionDist = isMobile ? 60 : 95

      // 1. Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          // Organic sinusoidal floating
          p.driftPhase += p.driftSpeed
          p.pulsePhase += p.pulseSpeed

          const driftX = Math.sin(p.driftPhase) * 0.35
          const driftY = Math.cos(p.driftPhase * 0.8) * 0.25

          p.x += (p.vx + driftX) * 45 * dt
          p.y += (p.vy + driftY) * 45 * dt

          // Screen wrap with soft bounds
          if (p.y < -10) {
            p.y = height + 10
            p.x = Math.random() * width
          } else if (p.y > height + 10) {
            p.y = -10
            p.x = Math.random() * width
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10

          // Cursor repulsion: natural push away and spring return
          if (mouse.active) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < repulsionDist && dist > 0) {
              const force = (1 - dist / repulsionDist) * 1.8
              const nx = dx / dist
              const ny = dy / dist
              p.x += nx * force * 15 * dt * 60
              p.y += ny * force * 15 * dt * 60
            }
          }

          // Gentle breathing opacity
          p.alpha = p.baseAlpha * (0.75 + 0.25 * Math.sin(p.pulsePhase))
        }

        // Draw particle with subtle golden illumination
        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowColor = '#F5B942'
        ctx.shadowBlur = p.size > 1.4 ? 6 : 3
        ctx.fill()
        ctx.restore()

        // 2. Occasional tiny connecting lines between nearby particles (Constellation effect)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const d2 = dx * dx + dy * dy
          if (d2 < connectionDist * connectionDist) {
            const dist = Math.sqrt(d2)
            const lineAlpha = (1 - dist / connectionDist) * 0.18 * Math.min(p.alpha, p2.alpha)
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = '#E5A97B'
            ctx.globalAlpha = lineAlpha
            ctx.lineWidth = 0.6
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      animFrameId.current = requestAnimationFrame(render)
    }

    animFrameId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current)
      }
    }
  }, [isMobile, section, reducedMotion])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`cinematic-particles-layer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
