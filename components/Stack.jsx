'use client'

const STACK = [
  {
    category: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java'],
    color: '#C9A96E',
  },
  {
    category: 'Frontend',
    items: ['React 19', 'Next.js', 'HTML5', 'CSS3', 'Material UI', 'Bootstrap', 'Vite', 'TailwindCSS', 'Redux Toolkit', 'Framer Motion'],
    color: '#D4847A',
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'Postman', 'REST APIs', 'WebSockets', 'JWT Auth'],
    color: '#C9A96E',
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'MongoDB Atlas', 'PostgreSQL', 'Supabase'],
    color: '#D4847A',
  },

  {
    category: 'DevOps',
    items: ['Docker', 'GitHub Actions', 'CI/CD', 'Render', 'Kubernetes'],
    color: '#D4847A',
  },
]

import { useIsMobile } from '../hooks/useIsMobile'

export default function Stack() {
  const isMobile = useIsMobile()

  return (
    <section id="stack" style={{ padding: isMobile ? '80px 24px' : '140px 100px', maxWidth: '1400px', margin: '0 auto' }}>

      <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isMobile ? '40px' : '80px' }}>
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#7A7572' }}>04</span>
        <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', letterSpacing: '3px', color: '#C9A96E' }}>Stack</span>
      </div>

      <div className="reveal" style={{ marginBottom: isMobile ? '40px' : '64px' }}>
        <h2 style={{
          fontFamily: 'var(--font-space)',
          fontSize: 'clamp(42px, 6vw, 80px)',
          fontWeight: 700, letterSpacing: '-3px',
          lineHeight: 0.95, color: '#F0ECE3',
        }}>
          Tools I<br />
          <span style={{
            background: 'linear-gradient(135deg, #C9A96E, #D4847A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Master.
          </span>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1px',
        background: '#C9A96E0A'
      }}>
        {STACK.map((s, i) => (
          <div key={i} className="reveal" style={{
            padding: isMobile ? '32px 24px' : '40px',
            background: '#0C0C0E',
            transition: 'background 0.3s',
          }}
            onMouseEnter={e => !isMobile && (e.currentTarget.style.background = '#0F0F14')}
            onMouseLeave={e => !isMobile && (e.currentTarget.style.background = '#0C0C0E')}
          >
            <div style={{
              fontFamily: 'var(--font-space)',
              fontSize: '10px', letterSpacing: '3px',
              color: s.color, textTransform: 'uppercase',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{ width: '20px', height: '1px', background: s.color }} />
              {s.category}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {s.items.map(item => (
                <span key={item} style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '13px', fontWeight: 500,
                  padding: '6px 14px',
                  border: `1px solid ${s.color}22`,
                  color: '#9A9592',
                  borderRadius: '2px',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    if (!isMobile) {
                      e.currentTarget.style.borderColor = s.color
                      e.currentTarget.style.color = s.color
                      e.currentTarget.style.background = s.color + '11'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isMobile) {
                      e.currentTarget.style.borderColor = s.color + '22'
                      e.currentTarget.style.color = '#9A9592'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
