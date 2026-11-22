'use client'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import AboutTerminal from './AboutTerminal'
import CinematicParticles from './CinematicParticles'

const STATS = [
  { value: 6, suffix: '+', label: 'Apps Shipped' },
  { value: 3, suffix: '×', label: 'Hackathon Wins' },
  { value: 796, suffix: '+', label: 'Students Defeated' },
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

// ── Structured Bio Paragraphs with Highlighting ─────────────────────────────
const BIO_PARAGRAPHS = [
  {
    parts: [
      { text: "I'm a Pre-Final Year B.E. Computer Science student specializing in AI & Machine Learning at " },
      { text: "JSSATE Bengaluru", color: "#C9A96E", bold: true },
      { text: ", currently working as a Software Developer Intern at " },
      { text: "HealthRytix", color: "#D4847A", bold: true },
      { text: "." },
    ],
  },
  {
    parts: [
      { text: "I build and engineer production-ready applications at the intersection of " },
      { text: "Full-Stack Development, AI/ML, and Backend Engineering", color: "#F0ECE3", bold: true },
      { text: " — from AI-powered dental diagnostic systems integrating " },
      { text: "YOLOv8 with Llama-3", color: "#C9A96E" },
      { text: " to scalable fintech platforms and real-time applications." },
    ],
  },
  {
    parts: [
      { text: "A " },
      { text: "3× Hackathon Champion", color: "#D4847A", bold: true },
      { text: ", I've secured first-place finishes across national-level and inter-collegiate competitions, competing against " },
      { text: "796+ participants", color: "#C9A96E", bold: true },
      { text: " across multiple events." },
    ],
  },
  {
    parts: [
      { text: "My focus goes beyond building features. I care about " },
      { text: "system architecture, performance optimization, scalable backend systems, cloud infrastructure", color: "#F0ECE3" },
      { text: ", and turning complex ideas into reliable software." },
    ],
  },
  {
    parts: [
      { text: "I don't just learn technology. " },
      { text: "I engineer, build, and ship solutions that solve real-world problems.", color: "#F0ECE3", bold: true, italic: true },
    ],
  },
]

// Precompute total character count for fast 4.5s linear/smooth typewriter
const TOTAL_CHARS = BIO_PARAGRAPHS.reduce(
  (acc, p) => acc + p.parts.reduce((pAcc, part) => pAcc + part.text.length, 0),
  0
)

export default function About() {
  const [statsVisible, setStatsVisible] = useState(false)
  const [bioActive, setBioActive] = useState(false)
  const [visibleChars, setVisibleChars] = useState(0)

  const statsRef = useRef(null)
  const bioRef   = useRef(null)
  const isMobile = useIsMobile()

  // 1. Observer for Stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  // 2. Observer to trigger typewriter when reaching About section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBioActive(true)
        }
      },
      { threshold: 0.2 }
    )
    if (bioRef.current) observer.observe(bioRef.current)
    return () => observer.disconnect()
  }, [])

  // 3. Fast Typewriter effect: completes full bio in ~4.5 seconds
  useEffect(() => {
    if (!bioActive) return

    // If reduced motion is preferred, show all immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleChars(TOTAL_CHARS)
      return
    }

    let start = null
    const duration = 4500 // 4.5 seconds
    let rafId = 0

    const step = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(1, elapsed / duration)
      const count = Math.floor(progress * TOTAL_CHARS)
      setVisibleChars(count)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setVisibleChars(TOTAL_CHARS)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [bioActive])

  // Helper to render typed text paragraph-by-paragraph
  let charsLeft = visibleChars
  const renderedParagraphs = BIO_PARAGRAPHS.map((p, pIdx) => {
    if (charsLeft <= 0 && bioActive) return null

    const renderedParts = []
    let isCursorHere = false

    for (let i = 0; i < p.parts.length; i++) {
      const part = p.parts[i]
      if (charsLeft <= 0) break
      const partLen = part.text.length

      if (charsLeft >= partLen) {
        renderedParts.push(
          <span
            key={i}
            style={{
              color: part.color || '#9A9592',
              fontWeight: part.bold ? 600 : 400,
              fontStyle: part.italic ? 'italic' : 'normal',
            }}
          >
            {part.text}
          </span>
        )
        charsLeft -= partLen
      } else {
        renderedParts.push(
          <span
            key={i}
            style={{
              color: part.color || '#9A9592',
              fontWeight: part.bold ? 600 : 400,
              fontStyle: part.italic ? 'italic' : 'normal',
            }}
          >
            {part.text.slice(0, charsLeft)}
          </span>
        )
        isCursorHere = true
        charsLeft = 0
        break
      }
    }

    const showCursor = isCursorHere && visibleChars < TOTAL_CHARS

    return (
      <p
        key={pIdx}
        style={{
          fontFamily: 'var(--font-space)',
          fontSize: '17px',
          lineHeight: 1.8,
          color: '#9A9592',
        }}
      >
        {renderedParts}
        {showCursor && (
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1em',
              background: '#C9A96E',
              verticalAlign: 'middle',
              marginLeft: '4px',
              animation: 'blink 0.6s step-end infinite',
            }}
          />
        )}
      </p>
    )
  })

  return (
    <section id="about" style={{ position: 'relative', padding: isMobile ? '80px 24px' : '140px 100px', maxWidth: '1400px', margin: '0 auto', overflow: 'hidden' }}>
      {/* Continuous Cinematic Gold Constellation & Particle Atmosphere */}
      <CinematicParticles section="about" isMobile={isMobile} />

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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
        {/* Left: Perfectly Centered "About Me." framed inside the particle sphere */}
        <div
          id="about-sphere-anchor"
          className="reveal"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: isMobile ? '260px' : '380px',
            position: 'relative',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(44px, 6vw, 76px)',
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 0.95,
            color: '#F0ECE3',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 4px 30px rgba(0,0,0,0.85)',
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

        {/* Right: Fast Typewriter Bio */}
        <div
          ref={bioRef}
          className="reveal"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingTop: isMobile ? '0' : '8px',
            minHeight: '280px',
          }}
        >
          {visibleChars > 0 ? (
            renderedParagraphs
          ) : (
            <div style={{ minHeight: '280px' }} />
          )}

          <a
            href="#work"
            onClick={e => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-space)',
              fontSize: '12px',
              letterSpacing: '2px',
              color: '#C9A96E',
              textDecoration: 'none',
              textTransform: 'uppercase',
              marginTop: '8px',
              transition: 'gap 0.3s ease, opacity 0.4s ease',
              opacity: visibleChars > 120 ? 1 : 0,
            }}
            onMouseEnter={e => e.currentTarget.style.gap = '16px'}
            onMouseLeave={e => e.currentTarget.style.gap = '10px'}
          >
            View my work <span style={{ fontSize: '16px' }}>→</span>
          </a>
        </div>
      </div>

      <AboutTerminal />

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

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </section>
  )
}
