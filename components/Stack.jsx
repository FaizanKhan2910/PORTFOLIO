'use client'

import { useIsMobile } from '../hooks/useIsMobile'
import ToolsOrbit from './ToolsOrbit'

export default function Stack() {
  const isMobile = useIsMobile()

  return (
    <section
      id="stack"
      style={{
        padding: isMobile ? '80px 24px' : '140px 100px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section Sub-heading */}
      <div
        className="reveal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: isMobile ? '40px' : '80px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#7A7572',
          }}
        >
          04
        </span>
        <div style={{ height: '1px', width: '60px', background: '#C9A96E33' }} />
        <span
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#C9A96E',
          }}
        >
          Stack
        </span>
      </div>

      {/* Main Heading */}
      <div
        className="reveal"
        style={{
          marginBottom: isMobile ? '40px' : '64px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 0.95,
            color: '#F0ECE3',
          }}
        >
          Tools I<br />
          <span
            style={{
              background: 'linear-gradient(135deg, #C9A96E, #D4847A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Master.
          </span>
        </h2>
      </div>

      {/* Dynamic Interactive Orbit System */}
      <ToolsOrbit isMobile={isMobile} />
    </section>
  )
}
