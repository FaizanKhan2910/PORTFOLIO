'use client'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const PROFILES = [
  { label: 'LeetCode', href: 'https://leetcode.com/u/Faizan__Khan2910/', primary: false },
  { label: 'GeeksforGeeks', href: 'https://www.geeksforgeeks.org/profile/fk63076v1z8?tab=activity', primary: false },
  { label: 'Codolio', href: 'https://codolio.com/profile/Faizankhan2910/', primary: true },
]

// Circular ring dimensions
const R = 72
const CIRCUMFERENCE = 2 * Math.PI * R

export default function DsaCard() {
  const isMobile = useIsMobile()
  const [total, setTotal] = useState(435)
  const [displayCount, setDisplayCount] = useState(0)
  const [source, setSource] = useState<'manual' | 'codolio'>('manual')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  // Fetch count from API
  useEffect(() => {
    fetch('/api/dsa')
      .then(r => r.json())
      .then(d => {
        setTotal(d.total)
        setSource(d.source)
        setUpdatedAt(d.updatedAt)
      })
      .catch(() => {})
  }, [])

  // IntersectionObserver to trigger animation
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Count-up animation
  useEffect(() => {
    if (!inView) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setDisplayCount(total); return }
    const duration = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayCount(Math.floor(eased * total))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [inView, total])

  // Ring stroke-dashoffset: animate from full gap (CIRCUMFERENCE) → partial fill (tasteful arc ~270deg)
  const ARC_DEG = 270
  const arcFraction = ARC_DEG / 360
  const filledDash = inView ? CIRCUMFERENCE * arcFraction : 0
  const gapDash = CIRCUMFERENCE - filledDash

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const SIZE = isMobile ? 140 : 180
  const rScaled = (R / 180) * SIZE * 0.94
  const circScaled = 2 * Math.PI * rScaled
  const filledScaled = inView ? circScaled * arcFraction : 0
  const gapScaled = circScaled - filledScaled

  return (
    <section
      id="dsa"
      ref={cardRef}
      style={{
        padding: isMobile ? '60px 20px' : '100px 100px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          marginBottom: isMobile ? '32px' : '56px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transition: prefersReduced ? 'none' : 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#7A7572' }}>05</span>
        <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#C9A96E' }}>DSA</span>
      </div>

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center',
          gap: isMobile ? '40px' : '72px',
          padding: isMobile ? '40px 24px' : '56px 72px',
          background: hovered
            ? 'linear-gradient(135deg, rgba(201,169,110,0.07) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: hovered ? '1px solid rgba(201,169,110,0.45)' : '1px solid rgba(201,169,110,0.15)',
          borderRadius: '20px',
          backdropFilter: 'blur(12px)',
          transition: prefersReduced ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered && !prefersReduced ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 24px 64px rgba(201,169,110,0.12), 0 4px 16px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.3)',
          opacity: inView ? 1 : 0,
          transitionDelay: inView ? '0.1s' : '0s',
          cursor: 'default',
        }}
      >
        {/* LEFT — Circular Ring */}
        <a
          href="https://codolio.com/profile/Faizankhan2910/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', flexShrink: 0 }}
          aria-label="View Codolio Profile"
        >
          <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              style={{ transform: 'rotate(-135deg)' }}
            >
              {/* Track */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={rScaled}
                fill="none"
                stroke="rgba(201,169,110,0.1)"
                strokeWidth="3"
                strokeDasharray={`${circScaled * arcFraction} ${circScaled * (1 - arcFraction)}`}
                strokeLinecap="round"
              />
              {/* Animated gold arc */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={rScaled}
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="3.5"
                strokeDasharray={`${filledScaled} ${gapScaled + circScaled * (1 - arcFraction)}`}
                strokeLinecap="round"
                style={{
                  transition: prefersReduced ? 'none' : 'stroke-dasharray 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s',
                  filter: 'drop-shadow(0 0 6px rgba(201,169,110,0.6))',
                }}
              />
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4A657" />
                  <stop offset="100%" stopColor="#F0C97A" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center text */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px',
            }}>
              <span style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '28px' : '34px',
                fontWeight: 700,
                color: '#F0ECE3',
                letterSpacing: '-2px',
                lineHeight: 1,
                transition: prefersReduced ? 'none' : 'all 0.1s ease',
              }}>
                {displayCount}<span style={{ color: '#C9A96E', fontSize: '0.6em' }}>+</span>
              </span>
              <span style={{
                fontFamily: 'var(--font-space)',
                fontSize: '8px',
                letterSpacing: '2px',
                color: '#7A7572',
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: 1.3,
              }}>
                Problems<br />Solved
              </span>
            </div>
          </div>
        </a>

        {/* RIGHT — Info */}
        <div style={{ flex: 1, minWidth: 0, textAlign: isMobile ? 'center' : 'left' }}>
          {/* Heading */}
          <h2 style={{
            fontFamily: 'var(--font-space)',
            fontSize: isMobile ? '20px' : '26px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#F0ECE3',
            marginBottom: '8px',
            lineHeight: 1.2,
          }}>
            Data Structures<br />& Algorithms
          </h2>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-space)',
            fontSize: '12px',
            letterSpacing: '1.5px',
            color: '#7A7572',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}>
            Consistent practice. Measurable progress.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '24px' : '32px',
            marginBottom: '32px',
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-space)', fontSize: isMobile ? '22px' : '28px',
                fontWeight: 700, color: '#C9A96E', letterSpacing: '-1px',
              }}>
                {total}+
              </div>
              <div style={{
                fontFamily: 'var(--font-space)', fontSize: '9px',
                letterSpacing: '2px', color: '#7A7572', textTransform: 'uppercase',
                marginTop: '4px',
              }}>
                Total
              </div>
            </div>
            <div style={{ width: '1px', background: '#C9A96E15', alignSelf: 'stretch' }} />
            <div>
              <div style={{
                fontFamily: 'var(--font-space)', fontSize: '10px',
                letterSpacing: '2px', color: '#C9A96E99', textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Platforms
              </div>
              <div style={{
                fontFamily: 'var(--font-space)', fontSize: '13px',
                color: '#B3ADA9', letterSpacing: '0.5px',
              }}>
                LeetCode · GFG · Codolio
              </div>
            </div>
          </div>

          {/* Profile links */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            marginBottom: updatedAt ? '20px' : '0',
          }}>
            {PROFILES.map(p => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: p.primary ? '8px 18px' : '7px 16px',
                  borderRadius: '6px',
                  border: p.primary ? '1px solid #C9A96E' : '1px solid rgba(201,169,110,0.25)',
                  color: p.primary ? '#0C0C0E' : '#B3ADA9',
                  background: p.primary ? '#C9A96E' : 'transparent',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (p.primary) {
                    el.style.background = '#D4B87E'
                    el.style.borderColor = '#D4B87E'
                  } else {
                    el.style.color = '#C9A96E'
                    el.style.borderColor = '#C9A96E'
                    el.style.background = 'rgba(201,169,110,0.08)'
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (p.primary) {
                    el.style.background = '#C9A96E'
                    el.style.borderColor = '#C9A96E'
                  } else {
                    el.style.color = '#B3ADA9'
                    el.style.borderColor = 'rgba(201,169,110,0.25)'
                    el.style.background = 'transparent'
                  }
                }}
              >
                {p.label}
                <span style={{ fontSize: '10px', opacity: 0.8 }}>↗</span>
              </a>
            ))}
          </div>

          {/* Source label + last updated */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            marginTop: '16px',
          }}>
            <span style={{
              fontFamily: 'var(--font-space)',
              fontSize: '9px',
              letterSpacing: '2px',
              color: '#C9A96E55',
              textTransform: 'uppercase',
            }}>
              {source === 'codolio' ? 'Powered by Codolio' : 'Verified Count'}
            </span>
            {updatedAt && (
              <>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#C9A96E22' }} />
                <span style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  color: '#7A757255',
                  textTransform: 'uppercase',
                }}>
                  Updated {formatDate(updatedAt)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
