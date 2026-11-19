'use client'
import { useEffect, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -100, mouseY = -100
    let ringX = -100, ringY = -100
    let isHidden = false

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`

      // If hovering hero with its own custom lens and center dot, hide global cursor
      const overHero = !!e.target?.closest?.('[data-hero-cursor]')
      if (overHero !== isHidden) {
        isHidden = overHero
        dot.style.opacity = isHidden ? '0' : '1'
        ring.style.opacity = isHidden ? '0' : '1'
      }
    }

    let rafId = 0
    const lerp = () => {
      ringX += (mouseX - ringX) * 0.14
      ringY += (mouseY - ringY) * 0.14
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(lerp)
    }

    const onEnter = () => ring.classList.add('hovering')
    const onLeave = () => ring.classList.remove('hovering')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.querySelectorAll('a, button, .magnetic').forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    lerp()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#C9A96E',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform, opacity',
          transition: 'opacity 0.2s ease',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(201, 169, 110, 0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform, opacity',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease',
        }}
      />
      <style>{`
        .cursor-ring.hovering {
          width: 48px !important;
          height: 48px !important;
          border-color: #C9A96E !important;
          background: rgba(201, 169, 110, 0.1) !important;
        }
      `}</style>
    </>
  )
}
