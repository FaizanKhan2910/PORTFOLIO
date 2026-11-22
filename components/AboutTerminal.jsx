'use client'
import { useEffect, useRef, useState } from 'react'

const PROMPT_USER = 'visitor@fk-portfolio'
const PROMPT_PATH = '~'

// ── Complete Automated Sequence for Recruiters ─────────────────────────────
const AUTO_COMMANDS = [
  {
    cmd: 'whoami',
    output: [
      'faizan-khan — Software Engineer · AI/ML Builder · 3× National Hackathon Winner',
    ],
  },
  {
    cmd: 'cat current_role.json',
    output: [
      '{',
      '  "current_role": "Software Developer Intern @ HealthRytix",',
      '  "education": "B.E. Computer Science (AI & ML) @ JSSATE Bengaluru",',
      '  "track_record": "3× Hackathon Champion (defeated 796+ competitors)",',
      '  "status": "Available for Summer / Fall Internships & Software Roles"',
      '}',
    ],
  },
  {
    cmd: 'cat stack.txt',
    output: [
      'languages  → TypeScript · JavaScript · Python · Java · C++ · SQL',
      'frontend   → React 19 · Next.js 14 · TailwindCSS · Framer Motion · Redux',
      'backend    → Node.js · Express · FastAPI · REST · WebSockets · Microservices',
      'ai/ml      → YOLOv8 · Llama-3 · PyTorch · Gemini 2.5 API · Computer Vision',
      'databases  → MongoDB Atlas · PostgreSQL · Supabase · Redis',
      'devops     → Docker · Kubernetes · GitHub Actions · CI/CD · Render',
    ],
  },
  {
    cmd: 'projects --highlights',
    output: [
      '01  DENTRA           [🏆 1st Place National · 70+ teams] — YOLOv8 + Llama-3 Dental Diagnostics',
      '02  SigmaGPT         [Production SaaS · Stripe Billing] — AI Image Gen · 100+ txns/month',
      '03  NEXUS AUTH       [🏆 1st Place National · 70+ teams] — Multimodal Biometrics & SOS Voice AI',
      '04  STOCK PLATFORM   [High-Speed Fintech Dashboard] — Real-time P&L · Sub-100ms response',
      '05  AI CODE ANALYZER [🏆 1st Place CODEFORGE] — Gemini AI + AST static complexity analysis',
    ],
  },
  {
    cmd: 'contact --recruiter',
    output: [
      'email     → fk6307672466@email.com',
      'linkedin  → linkedin.com/in/faizan-khan-57092832a',
      'github    → github.com/FaizanKhan2910',
      'status    → Ready to interview & ship production code 🚀',
    ],
  },
]

const HELP_LINES = [
  'available interactive commands:',
  '  whoami              — who is faizan?',
  '  cat current_role.json — current internship & education',
  '  cat stack.txt       — full technical stack',
  '  projects            — all archived projects & wins',
  '  contact             — direct recruiter comms channels',
  '  clear               — wipe terminal screen',
  '  help                — show this guide',
]

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

function resolveCommand(raw) {
  const cmd = raw.trim()
  const lower = cmd.toLowerCase()
  if (!lower) return null
  if (lower === 'clear') return { clear: true }
  if (lower === 'help') return { lines: HELP_LINES }
  if (lower === 'whoami') return { lines: AUTO_COMMANDS[0].output }
  if (lower === 'cat current_role.json' || lower === 'role' || lower === 'experience' || lower === 'intern')
    return { lines: AUTO_COMMANDS[1].output }
  if (
    lower === 'cat stack.txt' ||
    lower === 'skills' ||
    lower === 'ls skills/' ||
    lower === 'ls skills' ||
    lower === 'stack'
  )
    return { lines: AUTO_COMMANDS[2].output }
  if (
    lower === 'projects' ||
    lower === 'projects --highlights' ||
    lower === 'ls projects/' ||
    lower === 'ls projects'
  )
    return { lines: AUTO_COMMANDS[3].output }
  if (lower === 'contact' || lower === 'contact --recruiter')
    return { lines: AUTO_COMMANDS[4].output }
  if (lower === 'ls' || lower === 'ls ~' || lower === 'pwd')
    return { lines: ['current_role.json  stack.txt  projects/  contact.txt'] }
  if (lower.startsWith('echo ')) return { lines: [cmd.slice(5)] }
  if (lower === 'date') return { lines: [new Date().toString()] }
  if (lower === 'sudo') return { lines: ['nice try, organic user. clearance granted. welcome recruiter!'] }
  return { lines: [`command not found: ${cmd} — type 'help' for options.`] }
}

export default function AboutTerminal() {
  const [lines, setLines] = useState([
    { type: 'system', text: 'UNIT-FK/2610 // recruiter automated terminal briefing initiated…' },
  ])
  const [typing, setTyping] = useState('')
  const [booted, setBooted] = useState(false)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const startedRef = useRef(false)
  const wrapRef = useRef(null)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll on new output
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, typing, booted])

  // Automated typing sequence for recruiters — runs once when scrolled into view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let cancelled = false

    const run = async () => {
      if (startedRef.current) return
      startedRef.current = true
      await delay(400)

      for (const step of AUTO_COMMANDS) {
        if (cancelled) return

        // Fast, realistic hacker typing speed (16-28ms per char)
        for (let i = 1; i <= step.cmd.length; i++) {
          if (cancelled) return
          setTyping(step.cmd.slice(0, i))
          await delay(20 + Math.random() * 16)
        }

        await delay(220)
        if (cancelled) return

        const cmd = step.cmd
        const out = step.output

        setLines((prev) => [
          ...prev,
          { type: 'input', text: cmd },
          ...out.map((t) => ({ type: 'output', text: t })),
        ])
        setTyping('')
        await delay(320)
      }

      if (cancelled) return
      setLines((prev) => [
        ...prev,
        { type: 'system', text: "[✓] Automated briefing complete. Terminal shell active — type 'help' or custom commands below:" },
      ])
      setBooted(true)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          obs.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)

    return () => {
      cancelled = true
      obs.disconnect()
    }
  }, [])

  const focusInput = () => {
    if (booted) inputRef.current?.focus()
  }

  const submit = (e) => {
    e.preventDefault()
    const raw = value
    if (!booted) return
    if (!raw.trim()) {
      setLines((prev) => [...prev, { type: 'input', text: '' }])
      setValue('')
      return
    }
    const res = resolveCommand(raw)
    setHistory((h) => [raw, ...h].slice(0, 50))
    setHistIdx(-1)
    if (res?.clear) {
      setLines([])
    } else {
      setLines((prev) => [
        ...prev,
        { type: 'input', text: raw },
        ...(res?.lines || []).map((t) => ({ type: 'output', text: t })),
      ])
    }
    setValue('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx <= 0) {
        setHistIdx(-1)
        setValue('')
      } else {
        const next = histIdx - 1
        setHistIdx(next)
        setValue(history[next])
      }
    }
  }

  return (
    <div
      ref={wrapRef}
      className="reveal"
      onClick={focusInput}
      style={{
        marginTop: '64px',
        border: '1px solid #C9A96E22',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#0A0A0C',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        cursor: 'text',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#0F0F12',
          borderBottom: '1px solid #C9A96E11',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28C840' }} />
          <span
            style={{
              marginLeft: '8px',
              fontSize: '11px',
              letterSpacing: '1px',
              color: '#7A7572',
            }}
          >
            faizan@unit-fk2610 — zsh
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: booted ? '#3fb950' : '#C9A96E' }} />
          <span style={{ fontSize: '10px', letterSpacing: '1px', color: booted ? '#3fb950' : '#C9A96E' }}>
            {booted ? 'SHELL ACTIVE' : 'AUTO BRIEFING...'}
          </span>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div
        ref={bodyRef}
        style={{
          padding: '18px',
          height: '380px',
          overflowY: 'auto',
          fontSize: '13px',
          lineHeight: 1.7,
          color: '#C5C1BD',
        }}
      >
        {lines.map((l, i) =>
          l.type === 'input' ? (
            <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '6px' }}>
              <span style={{ color: '#3fb950' }}>{PROMPT_USER}</span>
              <span style={{ color: '#7A7572' }}>:{PROMPT_PATH}$ </span>
              <span style={{ color: '#F0ECE3', fontWeight: 600 }}>{l.text}</span>
            </div>
          ) : l.type === 'system' ? (
            <div key={i} style={{ color: '#C9A96E', opacity: 0.9, margin: '6px 0' }}>
              {l.text}
            </div>
          ) : (
            <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#9A9592' }}>
              {l.text === '' ? '\u00A0' : l.text}
            </div>
          )
        )}

        {/* Live typing line during auto-sequence */}
        {!booted && typing !== '' && (
          <div style={{ whiteSpace: 'pre', marginTop: '6px' }}>
            <span style={{ color: '#3fb950' }}>{PROMPT_USER}</span>
            <span style={{ color: '#7A7572' }}>:{PROMPT_PATH}$ </span>
            <span style={{ color: '#F0ECE3', fontWeight: 600 }}>{typing}</span>
            <span className="term-cursor" />
          </div>
        )}

        {/* Live Interactive Prompt after auto-sequence completes */}
        {booted && (
          <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#3fb950', whiteSpace: 'pre' }}>{PROMPT_USER}</span>
            <span style={{ color: '#7A7572', whiteSpace: 'pre' }}>:{PROMPT_PATH}$&nbsp;</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="terminal input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F0ECE3',
                fontFamily: 'inherit',
                fontSize: '13px',
                caretColor: '#C9A96E',
                padding: 0,
              }}
            />
          </form>
        )}
        {booted && value === '' && (
          <div style={{ color: '#7A7572', fontSize: '12px', marginTop: '4px' }}>
            <span className="term-cursor" /> type &apos;help&apos; or press Enter to interact…
          </div>
        )}
      </div>

      <style>{`
        .term-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: #C9A96E;
          vertical-align: -2px;
          margin-left: 2px;
          animation: termBlink 1s step-end infinite;
        }
        @keyframes termBlink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
