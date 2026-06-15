'use client'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const STATS = [
  { value: 8, suffix: '+', label: 'Apps Shipped' },
  { value: 3, suffix: '×', label: 'Hackathon Wins' },
  { value: 170, suffix: '+', label: 'Teams Defeated' },
  { value: 1224, suffix: '', label: 'LinkedIn Followers' },
]

function Counter({ value, suffix, active }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = null
    const duration = 1800
    const tick = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(value)
    }
    requestAnimationFrame(tick)
  }, [active, value])

  return <>{count}{suffix}</>
}

export default function About() {
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" style={{ padding: isMobile ? '80px 24px' : '140px 100px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Section label */}
      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isMobile ? '40px' : '80px' }}>
        <span style={{
          fontFamily: 'var(--font-space)',
          fontSize: '11px', letterSpacing: '3px',
          color: '#7A7572', textTransform: 'uppercase',
        }}>
          01
        </span>
        <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
        <span style={{
          fontFamily: 'var(--font-space)',
          fontSize: '11px', letterSpacing: '3px',
          color: '#C9A96E',
        }}>
          About
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'start' }}>
        {/* Left */}
        <div className="reveal">
          <h2 style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 0.95,
            color: '#F0ECE3',
            marginBottom: '8px',
          }}>
            About<br />
            <span style={{
              background: 'linear-gradient(135deg, #C9A96E, #D4847A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Me.
            </span>
          </h2>
        </div>

        {/* Right */}
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingTop: isMobile ? '0' : '8px' }}>
          <p style={{
            fontFamily: 'var(--font-space)',
            fontSize: '17px', lineHeight: 1.8,
            color: '#9A9592',
          }}>
            2nd-year CSE (AI-ML) student at{' '}
            <span style={{ color: '#C9A96E' }}>JSSATE Bengaluru</span>.
            I build production-grade applications — from AI dental diagnostic systems
            that fuse YOLOv8 with Llama-3, to fintech dashboards handling 100+
            concurrent positions in real time....
          </p>
          <p style={{
            fontFamily: 'var(--font-space)',
            fontSize: '17px', lineHeight: 1.8,
            color: '#9A9592',
          }}>
            <span style={{ color: '#D4847A', fontWeight: 600 }}>3× National and Inter-Collegiate Hackathon Winner .</span>{' '}
            I have competed against 170+ teams across national and inter-collegiate competitions
            and secured first place every single time...
          </p>
          <p style={{
            fontFamily: 'var(--font-space)',
            fontSize: '17px', lineHeight: 1.8,
            color: '#9A9592',
          }}>
            I don&apos;t just study technology —{' '}
            <span style={{ color: '#F0ECE3', fontStyle: 'italic' }}>I ship it.</span>
          </p>

          <a href="#work"
            onClick={e => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontFamily: 'var(--font-space)',
              fontSize: '12px', letterSpacing: '2px',
              color: '#C9A96E',
              textDecoration: 'none',
              textTransform: 'uppercase',
              marginTop: '8px',
              transition: 'gap 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.gap = '16px'}
            onMouseLeave={e => e.currentTarget.style.gap = '10px'}
          >
            View my work <span style={{ fontSize: '16px' }}>→</span>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '1px',
        marginTop: isMobile ? '60px' : '100px',
        background: '#C9A96E11',
        border: '1px solid #C9A96E11',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="reveal" style={{
            padding: isMobile ? '32px 16px' : '40px 32px',
            background: '#0F0F12',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <div style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #C9A96E, #F0ECE3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontVariantNumeric: 'tabular-nums',
            }}>
              <Counter value={s.value} suffix={s.suffix} active={statsVisible} />
            </div>
            <div style={{
              fontFamily: 'var(--font-space)',
              fontSize: '11px',
              letterSpacing: '2px',
              color: '#7A7572',
              textTransform: 'uppercase',
              marginTop: '8px',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
