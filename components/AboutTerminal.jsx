'use client'
import { useEffect, useRef, useState } from 'react'

const PROMPT_USER = 'visitor@fk-portfolio'
const PROMPT_PATH = '~'

const BOOT_CMDS = [
  {
    cmd: 'whoami',
    output: ['faizan-khan — full-stack developer · ai/ml builder · 3x hackathon winner'],
  },
  {
    cmd: 'cat about.md',
    output: [
      '# faizan khan',
      '',
      'Pre-final year CSE (AI & ML) student at JSSATE Bengaluru.',
      'I build production-grade apps — from AI dental diagnostics',
      '(YOLOv8 + Llama-3) to fintech dashboards handling 100+',
      'concurrent positions in real time.',
      '',
      '3x hackathon winner vs 796+ students. I ship it.',
    ],
  },
  {
    cmd: 'ls skills/',
    output: ['languages/  frontend/  backend/  databases/  devops/'],
  },
]

const HELP_LINES = [
  'available commands:',
  '  whoami              — who is faizan?',
  '  cat about.md        — read profile',
  '  ls skills/          — list stack',
  '  projects            — archived builds',
  '  contact             — comms channels',
  '  help                — this panel',
  '  clear               — wipe terminal',
]

const SKILLS_LINES = [
  'languages/  → javascript · typescript · python · java',
  'frontend/   → react 19 · next.js · tailwind · framer-motion · redux',
  'backend/    → node.js · express · fastapi · rest · websockets · jwt · bcrypt',
  'databases/  → mongodb · postgresql · supabase',
  'devops/     → docker · git · kubernetes · github-actions · render',
]

const PROJECT_LINES = [
  '01  DENTRA            — yolov8 + llama-3 dental ai · 1st place national',
  '02  SigmaGPT          — gemini image saas · stripe billing · 100+ txns/mo',
  '03  NEXUS AUTH        — multimodal biometric auth · 1st place national',
  '04  STOCK PLATFORM    — real-time fintech · sub-100ms · 100+ positions',
  '05  AI CODE ANALYZER  — gemini + fastapi · 1st place codeforge 2k25',
  '',
  "tip: type 'contact' to reach the human.",
]

const CONTACT_LINES = [
  'email     → fk6307672466@email.com',
  'linkedin  → linkedin.com/in/faizan-khan-57092832a',
  'github    → github.com/FaizanKhan2910',
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
  if (lower === 'whoami') return { lines: BOOT_CMDS[0].output }
  if (lower === 'cat about.md' || lower === 'about' || lower === 'cat about')
    return { lines: BOOT_CMDS[1].output }
  if (
    lower === 'ls skills/' ||
    lower === 'ls skills' ||
    lower === 'skills' ||
    lower === 'ls stack'
  )
    return { lines: SKILLS_LINES }
  if (lower === 'projects' || lower === 'ls projects/' || lower === 'ls projects')
    return { lines: PROJECT_LINES }
  if (lower === 'contact') return { lines: CONTACT_LINES }
  if (lower === 'ls' || lower === 'ls ~' || lower === 'pwd')
    return { lines: ['about.md  skills/  projects/  contact.txt'] }
  if (lower.startsWith('echo ')) return { lines: [cmd.slice(5)] }
  if (lower === 'date') return { lines: [new Date().toString()] }
  if (lower === 'sudo') return { lines: ['nice try, organic user. clearance denied.'] }
  if (lower === 'unit' || lower === 'fk' || lower === 'unit-fk/2610')
    return { lines: ['UNIT-FK/2610 online. temporal gap ~584 yrs. archive nominal.'] }
  return { lines: [`command not found: ${cmd} — type 'help'.`] }
}

export default function AboutTerminal() {
  const [lines, setLines] = useState([
    { type: 'system', text: 'UNIT-FK/2610 // archived personnel interface — boot sequence initiated…' },
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

  // Boot sequence — starts once terminal scrolls into view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let cancelled = false
    const run = async () => {
      if (startedRef.current) return
      startedRef.current = true
      await delay(600)
      for (const step of BOOT_CMDS) {
        if (cancelled) return
        // realistic per-char typing jitter
        for (let i = 1; i <= step.cmd.length; i++) {
          if (cancelled) return
          setTyping(step.cmd.slice(0, i))
          await delay(34 + Math.random() * 68)
        }
        await delay(320)
        if (cancelled) return
        const cmd = step.cmd
        const out = step.output
        setLines((prev) => [
          ...prev,
          { type: 'input', text: cmd },
          ...out.map((t) => ({ type: 'output', text: t })),
        ])
        setTyping('')
        await delay(420)
      }
      if (cancelled) return
      setLines((prev) => [
        ...prev,
        { type: 'system', text: "boot complete. type 'help' to explore." },
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
      { threshold: 0.3 }
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
      {/* title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          background: '#0F0F12',
          borderBottom: '1px solid #C9A96E11',
        }}
      >
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

      {/* body */}
      <div
        ref={bodyRef}
        style={{
          padding: '18px',
          height: '340px',
          overflowY: 'auto',
          fontSize: '13px',
          lineHeight: 1.7,
          color: '#C5C1BD',
        }}
      >
        {lines.map((l, i) =>
          l.type === 'input' ? (
            <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <span style={{ color: '#3fb950' }}>{PROMPT_USER}</span>
              <span style={{ color: '#7A7572' }}>:{PROMPT_PATH}$ </span>
              <span style={{ color: '#F0ECE3' }}>{l.text}</span>
            </div>
          ) : l.type === 'system' ? (
            <div key={i} style={{ color: '#C9A96E', opacity: 0.85 }}>
              {l.text}
            </div>
          ) : (
            <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#9A9592' }}>
              {l.text === '' ? '\u00A0' : l.text}
            </div>
          )
        )}

        {/* live boot-typing line */}
        {!booted && typing !== '' && (
          <div style={{ whiteSpace: 'pre' }}>
            <span style={{ color: '#3fb950' }}>{PROMPT_USER}</span>
            <span style={{ color: '#7A7572' }}>:{PROMPT_PATH}$ </span>
            <span style={{ color: '#F0ECE3' }}>{typing}</span>
            <span className="term-cursor" />
          </div>
        )}

        {/* interactive prompt */}
        {booted && (
          <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
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
          <div style={{ color: '#7A7572', fontSize: '12px', marginTop: '2px' }}>
            <span className="term-cursor" /> awaiting input…
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
