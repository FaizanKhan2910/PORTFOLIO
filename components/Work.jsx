'use client'
import { useState } from 'react'

const PROJECTS = [
  {
    num: '01',
    name: 'DENTRA',
    sub: 'DentalVision AI',
    tags: ['YOLOv8', 'Llama-3', 'React', 'Node.js', 'MongoDB'],
    desc: 'End-to-end AI diagnostic pipeline. Upload a dental X-ray — get cavity detection, LLM treatment reasoning, and a patient-ready PDF report in seconds. Built in 24 hours.',
    award: '1st Place · National · 70+ teams',
    link: 'https://github.com/FaizanKhan2910/DENTRA_AI',
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
    year: '2025',
  },
]

export default function Work() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="work" style={{ padding: '140px 100px', maxWidth: '1400px', margin: '0 auto' }}>

      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '80px' }}>
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#7A7572' }}>02</span>
        <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#C9A96E' }}>Selected Work</span>
      </div>

      <div className="reveal" style={{ marginBottom: '64px' }}>
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
          <div
            key={i}
            className="project-card reveal"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === i ? '#0F0F14' : '#0C0C0E',
              padding: '40px 48px',
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: '40px',
              alignItems: 'start',
              transition: 'background 0.3s ease',
              cursor: 'none',
            }}
          >
            {/* Number */}
            <div style={{
              fontFamily: 'var(--font-space)', fontSize: '12px',
              letterSpacing: '2px', color: '#7A7572',
              paddingTop: '6px',
            }}>
              {p.num}
            </div>

            {/* Content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <h3 style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: 'clamp(22px, 3vw, 36px)',
                  fontWeight: 700, letterSpacing: '-1px',
                  color: hovered === i ? '#C9A96E' : '#F0ECE3',
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
                  }}>
                    🏆 {p.award}
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', paddingTop: '4px' }}>
              <span style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: '#7A7572' }}>{p.year}</span>
              <a
                href={p.link} target="_blank" rel="noopener noreferrer"
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
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
