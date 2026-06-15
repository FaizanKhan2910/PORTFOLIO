'use client'
import { useEffect, useRef, useState } from 'react'

export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let start = null
    const duration = 2800

    const tick = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // Ease out cubic i 
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * 100))

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setCount(100)
        setTimeout(() => {
          setLeaving(true)
          setTimeout(onComplete, 900)
        }, 400)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  const text = 'FAIZAN KHAN · FULL-STACK DEVELOPER · AI/ML BUILDER · 3× HACKATHON WINNER · '

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: '#0C0C0E',
        zIndex: 9990, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', overflow: 'hidden',
        transform: leaving ? 'translateY(-100%)' : 'translateY(0)',
        transition: leaving ? 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }}
    >
      {/* Top marquee */}
      <div style={{ overflow: 'hidden', borderBottom: '1px solid #C9A96E11', padding: '18px 0' }}>
        <div className="marquee-track" style={{ display: 'flex' }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              letterSpacing: '3px',
              color: '#7A7572',
              paddingRight: '4rem',
              whiteSpace: 'nowrap',
            }}>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}>
        {/* Giant counter */}
        <div style={{
          fontFamily: 'var(--font-space)',
          fontSize: 'clamp(100px, 20vw, 200px)',
          fontWeight: 700,
          color: '#F0ECE3',
          lineHeight: 1,
          letterSpacing: '-6px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {String(count).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div style={{ width: 'clamp(200px, 30vw, 400px)', height: '1px', background: '#C9A96E22', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: count + '%',
            background: 'linear-gradient(to right, #8B5E3C, #C9A96E)',
            transition: 'width 0.05s linear',
          }} />
        </div>

        <div style={{
          fontFamily: 'var(--font-space)',
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#7A7572',
        }}>
          LOADING
        </div>
      </div>

      {/* Bottom marquee */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid #C9A96E11', padding: '18px 0' }}>
        <div className="marquee-track marquee-track-reverse" style={{ display: 'flex' }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              letterSpacing: '3px',
              color: '#C9A96E33',
              paddingRight: '4rem',
              whiteSpace: 'nowrap',
            }}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
