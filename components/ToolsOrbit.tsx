'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export type ToolCategory =
  | 'Languages'
  | 'Frontend'
  | 'Backend & APIs'
  | 'Databases'
  | 'AI/ML & LLM'
  | 'Cloud & DevOps'
  | 'Dev Tools & Geo'

interface ToolChip {
  id: string
  name: string
  category: ToolCategory
  ring: 'inner' | 'middle' | 'outer'
  angle: number // degrees
}

export const ALL_SKILLS_DATA: Record<ToolCategory, string[]> = {
  'Languages': ['Java', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL'],
  'Frontend': ['React', 'Next.js', 'Vite', 'Redux Toolkit', 'Tailwind CSS', 'Bootstrap', 'HTML5', 'CSS3', 'Framer Motion'],
  'Backend & APIs': ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'WebSockets', 'JWT', 'Passport.js', 'Bcrypt', 'Joi', 'Prisma ORM'],
  'Databases': ['MongoDB', 'MongoDB Atlas', 'PostgreSQL', 'Supabase', 'Qdrant'],
  'AI/ML & LLM': ['YOLOv8', 'Computer Vision', 'Image Processing', 'Object Detection', 'Llama 3', 'Gemini API', 'Groq API', 'LLM Integration', 'Prompt Engineering', 'Embeddings', 'RAG', 'Vector Search'],
  'Cloud & DevOps': ['Docker', 'Kubernetes', 'Git', 'GitHub', 'GitHub Actions', 'CI/CD', 'Vercel', 'Render'],
  'Dev Tools & Geo': ['Postman', 'Jest', 'Cloudinary', 'ImageKit', 'Stripe', 'Leaflet', 'MapLibre GL', 'Turf.js', 'GeoJSON', 'NDVI'],
}

export const ALL_CATEGORIES: ToolCategory[] = [
  'Languages',
  'Frontend',
  'Backend & APIs',
  'Databases',
  'AI/ML & LLM',
  'Cloud & DevOps',
  'Dev Tools & Geo',
]

// 24 Core Skills actively orbiting on the 3 concentric rings
const ORBIT_CHIPS: ToolChip[] = [
  // ── Inner Ring (5 chips, radius 22%) ──────────────────────────────────────
  { id: 'react', name: 'React', category: 'Frontend', ring: 'inner', angle: 0 },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', ring: 'inner', angle: 72 },
  { id: 'typescript', name: 'TypeScript', category: 'Languages', ring: 'inner', angle: 144 },
  { id: 'python', name: 'Python', category: 'Languages', ring: 'inner', angle: 216 },
  { id: 'nodejs', name: 'Node.js', category: 'Backend & APIs', ring: 'inner', angle: 288 },

  // ── Middle Ring (8 chips, radius 33%) ─────────────────────────────────────
  { id: 'fastapi', name: 'FastAPI', category: 'Backend & APIs', ring: 'middle', angle: 0 },
  { id: 'yolov8', name: 'YOLOv8', category: 'AI/ML & LLM', ring: 'middle', angle: 45 },
  { id: 'mongodb', name: 'MongoDB', category: 'Databases', ring: 'middle', angle: 90 },
  { id: 'docker', name: 'Docker', category: 'Cloud & DevOps', ring: 'middle', angle: 135 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Databases', ring: 'middle', angle: 180 },
  { id: 'llama3', name: 'Llama 3', category: 'AI/ML & LLM', ring: 'middle', angle: 225 },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', ring: 'middle', angle: 270 },
  { id: 'gemini', name: 'Gemini API', category: 'AI/ML & LLM', ring: 'middle', angle: 315 },

  // ── Outer Ring (11 chips, radius 44%) ────────────────────────────────────
  { id: 'java', name: 'Java', category: 'Languages', ring: 'outer', angle: 0 },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Cloud & DevOps', ring: 'outer', angle: 32.7 },
  { id: 'rag', name: 'RAG', category: 'AI/ML & LLM', ring: 'outer', angle: 65.4 },
  { id: 'qdrant', name: 'Qdrant', category: 'Databases', ring: 'outer', angle: 98.1 },
  { id: 'websockets', name: 'WebSockets', category: 'Backend & APIs', ring: 'outer', angle: 130.8 },
  { id: 'supabase', name: 'Supabase', category: 'Databases', ring: 'outer', angle: 163.5 },
  { id: 'framer', name: 'Framer Motion', category: 'Frontend', ring: 'outer', angle: 196.2 },
  { id: 'git', name: 'Git & GitHub', category: 'Cloud & DevOps', ring: 'outer', angle: 228.9 },
  { id: 'express', name: 'Express.js', category: 'Backend & APIs', ring: 'outer', angle: 261.6 },
  { id: 'vector', name: 'Vector Search', category: 'AI/ML & LLM', ring: 'outer', angle: 294.3 },
  { id: 'maplibre', name: 'MapLibre GL', category: 'Dev Tools & Geo', ring: 'outer', angle: 327 },
]

interface ToolsOrbitProps {
  isMobile?: boolean
}

export default function ToolsOrbit({ isMobile = false }: ToolsOrbitProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)

  // Total count of verified skills across all categories (59)
  const totalSkillsCount = useMemo(() => {
    return Object.values(ALL_SKILLS_DATA).reduce((acc, list) => acc + list.length, 0)
  }, [])

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
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)

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

  // Displayed tools under the filter pills
  const displayedCategorySkills = useMemo(() => {
    if (activeCategory) {
      return ALL_SKILLS_DATA[activeCategory] || []
    }
    return [
      'Java', 'TypeScript', 'Python', 'React', 'Next.js', 'FastAPI', 'Node.js',
      'YOLOv8', 'Llama 3', 'RAG', 'Vector Search', 'MongoDB', 'PostgreSQL',
      'Docker', 'Kubernetes', 'CI/CD', 'Leaflet', 'GeoJSON', 'Stripe'
    ]
  }, [activeCategory])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        padding: isMobile ? '10px 0 30px' : '20px 0 50px',
      }}
    >
      {/* ── Aurora Background Ambient Blobs ───────────────────────────────── */}
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
        <div
          className="aurora-blob-1"
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: isMobile ? '260px' : '420px',
            height: isMobile ? '260px' : '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 185, 66, 0.12) 0%, transparent 70%)',
            filter: 'blur(75px)',
            opacity: 0.8,
          }}
        />
        <div
          className="aurora-blob-2"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: isMobile ? '280px' : '440px',
            height: isMobile ? '280px' : '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 169, 123, 0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.75,
          }}
        />
      </div>

      {/* ── Main Orbit Stage Container (Centered Horizontally) ────────────── */}
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
          justifyContent: 'center',
          perspective: 1200,
        }}
      >
        {/* ── Tilting Stage Canvas (Symmetrical Width & Height) ─────────────── */}
        <motion.div
          className="orbit-stage"
          style={{
            rotateX: prefersReducedMotion ? 0 : tiltX,
            rotateY: prefersReducedMotion ? 0 : tiltY,
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: isMobile ? 'min(90vw, 420px)' : '520px',
            height: isMobile ? 'min(90vw, 420px)' : '520px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* ── Concentric Dashed Orbit Rings ───────────────────────────────── */}
          {/* Inner Ring: diameter 48% (radius 24%) */}
          <div
            className="orbit-faint-ring"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '48%',
              height: '48%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px dashed rgba(70, 70, 85, 0.85)',
              pointerEvents: 'none',
              boxShadow: '0 0 20px rgba(245, 185, 66, 0.04)',
            }}
          />

          {/* Middle Ring: diameter 70% (radius 35%) */}
          <div
            className="orbit-faint-ring"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '70%',
              height: '70%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px dashed rgba(70, 70, 85, 0.85)',
              pointerEvents: 'none',
              boxShadow: '0 0 24px rgba(245, 185, 66, 0.04)',
            }}
          />

          {/* Outer Ring: diameter 90% (radius 45%) */}
          <div
            className="orbit-faint-ring"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '90%',
              height: '90%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px dashed rgba(70, 70, 85, 0.85)',
              pointerEvents: 'none',
              boxShadow: '0 0 30px rgba(245, 185, 66, 0.05)',
            }}
          />

          {/* ── CENTER CORE: 100% Mathematically Centered at (50%, 50%) ───── */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '68px' : '80px',
              height: isMobile ? '68px' : '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A1713 0%, #0E0D0B 100%)',
              border: '1.5px solid #F5B942',
              color: '#F0ECE3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              cursor: 'default',
              zIndex: 10,
              boxShadow:
                '0 0 26px rgba(245, 185, 66, 0.45), inset 0 0 12px rgba(245, 185, 66, 0.22)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontWeight: 800,
                fontSize: isMobile ? '18px' : '22px',
                lineHeight: 1,
                background: 'linear-gradient(180deg, #FFF8E6 0%, #F5B942 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {activeCategory ? ALL_SKILLS_DATA[activeCategory].length : totalSkillsCount}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontWeight: 700,
                fontSize: isMobile ? '8.5px' : '9.5px',
                letterSpacing: '1.5px',
                color: '#E5A97B',
                textTransform: 'uppercase',
                marginTop: '3px',
              }}
            >
              SKILLS
            </span>
          </div>

          {/* ── ROTATING RINGS WITH CHIPS (Perfect concentric alignment) ──────── */}
          {/* 1. Inner Ring: 5 chips, radius 24%, 26s clockwise */}
          <div
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
                radiusRatio={0.24}
                spinClass="orbit-counter-inner"
                activeCategory={activeCategory}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>

          {/* 2. Middle Ring: 8 chips, radius 35%, 40s counter-clockwise */}
          <div
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
                radiusRatio={0.35}
                spinClass="orbit-counter-middle"
                activeCategory={activeCategory}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>

          {/* 3. Outer Ring: 11 chips, radius 45%, 60s clockwise */}
          <div
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
                radiusRatio={0.45}
                spinClass="orbit-counter-outer"
                activeCategory={activeCategory}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </motion.div>

        {/* ── FILTER PILLS & DETAILS (Clean balanced spacing) ────────────────── */}
        <div
          style={{
            marginTop: isMobile ? '36px' : '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '960px',
            zIndex: 8,
            position: 'relative',
          }}
        >
          {/* Category Filter Pills Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              padding: '0 8px',
              width: '100%',
            }}
          >
            {/* "All" Filter Button */}
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '10.5px' : '11.5px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: isMobile ? '6px 12px' : '7px 16px',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.2, 0.9, 0.2, 1)',
                background: activeCategory === null ? 'rgba(245, 185, 66, 0.18)' : '#0d0d11',
                border: activeCategory === null
                  ? '1px solid #F5B942'
                  : '1px solid rgba(50, 50, 60, 0.8)',
                color: activeCategory === null ? '#FFF8E6' : '#9a9592',
                boxShadow: activeCategory === null
                  ? '0 0 16px rgba(245, 185, 66, 0.35)'
                  : 'none',
              }}
            >
              All ({totalSkillsCount})
            </button>

            {ALL_CATEGORIES.map(category => {
              const isSelected = activeCategory === category
              const count = ALL_SKILLS_DATA[category].length
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    fontFamily: 'var(--font-space)',
                    fontSize: isMobile ? '10.5px' : '11.5px',
                    fontWeight: 600,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    padding: isMobile ? '6px 12px' : '7px 16px',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.2, 0.9, 0.2, 1)',
                    background: isSelected ? 'rgba(245, 185, 66, 0.18)' : '#0d0d11',
                    border: isSelected
                      ? '1px solid #F5B942'
                      : '1px solid rgba(50, 50, 60, 0.8)',
                    color: isSelected ? '#FFF8E6' : '#9a9592',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(245, 185, 66, 0.35)'
                      : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(245, 185, 66, 0.5)'
                      e.currentTarget.style.color = '#E5A97B'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(50, 50, 60, 0.8)'
                      e.currentTarget.style.color = '#9a9592'
                    }
                  }}
                >
                  {category} ({count})
                </button>
              )
            })}
          </div>

          {/* ── Detailed Skill Tags Showcase ───────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              maxWidth: '880px',
              padding: '0 12px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '10.5px' : '11.5px',
                fontWeight: 700,
                color: '#F5B942',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginRight: '4px',
              }}
            >
              {activeCategory ? `${activeCategory} [${displayedCategorySkills.length}]:` : `Featured [${displayedCategorySkills.length} of ${totalSkillsCount}]:`}
            </span>
            {displayedCategorySkills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: isMobile ? '10.5px' : '11.5px',
                  color: '#F0ECE3',
                  background: 'rgba(20, 20, 26, 0.85)',
                  border: '1px solid rgba(245, 185, 66, 0.22)',
                  borderRadius: '6px',
                  padding: '2.5px 9px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded CSS for 60fps orbits, upright counter-rotations, and pausing on hover */}
      <style>{`
        .orbit-stage {
          --s: 520px;
        }
        @media (max-width: 640px) {
          .orbit-stage {
            --s: min(90vw, 420px);
          }
        }

        /* 1. Inner Ring: 26s Clockwise */
        @keyframes orbit-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
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

        /* Hovering stage pauses orbits so users can inspect */
        .orbit-stage:hover .orbit-rotator-inner,
        .orbit-stage:hover .orbit-counter-inner,
        .orbit-stage:hover .orbit-rotator-middle,
        .orbit-stage:hover .orbit-counter-middle,
        .orbit-stage:hover .orbit-rotator-outer,
        .orbit-stage:hover .orbit-counter-outer {
          animation-play-state: paused !important;
        }

        .no-spin {
          animation: none !important;
        }
        .no-spin .orbit-counter-inner,
        .no-spin .orbit-counter-middle,
        .no-spin .orbit-counter-outer {
          animation: none !important;
        }

        @keyframes aurora-float-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(35px, -25px) scale(1.12); }
        }
        @keyframes aurora-float-2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 25px) scale(1.1); }
        }

        .aurora-blob-1 {
          animation: aurora-float-1 16s ease-in-out infinite alternate;
        }
        .aurora-blob-2 {
          animation: aurora-float-2 22s ease-in-out infinite alternate;
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
      <div
        style={{
          transform: `rotate(${-chip.angle}deg)`,
          width: 0,
          height: 0,
        }}
      >
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
              background: '#0e0e12',
              border: isHighlighted
                ? '1px solid #F5B942'
                : '1px solid #2a2a34',
              borderRadius: '8px',
              padding: isMobile ? '4px 8px' : '5px 11px',
              color: isHighlighted ? '#FFF8E6' : '#d6d0c4',
              fontFamily: 'var(--font-space)',
              fontSize: isMobile ? '10.5px' : '11.5px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: isHighlighted
                ? '0 0 16px rgba(245, 185, 66, 0.45)'
                : '0 4px 12px rgba(0, 0, 0, 0.5)',
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
                e.currentTarget.style.borderColor = '#F5B942'
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(245, 185, 66, 0.5)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={e => {
              if (isMatch) {
                e.currentTarget.style.borderColor = isHighlighted
                  ? '#F5B942'
                  : '#2a2a34'
                e.currentTarget.style.color = isHighlighted
                  ? '#FFF8E6'
                  : '#d6d0c4'
                e.currentTarget.style.boxShadow = isHighlighted
                  ? '0 0 16px rgba(245, 185, 66, 0.45)'
                  : '0 4px 12px rgba(0, 0, 0, 0.5)'
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
