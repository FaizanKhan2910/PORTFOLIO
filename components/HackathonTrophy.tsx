'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface HackathonTrophyProps {
  isMobile?: boolean
}

export default function HackathonTrophy({ isMobile = false }: HackathonTrophyProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hasTriggeredRef = useRef(false)
  const isPlayingRef = useRef(false)

  const [winsCount, setWinsCount] = useState(0)
  const [lossesCount, setLossesCount] = useState(0)
  const [competitorsCount, setCompetitorsCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafRef = useRef<number[]>([])
  const particlesRafRef = useRef<number | null>(null)

  // Particles & physics state
  const dotsRef = useRef<any[]>([])
  const sparksRef = useRef<any[]>([])
  const ptrRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 })
  const dimsRef = useRef<{ w: number; h: number }>({ w: 420, h: 780 })

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    rafRef.current.forEach(cancelAnimationFrame)
    timersRef.current = []
    rafRef.current = []
  }, [])

  const countUp = useCallback((setter: (val: number) => void, target: number, delayMs: number) => {
    let t0: number | null = null
    const timer = setTimeout(() => {
      const step = (t: number) => {
        if (t0 === null) t0 = t
        const k = Math.min((t - t0) / 1100, 1)
        const e = 1 - Math.pow(1 - k, 3)
        setter(Math.round(target * e))
        if (k < 1) {
          rafRef.current.push(requestAnimationFrame(step))
        }
      }
      rafRef.current.push(requestAnimationFrame(step))
    }, delayMs)
    timersRef.current.push(timer)
  }, [])

  const burst = useCallback((x: number, y: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const v = Math.random() * 3.2 + 0.8
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 1.4,
        r: Math.random() * 2 + 0.8,
        l: 1,
        d: Math.random() * 0.012 + 0.008,
        w: Math.random() < 0.3,
      })
    }
  }, [])

  const playSequence = useCallback(() => {
    clearAllTimers()
    setIsPlaying(false)
    setIsBusy(true)
    setWinsCount(0)
    setLossesCount(0)
    setCompetitorsCount(0)

    // Force reflow
    if (stageRef.current) {
      void stageRef.current.offsetWidth
    }

    // Trigger animation
    setTimeout(() => {
      setIsPlaying(true)
      isPlayingRef.current = true

      const W = dimsRef.current.w
      const H = dimsRef.current.h
      const wide = W / 2

      const at = (ms: number, fn: () => void) => {
        timersRef.current.push(setTimeout(fn, ms))
      }

      // Exact choreographed particle burst timings
      at(1550, () => burst(W * 0.2, H * 0.74 - 90, 28))
      at(1650, () => burst(wide, H * 0.74 - 130, 46))
      at(1750, () => burst(W * 0.8, H * 0.74 - 90, 28))
      at(2300, () => burst(W * 0.3, 230, 22))
      at(2650, () => burst(W * 0.7, 330, 22))
      at(3000, () => burst(W * 0.3, 460, 22))
      at(3300, () => burst(wide, H - 110, 60))

      // Stats Count up
      countUp(setWinsCount, 3, 3500)
      countUp(setLossesCount, 0, 3500)
      countUp(setCompetitorsCount, 796, 3500)

      at(4800, () => {
        setIsBusy(false)
      })
    }, 20)
  }, [burst, clearAllTimers, countUp])

  // Canvas setup and particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)

    const mk = (any: boolean) => ({
      x: Math.random() * dimsRef.current.w,
      y: any ? Math.random() * dimsRef.current.h : dimsRef.current.h + 10,
      r: Math.random() * 1.9 + 0.5,
      vy: -(Math.random() * 0.28 + 0.06),
      vx: (Math.random() - 0.5) * 0.12,
      p: Math.random() * 6.28,
      s: Math.random() * 0.03 + 0.01,
      w: Math.random() < 0.2,
    })

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      dimsRef.current = { w: W, h: H }

      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const n = Math.round((W * H) / 5200)
      const newDots = []
      for (let i = 0; i < n; i++) newDots.push(mk(true))
      dotsRef.current = newDots
    }

    resize()
    window.addEventListener('resize', resize)

    const handlePointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      ptrRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handlePointerLeave = () => {
      ptrRef.current = { x: -999, y: -999 }
    }

    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerleave', handlePointerLeave)

    const frame = () => {
      const W = dimsRef.current.w
      const H = dimsRef.current.h
      ctx.clearRect(0, 0, W, H)

      const dots = dotsRef.current
      const ptr = ptrRef.current

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        d.x += d.vx + Math.sin(d.p) * 0.08
        d.y += d.vy
        d.p += d.s

        const dx = d.x - ptr.x
        const dy = d.y - ptr.y
        const q = dx * dx + dy * dy
        if (q < 9000) {
          const f = (1 - q / 9000) * 1.6
          const m = Math.sqrt(q) || 1
          d.x += (dx / m) * f
          d.y += (dy / m) * f
        }
        if (d.y < -10 || d.x < -10 || d.x > W + 10) {
          dots[i] = mk(false)
          continue
        }

        const a = 0.25 + 0.55 * Math.abs(Math.sin(d.p * 1.6))
        ctx.fillStyle = d.w ? `rgba(255,255,255,${a * 0.8})` : `rgba(246,200,100,${a})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Faint interactive link threads near pointer
      if (ptr.x > 0) {
        ctx.lineWidth = 0.6
        for (let i = 0; i < dots.length; i++) {
          const p = dots[i]
          const dx2 = p.x - ptr.x
          const dy2 = p.y - ptr.y
          if (dx2 * dx2 + dy2 * dy2 < 16000) {
            ctx.strokeStyle = 'rgba(246,200,100,0.28)'
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(ptr.x, ptr.y)
            ctx.stroke()
          }
        }
      }

      // Spark explosion particles
      const sparks = sparksRef.current
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.06
        s.vx *= 0.985
        s.l -= s.d * 2
        if (s.l <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = s.w ? `rgba(255,255,255,${s.l})` : `rgba(246,200,100,${s.l})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * s.l + 0.3, 0, Math.PI * 2)
        ctx.fill()
      }

      particlesRafRef.current = requestAnimationFrame(frame)
    }

    particlesRafRef.current = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', resize)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerleave', handlePointerLeave)
      if (particlesRafRef.current !== null) {
        cancelAnimationFrame(particlesRafRef.current)
      }
    }
  }, [])

  // Trigger on scroll intersection (once: true)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true
          playSequence()
          observer.disconnect()
        }
      },
      { threshold: 0.18 }
    )

    observer.observe(stage)
    return () => observer.disconnect()
  }, [playSequence])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 auto',
        padding: isMobile ? '10px 0 30px' : '20px 0 40px',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&display=swap');

        .hk-stage {
          --gold: #e8b94f;
          --gold-soft: #f6d98a;
          --amber: #c98f3a;
          --ink: #0c0c10;
          --paper: #f4efe6;
          --peach: #d9a07a;
          position: relative;
          width: min(100%, 420px);
          height: 780px;
          overflow: hidden;
          background: radial-gradient(120% 70% at 50% 0%, #17120a 0%, #050403 60%, #000 100%);
          isolation: isolate;
          font-family: "Chakra Petch", var(--font-space), "Segoe UI", sans-serif;
          user-select: none;
          border-radius: 16px;
          border: 1px solid rgba(232, 185, 79, 0.15);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(232, 185, 79, 0.05);
        }

        .hk-stage #fx {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .hk-stage .cone {
          position: absolute;
          top: 0;
          left: 50%;
          width: 300px;
          height: 560px;
          margin-left: -150px;
          z-index: 0;
          transform-origin: 50% 0;
          clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
          background: linear-gradient(180deg, rgba(246, 217, 138, .34), rgba(232, 185, 79, .08) 70%, transparent);
          opacity: 0;
        }

        .hk-stage .checker {
          position: absolute;
          inset: 60px 0 auto 0;
          height: 430px;
          z-index: 0;
          opacity: 0;
          background: conic-gradient(rgba(255,255,255,.05) 25%, transparent 0 50%, rgba(255,255,255,.05) 0 75%, transparent 0) 0 0/52px 52px;
          -webkit-mask: radial-gradient(60% 55% at 60% 40%, #000, transparent);
          mask: radial-gradient(60% 55% at 60% 40%, #000, transparent);
        }

        .hk-stage .glow {
          position: absolute;
          left: 50%;
          bottom: 170px;
          width: 360px;
          height: 200px;
          margin-left: -180px;
          z-index: 0;
          background: radial-gradient(closest-side, rgba(232, 185, 79, .28), transparent);
          opacity: 0;
        }

        .hk-stage #replay {
          position: absolute;
          top: 34px;
          right: 20px;
          z-index: 8;
          font: 700 13px/1 "Chakra Petch", sans-serif;
          letter-spacing: .2em;
          color: var(--gold);
          background: rgba(12, 12, 16, .75);
          border: 1.5px solid rgba(232, 185, 79, .6);
          border-radius: 999px;
          padding: 12px 22px;
          cursor: pointer;
          transition: background .2s, transform .2s, box-shadow .2s;
          display: inline-flex;
          align-items: center;
        }
        .hk-stage #replay:hover {
          background: rgba(232, 185, 79, .18);
          box-shadow: 0 0 16px rgba(232, 185, 79, 0.35);
        }
        .hk-stage #replay:active {
          transform: scale(.95);
        }
        .hk-stage #replay span {
          display: inline-block;
          margin-right: 8px;
        }
        .hk-stage.busy #replay span {
          animation: hk-spin .8s linear infinite;
        }
        @keyframes hk-spin {
          to { transform: rotate(-360deg); }
        }

        /* podium structure */
        .hk-stage .podium {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 170px;
          height: 170px;
          z-index: 2;
        }
        .hk-stage .pillar {
          position: absolute;
          bottom: 50px;
          width: 130px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hk-stage .pillar.l { left: 14px; --h: 100px; }
        .hk-stage .pillar.c { left: 50%; margin-left: -83px; width: 166px; --h: 148px; }
        .hk-stage .pillar.r { right: 14px; --h: 100px; }

        .hk-stage .box {
          width: 100%;
          height: var(--h);
          background: linear-gradient(180deg, #1a1a20, #0b0b0e);
          border: 1.5px solid rgba(232, 185, 79, .55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transform-origin: 50% 100%;
          opacity: 0;
          box-shadow: 0 0 24px rgba(232, 185, 79, .08) inset;
        }
        .hk-stage .pillar.c .box {
          border-color: var(--gold);
          box-shadow: 0 0 28px rgba(232, 185, 79, .25), 0 0 24px rgba(232, 185, 79, .08) inset;
        }
        .hk-stage .rank {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 28px;
          font-weight: 700;
          color: var(--peach);
        }
        .hk-stage .pillar.c .rank {
          font-size: 38px;
          color: #fff;
          text-shadow: 0 0 14px rgba(255, 255, 255, .7);
        }
        .hk-stage .rank i {
          font-style: normal;
          font-size: 20px;
        }
        .hk-stage .badge {
          font: 700 12px/1 "Chakra Petch", sans-serif;
          letter-spacing: .2em;
          color: var(--gold);
          border: 1.5px solid var(--gold);
          border-radius: 6px;
          padding: 7px 10px;
          background: rgba(232, 185, 79, .08);
          position: relative;
          overflow: hidden;
        }
        .hk-stage .badge::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .hk-stage .trophy {
          position: absolute;
          bottom: calc(var(--h) - 2px);
          left: 50%;
          width: 88px;
          margin-left: -44px;
          opacity: 0;
          transform-origin: 50% 100%;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, .6));
        }
        .hk-stage .pillar.c .trophy {
          width: 118px;
          margin-left: -59px;
        }
        .hk-stage .trophy svg {
          display: block;
          width: 100%;
          height: auto;
        }
        .hk-stage .base {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 62px;
          border: 1.5px solid rgba(232, 185, 79, .6);
          border-bottom: 0;
          border-radius: 34px 34px 0 0;
          background: linear-gradient(180deg, #1d1d23, #07070a);
          opacity: 0;
          transform-origin: 50% 100%;
        }

        /* floating cards */
        .hk-stage .card {
          position: absolute;
          z-index: 4;
          width: 262px;
          padding: 18px 22px 16px;
          border-radius: 20px;
          background: linear-gradient(160deg, rgba(24, 24, 30, .96), rgba(10, 10, 13, .96));
          border: 1.5px solid rgba(232, 185, 79, .55);
          box-shadow: 0 14px 36px rgba(0, 0, 0, .65), 0 0 22px rgba(232, 185, 79, .1);
          opacity: 0;
          --r: 0deg;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .hk-stage .card .tag {
          display: flex;
          align-items: center;
          gap: 10px;
          font: 700 15px/1 "Chakra Petch", sans-serif;
          letter-spacing: .14em;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .hk-stage .card h3 {
          margin: 0 0 8px;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: .02em;
          color: #fff;
          text-transform: uppercase;
        }
        .hk-stage .card p {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: var(--peach);
          letter-spacing: .04em;
        }
        .hk-stage .c1 { top: 118px; left: 22px; --r: -3deg; }
        .hk-stage .c2 { top: 248px; right: 14px; --r: 3.5deg; width: 272px; }
        .hk-stage .c3 { top: 378px; left: 20px; --r: -1.5deg; width: 258px; }

        .hk-stage .title {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 92px;
          margin: 0;
          text-align: center;
          z-index: 3;
          font-size: 27px;
          font-weight: 700;
          letter-spacing: .3em;
          color: var(--gold-soft);
          opacity: 0;
          text-shadow: 0 0 22px rgba(232, 185, 79, .55);
        }
        .hk-stage .stats {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 50px;
          margin: 0;
          text-align: center;
          z-index: 3;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .18em;
          color: #d6d3cc;
          opacity: 0;
          white-space: nowrap;
        }
        .hk-stage .stats b {
          color: var(--gold);
          font-weight: 700;
        }
        .hk-stage .stats em {
          font-style: normal;
          color: var(--gold);
          margin: 0 8px;
        }

        /* choreographed sequence */
        .hk-stage.play .cone { animation: hk-cone 1.2s .1s ease-out forwards; }
        .hk-stage.play .checker { animation: hk-fade 1.6s .2s ease forwards; }
        .hk-stage.play .glow { animation: hk-fade 1.6s 1.2s ease forwards; }
        .hk-stage.play .pillar.l .box { animation: hk-rise .7s .45s cubic-bezier(.2,.9,.3,1.1) forwards; }
        .hk-stage.play .pillar.c .box { animation: hk-rise .8s .3s cubic-bezier(.2,.9,.3,1.1) forwards; }
        .hk-stage.play .pillar.r .box { animation: hk-rise .7s .6s cubic-bezier(.2,.9,.3,1.1) forwards; }
        .hk-stage.play .base { animation: hk-rise .8s 0s cubic-bezier(.2,.9,.3,1.05) forwards; }
        .hk-stage.play .pillar.l .trophy { animation: hk-land .7s 1s cubic-bezier(.3,1.4,.5,1) forwards; }
        .hk-stage.play .pillar.c .trophy { animation: hk-land .8s .9s cubic-bezier(.3,1.4,.5,1) forwards; }
        .hk-stage.play .pillar.r .trophy { animation: hk-land .7s 1.1s cubic-bezier(.3,1.4,.5,1) forwards; }
        .hk-stage.play .badge::after { animation: hk-sheen 1.2s 2.2s ease forwards; }
        .hk-stage.play .c1 { animation: hk-drop .9s 1.5s cubic-bezier(.2,1.1,.4,1) forwards, hk-bob 5s 2.5s ease-in-out infinite alternate; }
        .hk-stage.play .c2 { animation: hk-drop .9s 1.85s cubic-bezier(.2,1.1,.4,1) forwards, hk-bob 6s 2.8s ease-in-out infinite alternate-reverse; }
        .hk-stage.play .c3 { animation: hk-drop .9s 2.2s cubic-bezier(.2,1.1,.4,1) forwards, hk-bob 5.5s 3.1s ease-in-out infinite alternate; }
        .hk-stage.play .title { animation: hk-title 1.3s 2.9s cubic-bezier(.2,.8,.2,1) forwards; }
        .hk-stage.play .stats { animation: hk-fade 1s 3.4s ease forwards; }

        @keyframes hk-cone { from { opacity: 0; transform: scaleY(.2); } to { opacity: 1; transform: scaleY(1); } }
        @keyframes hk-fade { to { opacity: 1; } }
        @keyframes hk-rise { from { opacity: 0; transform: translateY(70px) scaleY(.6); } to { opacity: 1; transform: none; } }
        @keyframes hk-land { 0% { opacity: 0; transform: translateY(-70px) scale(.5); } 100% { opacity: 1; transform: none; } }
        @keyframes hk-sheen { to { transform: translateX(120%); } }
        @keyframes hk-drop { 0% { opacity: 0; transform: translateY(-150px) rotate(calc(var(--r) * -3)) scale(.9); } 100% { opacity: 1; transform: translateY(0) rotate(var(--r)); } }
        @keyframes hk-bob { from { transform: translateY(0) rotate(var(--r)); } to { transform: translateY(-8px) rotate(calc(var(--r) * .6)); } }
        @keyframes hk-title { 0% { opacity: 0; letter-spacing: .7em; filter: blur(8px); } 100% { opacity: 1; letter-spacing: .3em; filter: none; } }

        @media (prefers-reduced-motion: reduce) {
          .hk-stage.play *, .hk-stage.play { animation-duration: .01s !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; }
        }
        @media (max-width: 380px) {
          .hk-stage .title { font-size: 22px; }
          .hk-stage .stats { font-size: 11.5px; }
          .hk-stage .card { width: 236px; }
          .hk-stage .c2 { width: 246px; }
          .hk-stage .c3 { width: 232px; }
        }
          `,
        }}
      />

      <main
        ref={stageRef}
        id="stage"
        className={`hk-stage ${isPlaying ? 'play' : ''} ${isBusy ? 'busy' : ''}`}
      >
        <canvas ref={canvasRef} id="fx" aria-hidden="true" />
        <div className="cone" />
        <div className="checker" />
        <div className="glow" />

        <button
          id="replay"
          type="button"
          onClick={playSequence}
          aria-label="Replay Hackathon Champion sequence"
        >
          <span>↺</span>REPLAY
        </button>

        {/* 1st Place Cards */}
        <article className="card c1">
          <div className="tag"><span>🏆</span>1ST PLACE</div>
          <h3>Hackatronics 2.0</h3>
          <p>53+ Teams · 24h</p>
        </article>

        <article className="card c2">
          <div className="tag"><span>🏆</span>1ST PLACE</div>
          <h3>JSS Navotthana 2.0</h3>
          <p>70+ Teams · 24h</p>
        </article>

        <article className="card c3">
          <div className="tag"><span>🏆</span>1ST PLACE</div>
          <h3>CodeForge 2K25</h3>
          <p>53 Teams · 8h</p>
        </article>

        {/* Tiered Podium */}
        <div className="podium">
          {/* Left Pillar */}
          <div className="pillar l">
            <div className="trophy">
              <svg viewBox="0 0 80 108" aria-hidden="true">
                <defs>
                  <linearGradient id="g_gold_l" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff1bd" />
                    <stop offset=".5" stopColor="#e8b94f" />
                    <stop offset="1" stopColor="#8a5a17" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 14H8c0 14 4 24 14 28M60 14h12c0 14-4 24-14 28"
                  fill="none"
                  stroke="url(#g_gold_l)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 8h40v26c0 15-9 26-20 26S20 49 20 34z"
                  fill="url(#g_gold_l)"
                />
                <path
                  d="M31 20c0 11 3 18 9 21"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".55"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect x="35" y="58" width="10" height="22" fill="url(#g_gold_l)" />
                <path d="M26 82h28l4 12H22z" fill="url(#g_gold_l)" />
                <rect x="16" y="94" width="48" height="10" rx="2" fill="#2a2a31" />
              </svg>
            </div>
            <div className="box">
              <div className="rank"><i>🌿</i>1<i>🌿</i></div>
            </div>
          </div>

          {/* Center Champion Pillar */}
          <div className="pillar c">
            <div className="trophy">
              <svg viewBox="0 0 80 108" aria-hidden="true">
                <defs>
                  <linearGradient id="g_gold_c" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff1bd" />
                    <stop offset=".5" stopColor="#e8b94f" />
                    <stop offset="1" stopColor="#8a5a17" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 14H8c0 14 4 24 14 28M60 14h12c0 14-4 24-14 28"
                  fill="none"
                  stroke="url(#g_gold_c)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 8h40v26c0 15-9 26-20 26S20 49 20 34z"
                  fill="url(#g_gold_c)"
                />
                <path
                  d="M31 20c0 11 3 18 9 21"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".55"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect x="35" y="58" width="10" height="22" fill="url(#g_gold_c)" />
                <path d="M26 82h28l4 12H22z" fill="url(#g_gold_c)" />
                <rect x="16" y="94" width="48" height="10" rx="2" fill="#2a2a31" />
              </svg>
            </div>
            <div className="box">
              <div className="badge">👑 CHAMPION</div>
              <div className="rank"><i>🌿</i>1<i>🌿</i></div>
            </div>
          </div>

          {/* Right Pillar */}
          <div className="pillar r">
            <div className="trophy">
              <svg viewBox="0 0 80 108" aria-hidden="true">
                <defs>
                  <linearGradient id="g_gold_r" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff1bd" />
                    <stop offset=".5" stopColor="#e8b94f" />
                    <stop offset="1" stopColor="#8a5a17" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 14H8c0 14 4 24 14 28M60 14h12c0 14-4 24-14 28"
                  fill="none"
                  stroke="url(#g_gold_r)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 8h40v26c0 15-9 26-20 26S20 49 20 34z"
                  fill="url(#g_gold_r)"
                />
                <path
                  d="M31 20c0 11 3 18 9 21"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".55"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect x="35" y="58" width="10" height="22" fill="url(#g_gold_r)" />
                <path d="M26 82h28l4 12H22z" fill="url(#g_gold_r)" />
                <rect x="16" y="94" width="48" height="10" rx="2" fill="#2a2a31" />
              </svg>
            </div>
            <div className="box">
              <div className="rank"><i>🌿</i>1<i>🌿</i></div>
            </div>
          </div>

          <div className="base" />
        </div>

        {/* Title & Animated Counters */}
        <h2 className="title">3× HACKATHON CHAMPION</h2>
        <p className="stats">
          <b>{winsCount}</b> WINS
          <em>•</em>
          <b>{lossesCount}</b> LOSSES
          <em>•</em>
          <span><b>{competitorsCount}</b>+ COMPETITORS</span>
        </p>
      </main>
    </div>
  )
}
