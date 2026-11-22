'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import ProjectCloud from './ProjectCloud'

export const FIVE_PROJECTS = [
  {
    num: '01',
    name: 'DENTRA',
    sub: 'DentalVision AI Diagnostics',
    category: 'AI Diagnostics Platform',
    headline: 'AI-Powered Dental Diagnostics & Treatment Reasoning',
    tags: ['YOLOv8', 'Llama-3', 'React', 'Node.js', 'Express', 'MongoDB'],
    desc: 'An AI-powered dental diagnostic platform that analyzes dental X-rays, detects potential cavities, provides LLM-assisted treatment reasoning, and generates patient-ready PDF reports in seconds.',
    problemSolved: 'Makes dental X-ray assessment and preliminary diagnostic workflows faster, smarter, and significantly more accessible.',
    targetAudience: 'Dentists, Dental Clinics & Radiologists',
    capabilities: [
      'Automated cavity detection on dental radiographs',
      'Llama-3 treatment reasoning & diagnostic insights',
      'Instant patient-ready PDF clinical report generation',
      'Dual-view comparative image analysis',
    ],
    award: '1st Place · National · 70+ Teams',
    link: 'https://github.com/FaizanKhan2910/DENTRA_AI',
    live: 'https://dentra-ai.vercel.app/',
    image: '/images/projects/dentra.jpg',
    year: '2026',
    accent: '#E5A97B',
    metrics: '98.2% Accuracy · Sub-2s Inference',
    results: [
      { label: 'Diagnostic Accuracy', value: '98.2%' },
      { label: 'Inference Latency', value: '<2s' },
      { label: 'Competing Teams Defeated', value: '70+' },
    ],
  },
  {
    num: '02',
    name: 'SigmaGPT',
    sub: 'AI-Powered SaaS Platform',
    category: 'Production SaaS',
    headline: 'Full-Stack Generative AI SaaS with Credit-Based Billing',
    tags: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Gemini 2.5 Flash', 'Stripe', 'ImageKit'],
    desc: 'A full-stack generative AI platform integrating conversational AI capabilities with secure authentication, subscription tiers, and seamless Stripe payment workflows.',
    problemSolved: 'Provides an integrated AI application experience combining premium AI conversational intelligence with automated payment support.',
    targetAudience: 'Productivity seekers, creators & digital professionals',
    capabilities: [
      'Gemini 2.5 Flash conversational intelligence',
      'Stripe subscription & credit-based checkout',
      'JWT session security & role-based access',
      'ImageKit CDN asset delivery optimization',
    ],
    award: 'Production SaaS',
    link: 'https://github.com/FaizanKhan2910/SigmaGPT',
    live: 'https://sigmagpt-1-ewdw.onrender.com',
    image: '/images/projects/sigmagpt.jpg',
    year: '2025',
    accent: '#E5A97B',
    metrics: '50+ Txns/Mo · 30+ Live Users · 45% Faster Loading',
    results: [
      { label: 'Monthly Transactions', value: '50+' },
      { label: 'Concurrent Users', value: '30+' },
      { label: 'Image Load Optimization', value: '-45%' },
    ],
  },
  {
    num: '03',
    name: 'Wanderlust',
    sub: 'Travel & Accommodation Marketplace',
    category: 'Travel Marketplace',
    headline: 'Full-Stack Accommodation Discovery & Host Management',
    tags: ['Node.js', 'Express', 'MongoDB Atlas', 'Cloudinary', 'MapLibre', 'Passport.js', 'Joi'],
    desc: 'A full-stack travel and accommodation marketplace that allows users to explore curated property listings, discover destinations with interactive maps, authenticate securely, and manage accommodations.',
    problemSolved: 'Simplifies property discovery and accommodation listing management for global travelers and independent hosts.',
    targetAudience: 'Travelers searching for stays & hosts listing properties',
    capabilities: [
      'Interactive geospatial MapLibre map exploration',
      'Cloudinary multi-image upload & optimization',
      'Passport.js user authentication & session management',
      'Joi schema validation & review rating systems',
    ],
    award: 'Full-Stack Architecture',
    link: 'https://github.com/FaizanKhan2910/Wanderlust',
    live: 'https://wanderlust-2-zhfl.onrender.com',
    image: '/images/projects/wanderlust.jpg',
    year: '2025',
    accent: '#E5A97B',
    metrics: 'Geospatial Discovery · Cloudinary CDN',
    results: [
      { label: 'Listing Architecture', value: 'Full CRUD' },
      { label: 'Geospatial Mapping', value: 'MapLibre GL' },
      { label: 'Media Pipeline', value: 'Cloudinary' },
    ],
  },
  {
    num: '04',
    name: 'NEXUS AUTHENTICATION',
    sub: 'Multimodal Biometric Security',
    category: 'Cybersecurity & Biometrics',
    headline: 'Multimodal Biometric Authentication & Anti-Spoofing Platform',
    tags: ['Computer Vision', 'Voice AI', 'React', 'Node.js', 'Express', 'MediaPipe', 'WebRTC'],
    desc: 'A multimodal biometric security platform combining dynamic hand gesture recognition, voice-liveness frequency analysis, anti-spoofing verification, and real-time emergency SOS intelligence.',
    problemSolved: 'Eliminates static credential vulnerability through real-time dual-biometric verification that prevents deepfakes, replay spoofing, and unauthorized access.',
    targetAudience: 'Enterprise security teams, high-assurance apps & sensitive authentication portals',
    capabilities: [
      'Dynamic hand gesture tracking & liveness recognition',
      'Voice-frequency acoustic spectrum liveness analysis',
      'Real-time spoof prevention & deepfake defense',
      'Automated emergency SOS intelligence dispatch',
    ],
    award: '1st Place · National · 70+ Teams',
    link: 'https://github.com/FaizanKhan2910/NEXUS_AUTHENTICATION',
    live: 'https://code-jss.vercel.app',
    image: '/images/projects/nexus_auth.jpg',
    year: '2026',
    accent: '#E5A97B',
    metrics: 'Dual-Biometric Verification · SOS AI',
    results: [
      { label: 'Hackathon Competing Teams', value: '70+' },
      { label: 'Verification Sprint', value: '24h Build' },
      { label: 'Biometric Modalities', value: 'Gesture + Voice' },
    ],
  },
  {
    num: '05',
    name: 'AI Code Analyser',
    sub: 'AST Debugger & Complexity Engine',
    category: 'Developer Tools & AI',
    headline: 'AST-Based Algorithmic Complexity Analysis & AI Debugger',
    tags: ['React 19', 'FastAPI', 'Gemini AI', 'AST Analysis', 'Python', 'Tailwind CSS'],
    desc: 'A high-performance developer analysis platform that parses Abstract Syntax Trees (AST) to visualize algorithmic time/space complexity in real-time, diagnose performance bottlenecks, and generate AI-assisted documentation.',
    problemSolved: 'Pinpoints algorithmic inefficiencies and logic bottlenecks before deployment by combining static AST structural parsing with generative AI recommendations.',
    targetAudience: 'Software engineers, competitive programmers & computer science researchers',
    capabilities: [
      'Abstract Syntax Tree (AST) static code parsing',
      'Real-time Big-O time and space complexity graphs',
      'Gemini AI-assisted logic debugging & refactoring tips',
      'Multi-language syntax evaluation (Python, JS, C++, Java)',
    ],
    award: '1st Place · CODEFORGE 2K25',
    link: 'https://github.com/FaizanKhan2910/AI_CODE_ANALYZER',
    live: 'https://code-jss-1.onrender.com',
    image: '/images/projects/ai_code_analyzer.jpg',
    year: '2025',
    accent: '#E5A97B',
    metrics: 'Real-Time AST · Big-O Complexity Visualizer',
    results: [
      { label: 'Hackathon Award', value: '1st Place' },
      { label: 'Analysis Engine', value: 'AST + Gemini' },
      { label: 'Evaluation Speed', value: '<1s Static AST' },
    ],
  },
]

function hostnameOf(url) {
  if (!url) return 'github.com/FaizanKhan2910'
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function TimelineItem({ project, index, isMobile, isActive }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const itemRef = useRef(null)

  const isLeft = index % 2 === 0 // 0, 2, 4 on Left, 1, 3 on Right

  useEffect(() => {
    const el = itemRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const initialTransform = isMobile
    ? 'translate3d(0, 28px, 0)'
    : isLeft
    ? 'translate3d(-35px, 0, 0)'
    : 'translate3d(35px, 0, 0)'

  const currentTransform = isVisible
    ? isHovered
      ? 'translate3d(0, -4px, 0)'
      : 'translate3d(0, 0, 0)'
    : initialTransform

  return (
    <div
      ref={itemRef}
      className="timeline-item-row"
      data-index={index}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : isLeft ? 'flex-start' : 'flex-end',
        padding: isMobile ? '28px 0 28px 60px' : '52px 0',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Central Glowing Circular Gold Node ──────────────────────────────── */}
      <div
        className="timeline-node-anchor"
        style={{
          position: 'absolute',
          left: isMobile ? '28px' : '50%',
          top: isMobile ? '38px' : '50%',
          transform: 'translate(-50%, -50%)',
          width: isActive ? (isMobile ? '18px' : '22px') : '14px',
          height: isActive ? (isMobile ? '18px' : '22px') : '14px',
          borderRadius: '50%',
          background: isActive ? '#E5A97B' : '#0B0B0C',
          border: isActive
            ? '3px solid #000000'
            : '2px solid rgba(229, 169, 123, 0.5)',
          boxShadow: isActive
            ? '0 0 16px #E5A97B, 0 0 32px rgba(229, 169, 123, 0.95), 0 0 50px rgba(229, 169, 123, 0.45)'
            : '0 0 8px rgba(229, 169, 123, 0.2)',
          zIndex: 10,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: isActive ? '3px' : '2px',
            borderRadius: '50%',
            background: isActive ? '#FFFFFF' : 'rgba(229, 169, 123, 0.4)',
            boxShadow: isActive ? '0 0 8px #FFFFFF' : 'none',
            transition: 'all 0.4s ease',
          }}
        />
      </div>

      {/* ── Hairline Connector (Node to Card) ──────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: isMobile ? '38px' : '50%',
          transform: 'translateY(-50%)',
          height: '1px',
          zIndex: 5,
          pointerEvents: 'none',
          ...(isMobile
            ? {
                left: '28px',
                width: '32px',
                background: 'linear-gradient(90deg, #E5A97B, rgba(229, 169, 123, 0.2))',
              }
            : isLeft
            ? {
                right: 'calc(50% + 8px)',
                width: '42px',
                background: 'linear-gradient(270deg, #E5A97B, rgba(229, 169, 123, 0.2))',
              }
            : {
                left: 'calc(50% + 8px)',
                width: '42px',
                background: 'linear-gradient(90deg, #E5A97B, rgba(229, 169, 123, 0.2))',
              }),
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.45s ease',
        }}
      />

      {/* ── Project Card Container ─────────────────────────────────────────── */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: isMobile ? '100%' : 'calc(50% - 50px)',
          maxWidth: '540px',
          borderRadius: '16px',
          background: '#0B0B0D',
          border: isHovered
            ? '1px solid rgba(229, 169, 123, 0.65)'
            : '1px solid rgba(229, 169, 123, 0.22)',
          boxShadow: isHovered
            ? '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 32px rgba(229, 169, 123, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
            : '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 18px rgba(229, 169, 123, 0.05)',
          padding: isMobile ? '18px 16px' : '24px 26px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          opacity: isVisible ? 1 : 0,
          transform: currentTransform,
          willChange: 'transform, opacity',
          transition:
            'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
          zIndex: 8,
        }}
      >
        {/* Subtle top metallic light sheen */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 30%, rgba(229, 169, 123, 0.8) 50%, transparent)',
            opacity: isHovered ? 1 : 0.4,
          }}
        />

        {/* Card Top Window Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            marginBottom: '12px',
            borderBottom: '1px solid rgba(229, 169, 123, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FF5F57' }} />
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FEBC2E' }} />
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28C840' }} />
            <span
              style={{
                marginLeft: '8px',
                fontFamily: 'var(--font-space)',
                fontSize: '10.5px',
                letterSpacing: '0.8px',
                color: '#7A7572',
              }}
            >
              {hostnameOf(project.live)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {project.award && (
              <span
                style={{
                  fontFamily: 'var(--font-space)',
                  fontSize: '9px',
                  letterSpacing: '0.8px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: 'rgba(229, 169, 123, 0.12)',
                  color: '#E5A97B',
                  border: '1px solid rgba(229, 169, 123, 0.28)',
                }}
              >
                🏆 {project.award}
              </span>
            )}
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '10.5px',
                color: '#7A7572',
              }}
            >
              {project.year}
            </span>
          </div>
        </div>

        {/* Project Title & Subtitle */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '12px',
                fontWeight: 700,
                color: '#E5A97B',
                letterSpacing: '1px',
              }}
            >
              {project.num}.
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: 700,
                letterSpacing: '-1px',
                lineHeight: 1.1,
                margin: 0,
                background: 'linear-gradient(135deg, #F0ECE3 35%, #E5A97B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.name}
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '11.5px',
                color: '#9A9592',
              }}
            >
              {project.sub}
            </span>
          </div>
        </div>

        {/* ── Individual High-Res Project Thumbnail (16:9, Cover, Hover Zoom) ── */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#121216',
            border: '1px solid rgba(229, 169, 123, 0.22)',
            marginBottom: '14px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.name} - ${project.sub}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Subtle bottom gradient shadow */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(11, 11, 13, 0.8) 0%, rgba(11, 11, 13, 0.1) 40%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Metric Badge Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              right: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: isMobile ? '8.5px' : '9.5px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#E5A97B',
                background: 'rgba(10, 10, 12, 0.85)',
                border: '1px solid rgba(229, 169, 123, 0.35)',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              {project.metrics}
            </span>
          </div>
        </div>

        {/* Project Description */}
        <p
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: isMobile ? '12px' : '13px',
            lineHeight: 1.6,
            color: '#9A9592',
            marginBottom: '14px',
          }}
        >
          {project.desc}
        </p>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: '9.5px',
                letterSpacing: '0.6px',
                padding: '2.5px 7px',
                borderRadius: '4px',
                background: 'rgba(229, 169, 123, 0.08)',
                border: '1px solid rgba(229, 169, 123, 0.18)',
                color: '#D8D4D0',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #E5A97B 0%, #C9A96E 100%)',
                color: '#0A0A0C',
                fontFamily: 'var(--font-space)',
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(229, 169, 123, 0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 169, 123, 0.55)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(229, 169, 123, 0.35)'
              }}
            >
              Explore Project ↗
            </a>
          )}

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '9px 14px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(229, 169, 123, 0.35)',
              color: '#F0ECE3',
              fontFamily: 'var(--font-space)',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E5A97B'
              e.currentTarget.style.background = 'rgba(229, 169, 123, 0.15)'
              e.currentTarget.style.color = '#E5A97B'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229, 169, 123, 0.35)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.color = '#F0ECE3'
            }}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* ── Opposite-Side Organic Particle Cloud ─────────────────────────────── */}
      <ProjectCloud
        project={project}
        isActive={isActive}
        isLeft={isLeft}
        isMobile={isMobile}
      />
    </div>
  )
}

export default function Work() {
  const isMobile = useIsMobile()
  const sectionRef = useRef(null)
  const timelineTrackRef = useRef(null)
  const progressLineRef = useRef(null)
  const canvasRef = useRef(null)
  const [activeNodeIdx, setActiveNodeIdx] = useState(0)
  const nodeYPositionsRef = useRef([])

  // Lightweight scroll observer: updates active node and glowing laser beam
  useEffect(() => {
    let ticking = false

    const updateScrollMetrics = () => {
      const section = sectionRef.current
      const progressLine = progressLineRef.current
      if (!section || !progressLine) {
        ticking = false
        return
      }

      const rect = section.getBoundingClientRect()
      const windowH = window.innerHeight

      // 1. Progress line scaleY (locked 60/120fps)
      const startTrigger = windowH * 0.7
      const totalDist = rect.height - windowH * 0.3
      const currentDist = startTrigger - rect.top
      const prog = Math.min(Math.max(currentDist / totalDist, 0), 1)
      progressLine.style.transform = isMobile
        ? `scaleY(${prog})`
        : `translateX(-50%) scaleY(${prog})`

      // 2. Track which node is currently active near center of viewport
      const rows = section.querySelectorAll('.timeline-item-row')
      const midY = windowH * 0.48
      let closestIdx = 0
      let minDiff = Infinity

      const newPositions = []
      const containerRect = timelineTrackRef.current?.getBoundingClientRect()

      rows.forEach((row, i) => {
        const rowRect = row.getBoundingClientRect()
        const nodeCenterY = rowRect.top + (isMobile ? 38 : rowRect.height * 0.5)
        const diff = Math.abs(nodeCenterY - midY)
        if (diff < minDiff) {
          minDiff = diff
          closestIdx = i
        }
        if (containerRect) {
          newPositions.push(nodeCenterY - containerRect.top)
        }
      })

      nodeYPositionsRef.current = newPositions
      setActiveNodeIdx(closestIdx)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollMetrics)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateScrollMetrics()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isMobile])

  // 3D Revolving Particle Stream Canvas along the central timeline
  useEffect(() => {
    const canvas = canvasRef.current
    const track = timelineTrackRef.current
    if (!canvas || !track) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth || (isMobile ? 80 : 150))
    let height = (canvas.height = track.offsetHeight || 2600)

    const handleResize = () => {
      if (!canvas || !track) return
      width = canvas.width = canvas.offsetWidth || (isMobile ? 80 : 150)
      height = canvas.height = track.offsetHeight || 2600
    }
    window.addEventListener('resize', handleResize)

    const COUNT = isMobile ? 65 : 130
    const particles = []

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        y: Math.random() * (height || 2600),
        speedY: (0.4 + Math.random() * 1.1) * (i % 3 === 0 ? -0.8 : 1),
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (1.8 + Math.random() * 3.4) * (i % 2 === 0 ? 1 : -1),
        radius: (isMobile ? 5 : 7) + Math.random() * (isMobile ? 14 : 24),
        baseSize: 1.2 + Math.random() * 2.4,
        baseAlpha: 0.35 + Math.random() * 0.65,
        isCore: Math.random() > 0.55,
      })
    }

    let lastTime = performance.now()
    let animId = 0

    const render = (now) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05)
      lastTime = now
      ctx.clearRect(0, 0, width, height)

      const centerX = width * 0.5

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.angle += p.angularSpeed * dt
        p.y += p.speedY * 55 * dt

        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const sinA = Math.sin(p.angle)
        const cosA = Math.cos(p.angle)

        const px = centerX + cosA * p.radius
        const py = p.y

        const depth01 = (sinA + 1) * 0.5
        const renderSize = p.baseSize * (0.6 + 0.65 * depth01)
        const renderAlpha = p.baseAlpha * (0.28 + 0.72 * depth01)

        ctx.save()
        if (p.isCore) {
          ctx.fillStyle = `rgba(255, 245, 220, ${renderAlpha})`
          ctx.shadowColor = 'rgba(255, 230, 160, 0.95)'
        } else {
          ctx.fillStyle = `rgba(229, 169, 123, ${renderAlpha})`
          ctx.shadowColor = 'rgba(229, 169, 123, 0.85)'
        }
        ctx.shadowBlur = renderSize * 3.5
        ctx.beginPath()
        ctx.arc(px, py, Math.max(0.8, renderSize), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Orbital Spark Ring around active node
      const nodePositions = nodeYPositionsRef.current
      const activeY =
        nodePositions[activeNodeIdx] !== undefined
          ? nodePositions[activeNodeIdx]
          : height * 0.2
      const ringCount = isMobile ? 16 : 26
      const timeSec = now * 0.001

      ctx.save()
      for (let j = 0; j < ringCount; j++) {
        const theta = (j / ringCount) * Math.PI * 2 + timeSec * 2.6
        const rRing = (isMobile ? 12 : 20) + Math.sin(j * 1.5 + timeSec * 3) * 2.5
        const rx = centerX + Math.cos(theta) * rRing
        const ry = activeY + Math.sin(theta) * (rRing * 0.42)
        const depthR = (Math.sin(theta) + 1) * 0.5

        ctx.fillStyle =
          depthR > 0.5 ? 'rgba(255, 248, 230, 0.95)' : 'rgba(229, 169, 123, 0.55)'
        ctx.shadowColor = 'rgba(229, 169, 123, 0.9)'
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(rx, ry, depthR > 0.5 ? 2.2 : 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [isMobile, activeNodeIdx])

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#000000',
        color: '#F0ECE3',
        padding: isMobile ? '80px 20px 100px' : '120px 48px 140px',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Ambience & Radial Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(229, 169, 123, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(229, 169, 123, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229, 169, 123, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Section Header Typography ────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1200px',
          margin: '0 auto 60px',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#E5A97B',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Selected Builds // 02
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            color: '#F0ECE3',
            margin: '0 0 16px 0',
          }}
        >
          Things I&apos;ve{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #E5A97B 20%, #F0ECE3 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Built.
          </span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-space)',
            fontSize: '14px',
            color: '#9A9592',
            maxWidth: '540px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          A continuous timeline of production platforms, hackathon-winning architectures, and AI pipelines.
        </p>
      </div>

      {/* ── Timeline Track & Alternating Projects Container ──────────────────── */}
      <div
        ref={timelineTrackRef}
        style={{
          position: 'relative',
          maxWidth: '1240px',
          margin: '0 auto',
          zIndex: 5,
        }}
      >
        {/* Base Track Line */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: isMobile ? '28px' : '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            background: 'rgba(229, 169, 123, 0.18)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Luminous Glowing Gold Progress Laser Beam (GPU scaleY driven) */}
        <div
          ref={progressLineRef}
          aria-hidden
          style={{
            position: 'absolute',
            left: isMobile ? '28px' : '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            transform: isMobile ? 'scaleY(0)' : 'translateX(-50%) scaleY(0)',
            transformOrigin: 'top',
            background: 'linear-gradient(180deg, #E5A97B 0%, #C9A96E 100%)',
            boxShadow:
              '0 0 14px rgba(229, 169, 123, 0.9), 0 0 28px rgba(229, 169, 123, 0.5)',
            zIndex: 2,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />

        {/* ── 3D Revolving Particle Stream Canvas (Overlaying the glowing line) ── */}
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{
            position: 'absolute',
            left: isMobile ? '28px' : '50%',
            top: 0,
            bottom: 0,
            width: isMobile ? '80px' : '150px',
            height: '100%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* List of Alternating Projects with Opposite-Side Clouds */}
        <div style={{ position: 'relative', zIndex: 6 }}>
          {FIVE_PROJECTS.map((project, idx) => (
            <TimelineItem
              key={project.name}
              project={project}
              index={idx}
              isMobile={isMobile}
              isActive={idx === activeNodeIdx}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
