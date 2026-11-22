'use client'

import { useIsMobile } from '../hooks/useIsMobile'
import HackathonTrophy from './HackathonTrophy'

export default function Achievements() {
  const isMobile = useIsMobile()

  return (
    <section
      id="achievements"
      style={{
        padding: isMobile ? '80px 24px' : '140px 100px',
        background: '#000000',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          className="reveal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: isMobile ? '40px' : '80px',
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
            03
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
            Hackathon Record
          </span>
        </div>

        {/* 3× Hackathon Champion Interactive Stage */}
        <HackathonTrophy isMobile={isMobile} />
      </div>
    </section>
  )
}
