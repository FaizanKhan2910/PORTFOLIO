'use client'

import { useIsMobile } from '../hooks/useIsMobile'

export default function Contact() {
  const isMobile = useIsMobile()

  return (
    <section id="contact" style={{ padding: isMobile ? '80px 24px' : '140px 100px', background: '#0A0A0C', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isMobile ? '40px' : '80px' }}>
          <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#7A7572' }}>05</span>
          <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
          <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#C9A96E' }}>Let&apos;s Build</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
          <div className="reveal">
            <h2 style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              fontWeight: 700, letterSpacing: '-2px',
              lineHeight: 1, color: '#F0ECE3',
              marginBottom: '24px',
            }}>
              Got an idea?<br />
              <span style={{
                background: 'linear-gradient(135deg, #C9A96E, #D4847A)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Let&apos;s make it real.
              </span>
            </h2>

            <p style={{ fontFamily: 'var(--font-space)', fontSize: '15px', lineHeight: 1.8, color: '#9A9592', marginBottom: '40px', maxWidth: '400px' }}>
              Open to internships, collaborations, and interesting problems. If you&apos;re building something ambitious, I want to hear about it.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Email', value: 'fk6307672466@email.com', href: 'mailto:fk6307672466@email.com' },
                { label: 'LinkedIn', value: 'faizan-khan', href: 'https://linkedin.com/in/faizan-khan-57092832a' },
                { label: 'GitHub', value: 'FaizanKhan2910', href: 'https://github.com/FaizanKhan2910' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    textDecoration: 'none', padding: '16px 0',
                    borderBottom: '1px solid #C9A96E11',
                    transition: 'border-color 0.3s',
                    group: true,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A96E33'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#C9A96E11'}
                >
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '10px', letterSpacing: '2px', color: '#7A7572', width: '70px', textTransform: 'uppercase' }}>
                    {link.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '14px', color: '#F0ECE3', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {link.value}
                  </span>
                  <span style={{ color: '#C9A96E', fontSize: '14px' }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
            <a
              href="mailto:fk6307672466@email.com"
              className="magnetic"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                padding: '20px 40px',
                width: isMobile ? '100%' : 'auto',
                border: '1px solid #C9A96E',
                background: isMobile ? '#C9A96E' : 'transparent',
                fontFamily: 'var(--font-space)',
                fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase',
                color: isMobile ? '#0C0C0E' : '#C9A96E', textDecoration: 'none',
                borderRadius: '2px',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => {
                if (!isMobile) {
                  e.currentTarget.style.background = '#C9A96E'
                  e.currentTarget.style.color = '#0C0C0E'
                }
              }}
              onMouseLeave={e => {
                if (!isMobile) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#C9A96E'
                }
              }}
            >
              Send a message <span style={{ fontSize: '18px' }}>→</span>
            </a>

            <a
              href="/Faizan_5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '12px', letterSpacing: '2px',
                color: '#7A7572', textDecoration: 'none',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
              onMouseLeave={e => e.currentTarget.style.color = '#7A7572'}
            >
              Download Resume ↗
            </a>

            {/* Open to work badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 20px',
              border: '1px solid #3fb95022',
              borderRadius: '2px',
              marginTop: '16px',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#3fb950',
                boxShadow: '0 0 8px #3fb950',
                animation: 'glow 2s ease infinite',
              }} />
              <style>{`@keyframes glow { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
              <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '2px', color: '#3fb950', textTransform: 'uppercase' }}>
                Open to internships · Summer 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
