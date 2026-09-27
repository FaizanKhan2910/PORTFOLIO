'use client'
import { useRef, useState } from 'react'

const PROJECTS = [
  {
    num: '01',
    name: 'DENTRA',
    sub: 'DentalVision AI',
    tags: ['YOLOv8', 'Llama-3', 'React', 'Node.js', 'MongoDB'],
    desc: 'End-to-end AI diagnostic pipeline. Upload a dental X-ray — get cavity detection, LLM treatment reasoning, and a patient-ready PDF report in seconds. Built in 24 hours.',
    award: '1st Place · National · 70+ teams',
    link: 'https://github.com/FaizanKhan2910/DENTRA_AI',
    live: 'https://dentra-ai.vercel.app/',
    year: '2026',
  },
  {
    num: '02',
    name: 'SigmaGPT',
    sub: 'AI Image Generation SaaS',
    tags: ['Gemini 2.5', 'Stripe', 'React 19', 'JWT', 'ImageKit CDN'],
    desc: 'Production AI image-generation SaaS with credit-based billing. Stripe payment processing, JWT auth, CDN-optimised delivery. 100+ transactions/month, 50+ concurrent users.',
    award: null,
    link: 'https://github.com/FaizanKhan2910/SigmaGPT',
    live: 'https://sigmagpt-1-ewdw.onrender.com',
    year: '2025',
  },
  {
    num: '03',
    name: 'NEXUS AUTH',
    sub: 'Multimodal Biometric Security',
    tags: ['Computer Vision', 'Voice AI', 'React', 'Node.js', 'ML'],
    desc: 'Multimodal biometric authentication — gesture recognition, voice-liveness detection, spoof prevention, and emergency SOS. Production-grade system built in 24 hours.',
    award: '1st Place · National · 70+ teams',
    link: 'https://github.com/FaizanKhan2910/NEXUS_AUTHENTICATION',
    live: 'https://code-jss.vercel.app/',
    year: '2026',
  },
  {
    num: '04',
    name: 'STOCK PLATFORM',
    sub: 'Real-Time Fintech Dashboard',
    tags: ['React', 'Node.js', 'MongoDB Atlas', 'Express', 'Render'],
    desc: 'Real-time fintech dashboard delivering sub-100ms response times. P&L analytics, order management, and portfolio tracking for 100+ concurrent positions.',
    award: null,
    link: 'https://github.com/FaizanKhan2910/Stock_Trading_Plateform',
    year: '2025',
  },
  {
    num: '05',
    name: 'AI CODE ANALYZER',
    sub: 'CODE GENERATION, DEBUGGING AND ANALYSIS',
    tags: ['React 19', 'FastAPI', 'Gemini AI', 'AST Analysis', 'Python'],
    desc: 'High-performance AI code analysis platform. Features real-time complexity visualisation and intelligent code documentation generation.',
    award: '1st Place · CODEFORGE 2K25',
    link: 'https://github.com/FaizanKhan2910/AI-Code-Analyzer',
    live: 'https://code-rnsit-1.onrender.com',
    year: '2025',
  },
]

import { useIsMobile } from '../hooks/useIsMobile'

const MAX_TILT = 15
const LIVE_DELAY_MS = 300

function hostnameOf(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * 3D tilt card: rotateX/rotateY from cursor offset vs card center
 * (max 15deg), glossy highlight following the cursor, and a preview
 * pane swapping the static mock for a live iframe 300ms after hover.
 */
function ProjectTiltCard({ p, i, hovered, setHovered, isMobile }) {
  const cardRef = useRef(null)
  const glossRef = useRef(null)
  const hoverTimer = useRef(null)
  const raf = useRef(0)
  const [showLive, setShowLive] = useState(false)
  const active = hovered === i

  const handleMove = (e) => {
    if (isMobile) return
    const el = cardRef.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      if (r.width === 0) return
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      const rotateY = Math.max(-MAX_TILT, Math.min(MAX_TILT, px * 30))
      const rotateX = Math.max(-MAX_TILT, Math.min(MAX_TILT, -py * 30))
      el.style.transition = 'transform 0.06s linear'
      el.style.transform =
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`
      if (glossRef.current) {
        const gx = ((px + 0.5) * 100).toFixed(1)
        const gy = ((py + 0.5) * 100).toFixed(1)
        glossRef.current.style.opacity = '1'
        glossRef.current.style.background =
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.16), rgba(201,169,110,0.07) 40%, transparent 65%)`
      }
    })
  }

  const handleEnter = () => {
    setHovered(i)
    if (isMobile || !p.live) return
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setShowLive(true), LIVE_DELAY_MS)
  }

  const handleLeave = () => {
    setHovered(null)
    clearTimeout(hoverTimer.current)
    setShowLive(false)
    cancelAnimationFrame(raf.current)
    const el = cardRef.current
    if (el) {
      el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }
    if (glossRef.current) glossRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={cardRef}
      className="project-card reveal"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        background: active ? '#0F0F14' : '#0C0C0E',
        padding: isMobile ? '32px 16px' : '40px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '80px 1fr auto',
        gap: isMobile ? '16px' : '40px',
        alignItems: 'start',
        transition: 'background 0.3s ease',
        cursor: 'none',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        overflow: 'hidden',
      }}
    >
      {/* glossy highlight overlay */}
      <div
        ref={glossRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Number */}
      <div style={{
        fontFamily: 'var(--font-space)', fontSize: '12px',
        letterSpacing: '2px', color: '#7A7572',
        paddingTop: isMobile ? '0' : '6px',
        marginBottom: isMobile ? '8px' : '0',
      }}>
        {p.num}
      </div>

      {/* Content */}
      <div style={{ transform: 'translateZ(30px)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <h3 style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 700, letterSpacing: '-1px',
            color: active ? '#C9A96E' : '#F0ECE3',
            transition: 'color 0.3s',
          }}>
            {p.name}
          </h3>
          <span style={{ fontFamily: 'var(--font-space)', fontSize: '13px', color: '#7A7572' }}>
            {p.sub}
          </span>
          {p.award && (
            <span style={{
              fontFamily: 'var(--font-space)',
              fontSize: '10px', letterSpacing: '1px',
              padding: '3px 10px',
              border: '1px solid #C9A96E44',
              color: '#C9A96E',
              borderRadius: '2px',
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'center' : 'left',
              marginTop: isMobile ? '4px' : '0',
            }}>
              🏆 {p.award}
            </span>
          )}
        </div>

        {/* Preview pane: static mock → live iframe after 300ms hover */}
        <div style={{
          position: 'relative',
          height: isMobile ? '170px' : '210px',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #C9A96E22',
          background: 'linear-gradient(135deg, #14141A, #0C0C0E)',
          marginBottom: '16px',
        }}>
          {/* static mock */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            opacity: showLive ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px',
              borderBottom: '1px solid #C9A96E11',
              fontFamily: 'var(--font-space)', fontSize: '10px', color: '#7A7572',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5F57' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FEBC2E' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28C840' }} />
              <span style={{ marginLeft: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.live ? hostnameOf(p.live) : 'preview unavailable'}
              </span>
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '6px',
            }}>
              <div style={{
                fontFamily: 'var(--font-space)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700, letterSpacing: '-2px',
                background: 'linear-gradient(135deg, #C9A96E55, #F0ECE322)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {p.name.slice(0, 2)}
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '10px', letterSpacing: '2px', color: '#7A7572' }}>
                {p.live && !isMobile ? 'HOVER FOR LIVE PREVIEW' : p.sub.toUpperCase()}
              </div>
            </div>
          </div>
          {/* live iframe */}
          {showLive && p.live && (
            <iframe
              src={p.live}
              title={`${p.name} live preview`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                border: 0, background: '#fff',
                pointerEvents: 'none',
              }}
            />
          )}
          {showLive && p.live && (
            <span style={{
              position: 'absolute', top: '8px', right: '8px',
              fontFamily: 'var(--font-space)', fontSize: '9px', letterSpacing: '2px',
              padding: '3px 8px', borderRadius: '2px',
              background: 'rgba(12,12,14,0.85)', color: '#3fb950',
              border: '1px solid #3fb95055',
              pointerEvents: 'none',
            }}>
              ● LIVE
            </span>
          )}
        </div>

        <p style={{
          fontFamily: 'var(--font-space)',
          fontSize: '14px', lineHeight: 1.7,
          color: '#9A9592', maxWidth: '600px',
          marginBottom: '16px',
        }}>
          {p.desc}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-space)',
              fontSize: '10px', letterSpacing: '1px',
              padding: '4px 10px',
              background: '#C9A96E0A',
              border: '1px solid #C9A96E22',
              color: '#7A7572',
              borderRadius: '2px',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right: year + link */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'row-reverse' : 'column',
        alignItems: isMobile ? 'center' : 'flex-end',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        gap: '12px',
        paddingTop: isMobile ? '16px' : '4px',
        borderTop: isMobile ? '1px solid #C9A96E11' : 'none',
        marginTop: isMobile ? '8px' : '0',
        transform: 'translateZ(20px)',
      }}>
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: '#7A7572' }}>{p.year}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href={p.link} target="_blank" rel="noopener noreferrer"
            title="GitHub Repository"
            style={{
              width: '40px', height: '40px',
              border: '1px solid #C9A96E22',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7A7572',
              textDecoration: 'none',
              fontSize: '13px',
              fontFamily: 'var(--font-space)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#C9A96E'
              e.currentTarget.style.color = '#C9A96E'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#C9A96E22'
              e.currentTarget.style.color = '#7A7572'
            }}
          >
            GH
          </a>
          {p.live && (
            <a
              href={p.live} target="_blank" rel="noopener noreferrer"
              title="Live Demo"
              style={{
                width: '40px', height: '40px',
                border: '1px solid #C9A96E22',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7A7572',
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#C9A96E'
                e.currentTarget.style.color = '#C9A96E'
                e.currentTarget.style.transform = 'rotate(45deg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#C9A96E22'
                e.currentTarget.style.color = '#7A7572'
                e.currentTarget.style.transform = 'rotate(0deg)'
              }}
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const [hovered, setHovered] = useState(null)
  const isMobile = useIsMobile()

  return (
    <section id="work" style={{ padding: isMobile ? '80px 24px' : '140px 100px', maxWidth: '1400px', margin: '0 auto' }}>

      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isMobile ? '40px' : '80px' }}>
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#7A7572' }}>02</span>
        <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#C9A96E' }}>Selected Work</span>
      </div>

      <div className="reveal" style={{ marginBottom: isMobile ? '40px' : '64px' }}>
        <h2 style={{
          fontFamily: 'var(--font-space)',
          fontSize: 'clamp(42px, 6vw, 80px)',
          fontWeight: 700, letterSpacing: '-3px',
          lineHeight: 0.95, color: '#F0ECE3',
        }}>
          Things I&apos;ve<br />
          <span style={{
            background: 'linear-gradient(135deg, #C9A96E, #D4847A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Built.
          </span>
        </h2>
      </div>

      {/* Project list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#C9A96E11' }}>
        {PROJECTS.map((p, i) => (
          <ProjectTiltCard key={p.name} p={p} i={i} hovered={hovered} setHovered={setHovered} isMobile={isMobile} />
        ))}
      </div>
    </section>
  )
}
