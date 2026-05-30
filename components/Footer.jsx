import { useIsMobile } from '../hooks/useIsMobile'

export default function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer style={{
      borderTop: '1px solid #C9A96E11',
      padding: isMobile ? '40px 24px' : '40px 100px',
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center', 
      justifyContent: isMobile ? 'center' : 'space-between',
      gap: isMobile ? '16px' : '0',
      background: '#0C0C0E',
    }}>
      <div style={{ fontFamily: 'var(--font-space)', fontSize: '18px', fontWeight: 700, color: '#C9A96E', letterSpacing: '-0.5px' }}>
        FK
      </div>
      <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '1px', color: '#7A7572', textAlign: isMobile ? 'center' : 'left' }}>
        © 2026 Faizan Khan · Designed & built with Next.js + Three.js
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {[
          { label: 'GH', href: 'https://github.com/FaizanKhan2910' },
          { label: 'LI', href: 'https://linkedin.com/in/faizan-khan-57092832a' },
          { label: 'EM', href: 'mailto:fk6307672466@email.com' },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '1px',
              color: '#7A7572', textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = '#7A7572'}
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
