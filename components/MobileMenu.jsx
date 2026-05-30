'use client'
import { useEffect } from 'react'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/FaizanKhan2910' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/faizan-khan-57092832a' },
  { label: 'Email', href: 'mailto:fk6307672466@email.com' },
]

export default function MobileMenu({ isOpen, onClose }) {
  // Prevent scrolling on body when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const scrollTo = (id) => {
    onClose()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0C0C0E', zIndex: 200,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
      pointerEvents: isOpen ? 'all' : 'none',
    }}>
      {/* Close button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'none', border: 'none',
          color: '#C9A96E', fontSize: '24px',
          padding: '8px', paddingRight: 0,
        }}
      >
        ✕
      </button>

      {/* Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        {['about', 'work', 'achievements', 'stack', 'contact'].map((item, index) => (
          <button 
            key={item} 
            onClick={() => scrollTo(item)}
            style={{
              background: 'none', border: 'none',
              fontFamily: 'var(--font-space)',
              fontSize: '40px', fontWeight: 700,
              textTransform: 'uppercase', color: '#F0ECE3',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.4s cubic-bezier(0.76, 0, 0.24, 1) ${0.1 + index * 0.05}s`,
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Social Icons row */}
      <div style={{
        position: 'absolute', bottom: '40px',
        display: 'flex', gap: '24px',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.76, 0, 0.24, 1) 0.4s',
      }}>
        {SOCIALS.map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: 'var(--font-space)', fontSize: '12px', letterSpacing: '1px',
            color: '#7A7572', textDecoration: 'none', textTransform: 'uppercase'
          }}>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  )
}
