'use client'
import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import MobileMenu from './MobileMenu'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (id) => {
    if (pathname !== '/') {
      router.push(`/#${id}`)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? '16px 24px' : '20px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(12,12,14,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #C9A96E11' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: '20px',
            fontWeight: 700,
            color: '#C9A96E',
            letterSpacing: '-0.5px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>FK</span>
        </Link>

        {isMobile ? (
          <button 
            onClick={() => setMenuOpen(true)}
            style={{
              background: 'none', border: 'none',
              color: '#C9A96E', fontSize: '24px',
              padding: '8px', paddingRight: 0,
            }}
          >
            ☰
          </button>
        ) : (
          <>
            {/* Email center */}
            <a href="mailto:fk6307672466@email.com" style={{
              fontFamily: 'var(--font-space)',
              fontSize: '12px',
              letterSpacing: '1px',
              color: '#7A7572',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
              onMouseEnter={e => e.target.style.color = '#C9A96E'}
              onMouseLeave={e => e.target.style.color = '#7A7572'}
            >
              fk6307672466@email.com
            </a>

            {/* Nav links: DSA | RESUME ↗ | ABOUT | WORK | CONTACT */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {/* 1. DSA Nav Item — scrolls to #dsa section */}
              <button
                onClick={() => handleNavClick('dsa')}
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#C9A96E',
                  background: 'transparent',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  borderRadius: '4px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(201, 169, 110, 0.12)'
                  e.currentTarget.style.borderColor = '#C9A96E'
                  e.currentTarget.style.color = '#E8C97E'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)'
                  e.currentTarget.style.color = '#C9A96E'
                }}
              >
                <span>DSA</span>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A96E' }} />
              </button>

              {/* 2. Resume Link — immediately after DSA */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#C9A96E',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  border: '1px solid #C9A96E44',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#C9A96E18'
                  e.currentTarget.style.borderColor = '#C9A96E'
                  e.currentTarget.style.color = '#E8C97E'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#C9A96E44'
                  e.currentTarget.style.color = '#C9A96E'
                }}
              >
                Resume
                <span style={{ fontSize: '10px', lineHeight: 1 }}>↗</span>
              </a>

              {/* 3. About, Work, Contact */}
              {['about', 'work', 'contact'].map(item => (
                <button key={item} onClick={() => handleNavClick(item)} style={{
                  background: 'none', border: 'none',
                  fontFamily: 'var(--font-space)',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#7A7572',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  padding: '4px 0',
                }}
                  onMouseEnter={e => e.target.style.color = '#C9A96E'}
                  onMouseLeave={e => e.target.style.color = '#7A7572'}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
