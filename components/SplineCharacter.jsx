'use client'
import Spline from '@splinetool/react-spline'
import { useState } from 'react'

export default function SplineCharacter() {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <div style={{ 
          position: 'absolute', inset: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#C9A96E', fontFamily: 'var(--font-space)', fontSize: '12px', letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Loading Model...
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/VjQq1h1MdhffUUZd/scene.splinecode"
        onLoad={() => setLoading(false)}
        style={{ width: '100%', height: '100%', opacity: loading ? 0 : 1, transition: 'opacity 1s ease' }}
      />
    </div>
  )
}
