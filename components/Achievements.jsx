'use client'

const WINS = [
  {
    place: '1st',
    name: 'JSS Navotthana 2.0',
    level: 'National Level Hackathon',
    date: 'Apr 2026',
    teams: '70+ teams',
    project: 'NEXUS AUTHENTICATION',
    desc: 'AI-powered multimodal biometric security platform — gesture recognition, voice-liveness analysis, spoof detection, and emergency SOS intelligence.',
  },
  {
    place: '1st',
    name: 'HACKATRONICS 2.0',
    level: '24-Hour Inter-Collegiate Hackathon',
    date: 'Dec 2025',
    teams: '53+ teams',
    project: 'AI Mental Wellness Monitor',
    desc: 'AI-driven emotional and mental wellness monitoring — facial expression analysis, voice patterns, communication behavior, and real-time stress detection.',
  },
  {
    place: '1st',
    name: 'CODEFORGE 2K25',
    level: '8-Hour Inter-Collegiate Hackathon',
    date: 'Feb 2025',
    teams: '53+ teams',
    project: 'AI Code Analyzer',
    desc: 'High-performance AI code analysis platform. React 19 + FastAPI + AST-based static analysis + Gemini AI. Real-time complexity visualisation and intelligent documentation.',
  },
]

import { useIsMobile } from '../hooks/useIsMobile'

export default function Achievements() {
  const isMobile = useIsMobile()

  return (
    <section id="achievements" style={{ padding: isMobile ? '80px 24px' : '140px 100px', background: '#0A0A0C', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isMobile ? '40px' : '80px' }}>
          <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#7A7572' }}>03</span>
          <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
          <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#C9A96E' }}>Hackathon Record</span>
        </div>

        {/* Big callout */}
        <div className="reveal" style={{ marginBottom: isMobile ? '60px' : '100px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(48px, 8vw, 120px)',
            fontWeight: 700, letterSpacing: '-4px',
            lineHeight: 0.9,
          }}>
            <span style={{ color: '#F0ECE3' }}>3</span>
            <span style={{ color: '#C9A96E' }}> entered.</span><br />
            <span style={{ color: '#F0ECE3' }}>3</span>
            <span style={{ color: '#D4847A' }}> won.</span><br />
            <span style={{ color: '#7A7572' }}>0 losses.</span>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {!isMobile && (
            <div style={{
              position: 'absolute', left: '0', top: '0', bottom: '0',
              width: '1px', background: 'linear-gradient(to bottom, transparent, #C9A96E33, transparent)',
            }} />
          )}

          {WINS.map((w, i) => (
            <div key={i} className="reveal" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
              gap: isMobile ? '16px' : '60px',
              paddingLeft: isMobile ? '0' : '40px',
              paddingBottom: i < WINS.length - 1 ? (isMobile ? '48px' : '80px') : '0',
              position: 'relative',
            }}>
              {/* Timeline dot */}
              {!isMobile && (
                <div style={{
                  position: 'absolute', left: '-5px', top: '8px',
                  width: '11px', height: '11px',
                  border: '2px solid #C9A96E',
                  borderRadius: '50%',
                  background: '#0A0A0C',
                }} />
              )}

              {/* Left meta */}
              <div style={{ 
                display: isMobile ? 'flex' : 'block', 
                alignItems: isMobile ? 'baseline' : 'stretch',
                gap: isMobile ? '16px' : '0' 
              }}>
                <div style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 700, letterSpacing: '-2px',
                  background: 'linear-gradient(135deg, #C9A96E, #F0ECE3)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  marginBottom: isMobile ? '0' : '8px',
                }}>
                  {w.place}
                </div>
                <div style={{ display: isMobile ? 'flex' : 'block', gap: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '2px', color: '#7A7572' }}>
                    {w.date}
                  </div>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: '#C9A96E44', marginTop: isMobile ? '0' : '4px' }}>
                    {w.teams}
                  </div>
                </div>
              </div>

              {/* Right content */}
              <div style={{ paddingTop: isMobile ? '0' : '8px' }}>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '2px', color: '#7A7572', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {w.level}
                </div>
                <h3 style={{ fontFamily: 'var(--font-space)', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', color: '#F0ECE3', marginBottom: '8px' }}>
                  {w.name}
                </h3>
                <div style={{
                  fontFamily: 'var(--font-space)', fontSize: '12px', letterSpacing: '1px',
                  color: '#C9A96E', marginBottom: '16px',
                  padding: '4px 12px', border: '1px solid #C9A96E22',
                  borderRadius: '2px', display: 'inline-block',
                }}>
                  {w.project}
                </div>
                <p style={{ fontFamily: 'var(--font-space)', fontSize: '14px', lineHeight: 1.8, color: '#9A9592', maxWidth: '500px' }}>
                  {w.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
