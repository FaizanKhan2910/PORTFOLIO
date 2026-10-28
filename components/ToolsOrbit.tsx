'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export type ToolCategory = 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'DevOps'

interface ToolChip {
  id: string
  name: string
  category: ToolCategory
  ring: 'inner' | 'middle' | 'outer'
  angle: number // in degrees
}

interface AdditionalToolsByCategory {
  [key: string]: string[]
}

const ALL_CATEGORIES: ToolCategory[] = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'DevOps',
]

// 20 Orbit Chips Distributed across 3 rings
const ORBIT_CHIPS: ToolChip[] = [
  // Inner ring (4 chips, radius 17%)
  { id: 'react19', name: 'React 19', category: 'Frontend', ring: 'inner', angle: 0 },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', ring: 'inner', angle: 90 },
  { id: 'typescript', name: 'TypeScript', category: 'Languages', ring: 'inner', angle: 180 },
  { id: 'python', name: 'Python', category: 'Languages', ring: 'inner', angle: 270 },

  // Middle ring (7 chips, radius 30%)
  { id: 'nodejs', name: 'Node.js', category: 'Backend', ring: 'middle', angle: 0 },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend', ring: 'middle', angle: 51.4 },
  { id: 'mongodb', name: 'MongoDB', category: 'Databases', ring: 'middle', angle: 102.8 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Databases', ring: 'middle', angle: 154.3 },
  { id: 'docker', name: 'Docker', category: 'DevOps', ring: 'middle', angle: 205.7 },
  { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps', ring: 'middle', angle: 257.1 },
  { id: 'tailwind', name: 'Tailwind', category: 'Frontend', ring: 'middle', angle: 308.6 },

  // Outer ring (9 chips, radius 43%)
  { id: 'framer', name: 'Framer Motion', category: 'Frontend', ring: 'outer', angle: 0 },
  { id: 'websockets', name: 'WebSockets', category: 'Backend', ring: 'outer', angle: 40 },
  { id: 'supabase', name: 'Supabase', category: 'Databases', ring: 'outer', angle: 80 },
  { id: 'java', name: 'Java', category: 'Languages', ring: 'outer', angle: 120 },
  { id: 'git', name: 'Git', category: 'DevOps', ring: 'outer', angle: 160 },
  { id: 'cicd', name: 'CI/CD', category: 'DevOps', ring: 'outer', angle: 200 },
  { id: 'express', name: 'Express', category: 'Backend', ring: 'outer', angle: 240 },
  { id: 'javascript', name: 'JavaScript', category: 'Languages', ring: 'outer', angle: 280 },
  { id: 'redux', name: 'Redux Toolkit', category: 'Frontend', ring: 'outer', angle: 320 },
]

// All original tools that don't fit on the 20 orbit chips
const ADDITIONAL_TOOLS: AdditionalToolsByCategory = {
  Languages: [],
  Frontend: ['HTML5', 'CSS3', 'Vite', 'Material UI', 'Bootstrap'],
  Backend: ['REST APIs', 'JWT Auth', 'Bcrypt', 'Postman', 'Jest'],
  Databases: ['MongoDB Atlas'],
  DevOps: ['GitHub Actions', 'Render'],
}

const ALL_ADDITIONAL_SUMMARY = [
  'HTML5',
  'CSS3',
  'Vite',
  'REST APIs',
  'MongoDB Atlas',
  'GitHub Actions',
  'Render',
  'Postman',
  'Jest',
  'JWT Auth',
]

interface ToolsOrbitProps {
  isMobile?: boolean
}

export default function ToolsOrbit({ isMobile = false }: ToolsOrbitProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(media.matches)
      const handler = () => setPrefersReducedMotion(media.matches)
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
  }, [])

  // 3D Parallax Tilt using Framer Motion
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 24, stiffness: 140 }
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isMobile) return
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleCategoryClick = (category: ToolCategory) => {
    setActiveCategory(prev => (prev === category ? null : category))
  }

  // Displayed additional tools under the pills
  const displayedAdditionalTools = useMemo(() => {
    if (activeCategory) {
      return ADDITIONAL_TOOLS[activeCategory] || []
    }
    return ALL_ADDITIONAL_SUMMARY
  }, [activeCategory])

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Aurora Background (3 drifting blurred blobs) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Blob 1: Gold */}
        <div
          className="aurora-blob-1"
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: isMobile ? '300px' : '440px',
            height: isMobile ? '300px' : '440px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(200, 169, 122, 0.14) 0%, rgba(200, 169, 122, 0) 70%)',
            filter: 'blur(75px)',
            opacity: 0.85,
          }}
        />
        {/* Blob 2: Rose */}
        <div
          className="aurora-blob-2"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: isMobile ? '320px' : '480px',
            height: isMobile ? '320px' : '480px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(201, 139, 126, 0.13) 0%, rgba(201, 139, 126, 0) 70%)',
            filter: 'blur(80px)',
            opacity: 0.8,
          }}
        />
        {/* Blob 3: Faint Violet */}
        <div
          className="aurora-blob-3"
          style={{
            position: 'absolute',
            top: '45%',
            left: '40%',
            width: isMobile ? '280px' : '400px',
            height: isMobile ? '280px' : '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(90, 75, 209, 0.11) 0%, rgba(90, 75, 209, 0) 70%)',
            filter: 'blur(85px)',
            opacity: 0.75,
          }}
        />
      </div>

      {/* Main Orbit Stage Container */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          perspective: 1200,
        }}
      >
        {/* Tilting Stage Canvas */}
        <motion.div
          className="orbit-stage"
          style={{
            rotateX: prefersReducedMotion ? 0 : tiltX,
            rotateY: prefersReducedMotion ? 0 : tiltY,
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: isMobile ? 'min(88vw, 440px)' : '540px',
            height: isMobile ? 'min(88vw, 440px)' : '540px',
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Faint Dashed Rings */}
          {/* Inner Ring (radius 17% -> diameter 34%) */}
          <div
            className="orbit-faint-ring"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '34%',
              height: '34%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px dashed rgba(45, 45, 55, 0.9)',
              pointerEvents: 'none',
              boxShadow: '0 0 20px rgba(200, 169, 122, 0.03)',
            }}
          />

          {/* Middle Ring (radius 30% -> diameter 60%) */}
          <div
            className="orbit-faint-ring"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '60%',
              height: '60%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px dashed rgba(45, 45, 55, 0.9)',
              pointerEvents: 'none',
              boxShadow: '0 0 24px rgba(200, 169, 122, 0.03)',
            }}
          />

          {/* Outer Ring (radius 43% -> diameter 86%) */}
          <div
            className="orbit-faint-ring"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '86%',
              height: '86%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px dashed rgba(45, 45, 55, 0.9)',
              pointerEvents: 'none',
              boxShadow: '0 0 30px rgba(200, 169, 122, 0.04)',
            }}
          />

          {/* CENTER CORE: 70px glowing circle with "FK" */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 16, stiffness: 120, delay: 0.1 }}
            className="fk-core"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '60px' : '70px',
              height: isMobile ? '60px' : '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c8a97a 0%, #c98b7e 100%)',
              color: '#0d0d11',
              fontFamily: 'var(--font-space)',
              fontWeight: 800,
              fontSize: isMobile ? '19px' : '23px',
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              userSelect: 'none',
              cursor: 'default',
            }}
          >
            FK
          </motion.div>

          {/* ROTATING RINGS WITH CHIPS */}
          {/* 1. INNER RING: 4 chips, radius 17%, 26s per rotation, clockwise */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 18, stiffness: 100, delay: 0.2 }}
            className={`orbit-rotator-inner ${prefersReducedMotion ? 'no-spin' : ''}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              zIndex: 3,
            }}
          >
            {ORBIT_CHIPS.filter(c => c.ring === 'inner').map(chip => (
              <ChipNode
                key={chip.id}
                chip={chip}
                radiusRatio={0.17}
                spinClass="orbit-counter-inner"
                activeCategory={activeCategory}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </motion.div>

          {/* 2. MIDDLE RING: 7 chips, radius 30%, 40s per rotation, counter-clockwise */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 18, stiffness: 100, delay: 0.35 }}
            className={`orbit-rotator-middle ${prefersReducedMotion ? 'no-spin' : ''}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              zIndex: 4,
            }}
          >
            {ORBIT_CHIPS.filter(c => c.ring === 'middle').map(chip => (
              <ChipNode
                key={chip.id}
                chip={chip}
                radiusRatio={0.3}
                spinClass="orbit-counter-middle"
                activeCategory={activeCategory}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </motion.div>

          {/* 3. OUTER RING: 9 chips, radius 43%, 60s per rotation, clockwise */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 18, stiffness: 100, delay: 0.5 }}
            className={`orbit-rotator-outer ${prefersReducedMotion ? 'no-spin' : ''}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              zIndex: 5,
            }}
          >
            {ORBIT_CHIPS.filter(c => c.ring === 'outer').map(chip => (
              <ChipNode
                key={chip.id}
                chip={chip}
                radiusRatio={0.43}
                spinClass="orbit-counter-outer"
                activeCategory={activeCategory}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* CATEGORY FILTER PILLS & ALSO LINE */}
        <div
          style={{
            marginTop: isMobile ? '32px' : '44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            width: '100%',
            maxWidth: '820px',
            zIndex: 6,
          }}
        >
          {/* 5 Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: isMobile ? '8px' : '10px',
            }}
          >
            {ALL_CATEGORIES.map(category => {
              const isSelected = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    fontFamily: 'var(--font-space)',
                    fontSize: isMobile ? '11px' : '12px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    padding: isMobile ? '6px 14px' : '7px 18px',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.2, 0.9, 0.2, 1)',
                    background: isSelected ? 'rgba(200, 169, 122, 0.18)' : '#0d0d11',
                    border: isSelected
                      ? '1px solid #c8a97a'
                      : '1px solid rgba(45, 45, 55, 0.8)',
                    color: isSelected ? '#f1ede4' : '#9a9592',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(200, 169, 122, 0.35)'
                      : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 122, 0.45)'
                      e.currentTarget.style.color = '#d6d0c4'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(45, 45, 55, 0.8)'
                      e.currentTarget.style.color = '#9a9592'
                    }
                  }}
                >
                  {category}
                </button>
              )
            })}
          </div>

          {/* "also: ..." line to showcase all tools not on the 20 orbit chips */}
          <div
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: isMobile ? '12px' : '13px',
              color: '#77716b',
              textAlign: 'center',
              lineHeight: 1.6,
              maxWidth: '680px',
              padding: '0 16px',
              minHeight: '22px',
              transition: 'opacity 0.3s ease',
            }}
          >
            <span style={{ color: '#c8a97a', fontWeight: 600 }}>
              {activeCategory ? `Also in ${activeCategory}: ` : 'Also mastered: '}
            </span>
            {displayedAdditionalTools.length > 0 ? (
              <span>{displayedAdditionalTools.join(' · ')}</span>
            ) : (
              <span style={{ fontStyle: 'italic', color: '#9a9592' }}>
                All core tools actively orbiting above
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Embedded CSS for 60fps orbits, upright counter-rotations, and pausing on hover */}
      <style jsx global>{`
        /* Stage dimension variable */
        .orbit-stage {
          --s: 540px;
        }
        @media (max-width: 640px) {
          .orbit-stage {
            --s: min(88vw, 440px);
          }
        }

        /* FK Core Pulsing Box-Shadow */
        @keyframes fk-glow-pulse {
          0%,
          100% {
            box-shadow: 0 0 22px rgba(200, 169, 122, 0.4),
              0 0 45px rgba(201, 139, 126, 0.2);
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 0 38px rgba(200, 169, 122, 0.7),
              0 0 75px rgba(201, 139, 126, 0.42);
            transform: translate(-50%, -50%) scale(1.04);
          }
        }
        .fk-core {
          animation: fk-glow-pulse 3s ease-in-out infinite;
        }

        /* 1. Inner Ring: 26s Clockwise */
        @keyframes orbit-spin-cw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbit-spin-ccw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        .orbit-rotator-inner {
          animation: orbit-spin-cw 26s linear infinite;
        }
        .orbit-counter-inner {
          animation: orbit-spin-ccw 26s linear infinite;
        }

        /* 2. Middle Ring: 40s Counter-Clockwise */
        .orbit-rotator-middle {
          animation: orbit-spin-ccw 40s linear infinite;
        }
        .orbit-counter-middle {
          animation: orbit-spin-cw 40s linear infinite;
        }

        /* 3. Outer Ring: 60s Clockwise */
        .orbit-rotator-outer {
          animation: orbit-spin-cw 60s linear infinite;
        }
        .orbit-counter-outer {
          animation: orbit-spin-ccw 60s linear infinite;
        }

        /* Hovering the stage pauses all orbits so people can read */
        .orbit-stage:hover .orbit-rotator-inner,
        .orbit-stage:hover .orbit-counter-inner,
        .orbit-stage:hover .orbit-rotator-middle,
        .orbit-stage:hover .orbit-counter-middle,
        .orbit-stage:hover .orbit-rotator-outer,
        .orbit-stage:hover .orbit-counter-outer {
          animation-play-state: paused !important;
        }

        /* Prefers-reduced-motion: stop rotations */
        .no-spin {
          animation: none !important;
        }
        .no-spin .orbit-counter-inner,
        .no-spin .orbit-counter-middle,
        .no-spin .orbit-counter-outer {
          animation: none !important;
        }

        /* Aurora Blobs animation loops (14s to 22s alternate) */
        @keyframes aurora-float-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(50px, -35px) scale(1.15);
          }
        }
        @keyframes aurora-float-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-45px, 40px) scale(1.12);
          }
        }
        @keyframes aurora-float-3 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(35px, 30px) scale(1.18);
          }
        }

        .aurora-blob-1 {
          animation: aurora-float-1 16s ease-in-out infinite alternate;
        }
        .aurora-blob-2 {
          animation: aurora-float-2 22s ease-in-out infinite alternate;
        }
        .aurora-blob-3 {
          animation: aurora-float-3 18s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}

// Individual chip component positioned on the ring with upright counter-rotation
interface ChipNodeProps {
  chip: ToolChip
  radiusRatio: number
  spinClass: string
  activeCategory: ToolCategory | null
  isMobile: boolean
  prefersReducedMotion: boolean
}

function ChipNode({
  chip,
  radiusRatio,
  spinClass,
  activeCategory,
  isMobile,
  prefersReducedMotion,
}: ChipNodeProps) {
  const isMatch = activeCategory === null || activeCategory === chip.category
  const isHighlighted = activeCategory !== null && activeCategory === chip.category

  return (
    // Static placement along the circle radius at angle
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `rotate(${chip.angle}deg) translateX(calc(var(--s) * ${radiusRatio}))`,
        width: 0,
        height: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Counter-rotate by -angle */}
      <div
        style={{
          transform: `rotate(${-chip.angle}deg)`,
          width: 0,
          height: 0,
        }}
      >
        {/* Innermost element spins in reverse at the exact same duration so text stays strictly upright */}
        <div
          className={`${spinClass} ${prefersReducedMotion ? 'no-spin' : ''}`}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              background: '#0d0d11',
              border: isHighlighted
                ? '1px solid #c8a97a'
                : '1px solid #26262c',
              borderRadius: '8px',
              padding: isMobile ? '4px 9px' : '5px 12px',
              color: isHighlighted ? '#f1ede4' : '#d6d0c4',
              fontFamily: 'var(--font-space)',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: isHighlighted
                ? '0 0 16px rgba(200, 169, 122, 0.45)'
                : '0 4px 12px rgba(0, 0, 0, 0.45)',
              opacity: isMatch ? 1 : 0.18,
              filter: isMatch ? 'none' : 'grayscale(0.8)',
              transform: isHighlighted ? 'scale(1.08)' : 'scale(1)',
              transition:
                'transform 0.25s cubic-bezier(0.2, 0.9, 0.2, 1), border-color 0.25s, box-shadow 0.25s, color 0.25s, opacity 0.35s, filter 0.35s',
              cursor: 'default',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (isMatch) {
                e.currentTarget.style.borderColor = '#c8a97a'
                e.currentTarget.style.color = '#f1ede4'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(200, 169, 122, 0.5)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={e => {
              if (isMatch) {
                e.currentTarget.style.borderColor = isHighlighted
                  ? '#c8a97a'
                  : '#26262c'
                e.currentTarget.style.color = isHighlighted
                  ? '#f1ede4'
                  : '#d6d0c4'
                e.currentTarget.style.boxShadow = isHighlighted
                  ? '0 0 16px rgba(200, 169, 122, 0.45)'
                  : '0 4px 12px rgba(0, 0, 0, 0.45)'
                e.currentTarget.style.transform = isHighlighted
                  ? 'scale(1.08)'
                  : 'scale(1)'
              }
            }}
          >
            {chip.name}
          </div>
        </div>
      </div>
    </div>
  )
}
