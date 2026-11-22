'use client'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import CinematicParticles from './CinematicParticles'

const ROLES = [
  'FULL-STACK DEVELOPER',
  'AI / ML BUILDER',
  'HACKATHON WINNER',
  'OPEN TO INTERNSHIPS',
]

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

const LeetCodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
)

const CodolioIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 12l2.5 2.5L16 9" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.25" />
  </svg>
)

const SOCIALS = [
  { icon: <GithubIcon />, label: 'GitHub', href: 'https://github.com/FaizanKhan2910' },
  { icon: <LinkedinIcon />, label: 'LinkedIn', href: 'https://linkedin.com/in/faizan-khan-57092832a' },
  { icon: <LeetCodeIcon />, label: 'LeetCode', href: 'https://leetcode.com/u/Faizan__Khan2910/' },
  { icon: <CodolioIcon />, label: 'Codolio', href: 'https://codolio.com/profile/Faizankhan2910/' },
]

export default function Hero({ isLoaded = true }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const isMobile = useIsMobile()
  const wrapperRef = useRef(null)
  const leftNameRef = useRef(null)
  const rightRoleRef = useRef(null)

  // Typewriter effect for roles
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

  // Scrubbed Scroll Tracking across ~220vh wrapper
  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return
        const rect = wrapper.getBoundingClientRect()
        const totalScroll = rect.height - window.innerHeight
        if (totalScroll <= 0) return
        const p = Math.max(0, Math.min(1, -rect.top / totalScroll))
        setScrollProgress(p)

        // Scrubbed Circular-Fly-Away scroll effect on "FAIZAN KHAN" and Role text
        if (leftNameRef.current) {
          const flyX = -p * 200
          const flyY = -p * 80
          const flyRot = -p * 10
          const flyScale = Math.max(0.7, 1 - p * 0.25)
          const flyOpacity = Math.max(0, 1 - p * 1.5)
          leftNameRef.current.style.transform = `translate3d(${flyX}px, ${flyY}px, 0) rotate(${flyRot}deg) scale(${flyScale})`
          leftNameRef.current.style.opacity = flyOpacity
        }

        if (rightRoleRef.current) {
          const flyX = p * 200
          const flyY = -p * 80
          const flyRot = p * 10
          const flyScale = Math.max(0.7, 1 - p * 0.25)
          const flyOpacity = Math.max(0, 1 - p * 1.5)
          rightRoleRef.current.style.transform = `translate3d(${flyX}px, ${flyY}px, 0) rotate(${flyRot}deg) scale(${flyScale})`
          rightRoleRef.current.style.opacity = flyOpacity
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      ref={wrapperRef}
      id="hero-wrapper"
      data-hero-cursor="true"
      style={{
        position: 'relative',
        height: isMobile ? '180vh' : '220vh',
      }}
    >
      {/* Sticky 100vh Hero Viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          overflow: 'hidden',
        }}
      >
        {/* Cinematic Organic Floating Gold Particles */}
        <CinematicParticles section="hero" isMobile={isMobile} />
        {isMobile ? (
          // MOBILE LAYOUT
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              padding: '0 24px',
              zIndex: 10,
              pointerEvents: 'none',
              marginTop: '40px',
              opacity: Math.max(0, 1 - scrollProgress * 2.2),
              transform: `translate3d(0, ${-scrollProgress * 80}px, 0)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {/* Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                border: '1px solid #3fb95022',
                borderRadius: '20px',
                marginBottom: '20px',
                pointerEvents: 'auto',
                background: 'rgba(12, 12, 14, 0.4)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#3fb950',
                  boxShadow: '0 0 8px #3fb950',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '11px',
                  color: '#3fb950',
                }}
              >
                Available for internships
              </span>
            </div>

            {/* Name */}
            <h1
              ref={leftNameRef}
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: 'clamp(44px, 11vw, 68px)',
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: '-2px',
                color: '#F0ECE3',
                textAlign: 'center',
                marginBottom: '16px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              FAIZAN<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #C9A96E, #F0ECE3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                KHAN
              </span>
            </h1>

            {/* Portrait Spacer for Mobile */}
            <div
              style={{
                width: '100%',
                height: 'clamp(280px, 50vh, 420px)',
                position: 'relative',
                pointerEvents: 'none',
              }}
            />

            {/* Roles */}
            <div
              ref={rightRoleRef}
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: 'clamp(17px, 4.5vw, 24px)',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: '#F0ECE3',
                textAlign: 'center',
                minHeight: '2em',
                marginBottom: '24px',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4847A, #C9A96E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {displayed}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '0.9em',
                  background: '#C9A96E',
                  verticalAlign: 'middle',
                  marginLeft: '4px',
                  animation: 'blink 0.7s step-end infinite',
                }}
              />
            </div>

            {/* Socials Row */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '28px',
                pointerEvents: 'auto',
              }}
            >
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #C9A96E44',
                    borderRadius: '50%',
                    color: '#C5C1BD',
                    textDecoration: 'none',
                    background: 'rgba(12, 12, 14, 0.6)',
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Resume button */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '14px 0',
                border: '1px solid #C9A96E',
                color: '#C9A96E',
                fontFamily: 'var(--font-space)',
                fontSize: '13px',
                letterSpacing: '2px',
                textDecoration: 'none',
                textAlign: 'center',
                textTransform: 'uppercase',
                pointerEvents: 'auto',
                background: 'rgba(12, 12, 14, 0.7)',
              }}
            >
              RESUME ↗
            </a>

            <div
              style={{
                marginTop: '20px',
                fontFamily: 'var(--font-space)',
                fontSize: '11px',
                color: '#7A7572',
                letterSpacing: '1px',
              }}
            >
              Scroll to explore ↓
            </div>
          </div>
        ) : (
          // DESKTOP LAYOUT
          <>
            {/* Social sidebar */}
            <div
              style={{
                position: 'absolute',
                left: '32px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                zIndex: 10,
                opacity: Math.max(0, 1 - scrollProgress * 3.5),
                transition: 'opacity 0.1s linear',
              }}
            >
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #C9A96E44',
                    borderRadius: '50%',
                    fontFamily: 'var(--font-space)',
                    color: '#C5C1BD',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(12, 12, 14, 0.3)',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C9A96E'
                    e.currentTarget.style.color = '#C9A96E'
                    e.currentTarget.style.background = '#C9A96E11'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#C9A96E22'
                    e.currentTarget.style.color = '#7A7572'
                    e.currentTarget.style.background = 'rgba(12, 12, 14, 0.3)'
                  }}
                >
                  {s.icon}
                </a>
              ))}
              <div
                style={{
                  width: '1px',
                  height: '60px',
                  background: 'linear-gradient(to bottom, #C9A96E33, transparent)',
                  margin: '0 auto',
                }}
              />
            </div>

            {/* Left: Name with Circular Fly-Away Scroll Effect */}
            <div
              ref={leftNameRef}
              style={{
                position: 'absolute',
                left: '100px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '13px',
                  color: '#7A7572',
                  letterSpacing: '2px',
                  marginBottom: '12px',
                }}
              >
                Hello! I&apos;m
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: 'clamp(52px, 7vw, 92px)',
                  fontWeight: 700,
                  lineHeight: 0.95,
                  letterSpacing: '-3px',
                  color: '#F0ECE3',
                  textShadow: '0 4px 30px rgba(0,0,0,0.7)',
                }}
              >
                FAIZAN <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E, #F0ECE3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  KHAN
                </span>
              </h1>
            </div>

            {/* Right: Tagline / Roles with Circular Fly-Away Scroll Effect */}
            <div
              ref={rightRoleRef}
              style={{
                position: 'absolute',
                right: '80px',
                top: '50%',
                transform: 'translateY(-50%)',
                textAlign: 'right',
                zIndex: 10,
                maxWidth: '380px',
                pointerEvents: 'none',
                willChange: 'transform, opacity',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '13px',
                  color: '#7A7572',
                  letterSpacing: '2px',
                  marginBottom: '12px',
                }}
              >
                An
              </p>
              <div
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: 'clamp(24px, 3.5vw, 46px)',
                  fontWeight: 700,
                  letterSpacing: '-1px',
                  color: '#F0ECE3',
                  lineHeight: 1.1,
                  minHeight: '3em',
                  textShadow: '0 4px 30px rgba(0,0,0,0.7)',
                }}
              >
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4847A, #C9A96E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {displayed}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '0.9em',
                    background: '#C9A96E',
                    verticalAlign: 'middle',
                    marginLeft: '4px',
                    animation: 'blink 0.7s step-end infinite',
                  }}
                />
              </div>
            </div>

            {/* Resume button */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '80px',
                fontFamily: 'var(--font-space)',
                fontSize: '11px',
                letterSpacing: '2px',
                color: '#7A7572',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.3s',
                zIndex: 10,
                opacity: Math.max(0, 1 - scrollProgress * 3.5),
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#7A7572')}
            >
              RESUME ↗
            </a>

            {/* Scroll indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10,
                opacity: Math.max(0, 1 - scrollProgress * 3.5),
              }}
            >
              <div
                style={{
                  width: '1px',
                  height: '60px',
                  background: 'linear-gradient(to bottom, transparent, #C9A96E66)',
                  animation: 'scrollPulse 2s ease infinite',
                }}
              />
            </div>
          </>
        )}

        <style>{`
          @keyframes blink { 50% { opacity: 0; } }
          @keyframes scrollPulse { 0%,100%{opacity:0.3}50%{opacity:1} }
        `}</style>

        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: `
              linear-gradient(#C9A96E08 1px, transparent 1px),
              linear-gradient(90deg, #C9A96E08 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  )
}
