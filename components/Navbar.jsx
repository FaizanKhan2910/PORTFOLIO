'use client'
import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
        <div style={{
          fontFamily: 'var(--font-space)',
          fontSize: '20px',
          fontWeight: 700,
          color: '#C9A96E',
          letterSpacing: '-0.5px',
        }}>
          FK
        </div>

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

            {/* Nav links */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              {['about', 'work', 'contact'].map(item => (
                <button key={item} onClick={() => scrollTo(item)} style={{
                  background: 'none', border: 'none',
                  fontFamily: 'var(--font-space)',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#7A7572',
                  cursor: 'none',
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
