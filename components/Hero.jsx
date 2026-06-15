'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIsMobile } from '../hooks/useIsMobile'

const SplineCharacter = dynamic(() => import('./SplineCharacter'), { ssr: false })

const ROLES = ['FULL-STACK DEVELOPER', 'AI / ML BUILDER', 'HACKATHON WINNER', 'OPEN TO INTERNSHIPS']

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const SOCIALS = [
  { icon: <GithubIcon />, label: 'GitHub', href: 'https://github.com/FaizanKhan2910' },
  { icon: <LinkedinIcon />, label: 'LinkedIn', href: 'https://linkedin.com/in/faizan-khan-57092832a' },
  { icon: <TwitterIcon />, label: 'Twitter', href: '#' },
  { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [hasSpoken, setHasSpoken] = useState(false)
  const isMobile = useIsMobile()

  const handleFirstClick = () => {
    if (!hasSpoken) {
      setHasSpoken(true);

      // Cancel any stuck utterances
      window.speechSynthesis.cancel();

      const text = "Hi, I'm Faizan's digital assistant. Faizan is a 2nd-year AIML student, 3-time hackathon winner, and passionate software developer. He builds AI-powered products, full-stack applications, and innovative solutions designed to create real-world impact.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2; // 1.5 is sometimes too fast for default voices and can cause them to fail
      utterance.pitch = 1;

      // Speak synchronously so the browser registers it as a direct user action
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const target = ROLES[roleIndex]
    let timeout

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55)
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIndex])

  return (
    <section style={{
      height: '100vh', position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      overflow: 'hidden',
    }}>

      {!hasSpoken && (
        <div
          onClick={handleFirstClick}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 9999,
            cursor: 'pointer'
          }}
        />
      )}

      {isMobile ? (
        // MOBILE LAYOUT
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          width: '100%', padding: '0 24px', zIndex: 10,
          marginTop: '60px'
        }}>
          {/* Status Pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px', border: '1px solid #3fb95022',
            borderRadius: '20px', marginBottom: '32px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3fb950', boxShadow: '0 0 8px #3fb950' }} />
            <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: '#3fb950' }}>Available for internships</span>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(48px, 12vw, 72px)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-2px',
            color: '#F0ECE3',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            FAIZAN<br />
            <span style={{
              background: 'linear-gradient(135deg, #C9A96E, #F0ECE3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              KHAN
            </span>
          </h1>

          {/* Center: Spline */}
          <div style={{
            width: '100%', height: '400px',
            position: 'relative', margin: '0 auto',
            marginBottom: '24px',
            zIndex: 1,
          }}>
            <SplineCharacter />
          </div>

          {/* Roles */}
          <div style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(18px, 5vw, 28px)',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#F0ECE3',
            textAlign: 'center',
            minHeight: '2em',
            marginBottom: '32px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #D4847A, #C9A96E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {displayed}
            </span>
            <span style={{
              display: 'inline-block', width: '2px', height: '0.9em',
              background: '#C9A96E', verticalAlign: 'middle',
              marginLeft: '4px', animation: 'blink 0.7s step-end infinite',
            }} />
          </div>

          {/* Socials Row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{
                  width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #C9A96E44', borderRadius: '50%',
                  color: '#C5C1BD', textDecoration: 'none'
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Full width resume button */}
          <a
            href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            style={{
              width: '100%', padding: '16px 0',
              border: '1px solid #C9A96E',
              color: '#C9A96E',
              fontFamily: 'var(--font-space)', fontSize: '13px',
              letterSpacing: '2px', textDecoration: 'none',
              textAlign: 'center', textTransform: 'uppercase'
            }}
          >
            RESUME ↗
          </a>

          <div style={{ marginTop: '32px', fontFamily: 'var(--font-space)', fontSize: '11px', color: '#7A7572', letterSpacing: '1px' }}>
            Scroll to explore ↓
          </div>
        </div>
      ) : (
        // DESKTOP LAYOUT
        <>
          {/* Social sidebar */}
          <div style={{
            position: 'absolute', left: '32px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column',
            gap: '24px', zIndex: 10,
          }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                title={s.label}
                style={{
                  width: '42px', height: '42px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #C9A96E44',
                  borderRadius: '50%',
                  fontFamily: 'var(--font-space)',
                  color: '#C5C1BD',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C9A96E'
                  e.currentTarget.style.color = '#C9A96E'
                  e.currentTarget.style.background = '#C9A96E11'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#C9A96E22'
                  e.currentTarget.style.color = '#7A7572'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {s.icon}
              </a>
            ))}
            <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, #C9A96E33, transparent)', margin: '0 auto' }} />
          </div>

          {/* Left: Name */}
          <div style={{
            position: 'absolute', left: '100px', top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}>
            <p style={{
              fontFamily: 'var(--font-space)',
              fontSize: '13px',
              color: '#7A7572',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}>
              Hello! I&apos;m
            </p>
            <h1 style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(52px, 7vw, 92px)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-3px',
              color: '#F0ECE3',
            }}>
              FAIZAN <br />
              <span style={{
                background: 'linear-gradient(135deg, #C9A96E, #F0ECE3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                KHAN
              </span>
            </h1>
          </div>

          {/* Center: Spline */}
          <div style={{
            position: 'absolute',
            inset: 0, // Top 0, bottom 0, left 0, right 0
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'auto',
          }}>
            <SplineCharacter />
          </div>

          {/* Right: Role */}
          <div style={{
            position: 'absolute', right: '80px', top: '50%',
            transform: 'translateY(-50%)',
            textAlign: 'right',
            zIndex: 10, maxWidth: '380px',
          }}>
            <p style={{
              fontFamily: 'var(--font-space)',
              fontSize: '13px',
              color: '#7A7572',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}>
              An
            </p>
            <div style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(24px, 3.5vw, 46px)',
              fontWeight: 700,
              letterSpacing: '-1px',
              color: '#F0ECE3',
              lineHeight: 1.1,
              minHeight: '3em',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #D4847A, #C9A96E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {displayed}
              </span>
              <span style={{
                display: 'inline-block', width: '2px', height: '0.9em',
                background: '#C9A96E',
                verticalAlign: 'middle',
                marginLeft: '4px',
                animation: 'blink 0.7s step-end infinite',
              }} />
            </div>
          </div>

          {/* Resume button */}
          <a
            href="/Faizan_5.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute', bottom: '40px', right: '80px',
              fontFamily: 'var(--font-space)',
              fontSize: '11px',
              letterSpacing: '2px',
              color: '#7A7572',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'color 0.3s',
              zIndex: 10,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = '#7A7572'}
          >
            RESUME ↗
          </a>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '8px', zIndex: 10,
          }}>
            <div style={{
              width: '1px', height: '60px',
              background: 'linear-gradient(to bottom, transparent, #C9A96E66)',
              animation: 'scrollPulse 2s ease infinite',
            }} />
          </div>
        </>
      )}

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes scrollPulse { 0%,100%{opacity:0.3}50%{opacity:1} }
      `}</style>

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(#C9A96E08 1px, transparent 1px),
          linear-gradient(90deg, #C9A96E08 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }} />
    </section>
  )
}
