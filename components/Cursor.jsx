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

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const lerp = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      requestAnimationFrame(lerp)
    }

    const onEnter = () => ring.classList.add('hovering')
    const onLeave = () => ring.classList.remove('hovering')

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, .magnetic').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    lerp()
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
