"use client"

// ai/AIAssistant.tsx
// 3D AI Robot Assistant — streaming SSE responses, always-on voice + microphone.

import React, { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import "./assistant.css"
import {
  ASSISTANT_NAME,
  ASSISTANT_TAGLINE,
  GREETING,
  HINTS,
  INTRO_AUDIO_PATH,
  JUMP_INTERVAL_MS,
  LIMITS,
  QUICK_QUESTIONS,
} from "./config"
import { speakDeep, stopSpeaking } from "./voice"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  time: string
  streaming?: boolean // true while tokens are still arriving
}

// Extend window for SpeechRecognition across browsers
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any
  }
}

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function renderInlineMarkdown(str: string): React.ReactNode {
  // Support **bold** syntax
  const parts = str.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="fkai-highlight">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function FormattedContent({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
  if (!text) return null

  // Split by double newlines into distinct paragraphs/blocks
  const blocks = text.split(/\n\s*\n/)

  return (
    <div className="fkai-formatted-content">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        const lines = trimmed.split("\n")
        // Check if all or multiple lines are bullet points or numbered items
        const isList = lines.length > 1 && lines.every((l) => /^\s*([•\-\*]|\d+[\.\)])\s+/.test(l))

        if (isList) {
          return (
            <ul key={bIdx} className="fkai-content-list">
              {lines.map((line, lIdx) => {
                const isNumbered = /^\s*\d+[\.\)]\s+/.test(line)
                const numberMatch = line.match(/^\s*(\d+)[\.\)]\s+/)
                const cleanLine = line.replace(/^\s*([•\-\*]|\d+[\.\)])\s+/, "")
                return (
                  <li key={lIdx} className="fkai-content-item">
                    {isNumbered ? (
                      <span className="fkai-number-badge">{numberMatch?.[1] || lIdx + 1}</span>
                    ) : (
                      <span className="fkai-bullet-dot">✦</span>
                    )}
                    <span>{renderInlineMarkdown(cleanLine)}</span>
                  </li>
                )
              })}
            </ul>
          )
        }

        return (
          <p key={bIdx} className="fkai-content-p">
            {lines.map((line, lIdx) => {
              const isBulletLine = /^\s*([•\-\*]|\d+[\.\)])\s+/.test(line)
              if (isBulletLine) {
                const isNumbered = /^\s*\d+[\.\)]\s+/.test(line)
                const numberMatch = line.match(/^\s*(\d+)[\.\)]\s+/)
                const cleanLine = line.replace(/^\s*([•\-\*]|\d+[\.\)])\s+/, "")
                return (
                  <span key={lIdx} className="fkai-content-item" style={{ marginTop: "4px" }}>
                    {isNumbered ? (
                      <span className="fkai-number-badge">{numberMatch?.[1] || lIdx + 1}</span>
                    ) : (
                      <span className="fkai-bullet-dot">✦</span>
                    )}
                    <span>{renderInlineMarkdown(cleanLine)}</span>
                  </span>
                )
              }
              return (
                <React.Fragment key={lIdx}>
                  {renderInlineMarkdown(line)}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              )
            })}
          </p>
        )
      })}
      {isStreaming && <span className="fkai-cursor">▍</span>}
    </div>
  )
}

// 3D Robot Avatar Component
export function RobotAvatar({
  size = 64,
  isSmiling = false,
  isJumping = false,
  className = "",
}: {
  size?: number
  isSmiling?: boolean
  isJumping?: boolean
  className?: string
}) {
  return (
    <div
      className={`fkai-robot-3d ${isSmiling ? "smiling" : ""} ${className}`}
      style={{
        width: size,
        height: size,
        position: "relative",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Outer dual-glow rim ring (cyan & gold) */}
      <div className="fkai-rim-glow" />

      {/* The 3D Robot Image */}
      <img
        src="/ai/robot-avatar.png"
        alt="Faizan's 3D AI Robot Assistant"
        className="fkai-robot-img"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* High jump exhaust trail */}
      {isJumping && <div className="fkai-jet-trail" />}

      {/* Smiling / Joyful sparkles */}
      {isSmiling && (
        <div className="fkai-smile-sparkle">
          <span className="sparkle sparkle-1">✨</span>
          <span className="sparkle sparkle-2">✨</span>
        </div>
      )}
    </div>
  )
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: GREETING, time: "" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)

  // Mic state for voice typing on chat bar
  const [micActive, setMicActive] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  // Speaker / Audio Output state — permanently OFF by default, turns ON only when clicked
  const [soundEnabled, setSoundEnabled] = useState(false)
  const soundEnabledRef = useRef(false)
  soundEnabledRef.current = soundEnabled

  // Restore voice preference from localStorage if previously enabled
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fk_ai_voice_enabled")
      if (saved === "true") {
        setSoundEnabled(true)
        soundEnabledRef.current = true
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Ref to always hold the latest sendMessage (avoids circular dep in startMic)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessageRef = useRef<(text: string) => Promise<void>>(async () => {})

  // Intro audio file (/audio/voice/intro.mp3)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const introPlayedRef = useRef(false)

  // Animation states
  const [stage, setStage] = useState<"center-growing" | "docking" | "docked">("center-growing")
  const [isSmiling, setIsSmiling] = useState(false)
  const [isJumping, setIsJumping] = useState(false)

  const nextId = useRef(1)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const jumpControls = useAnimation()
  const introControls = useAnimation()

  // ── 1. INTRO ANIMATION ──
  useEffect(() => {
    let isCancelled = false

    const runIntro = async () => {
      introControls.set({
        position: "fixed",
        top: "46%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        scale: 0.2,
        opacity: 0,
        zIndex: 9999,
      })

      await introControls.start({
        scale: 1.85,
        opacity: 1,
        transition: { duration: 2.5, ease: [0.16, 1, 0.3, 1] },
      })

      if (isCancelled) return

      await new Promise((r) => setTimeout(r, 400))
      if (isCancelled) return

      setStage("docking")

      const isMobile = typeof window !== "undefined" && window.innerWidth <= 480
      const targetRight = isMobile ? 16 : 28
      const targetBottom = isMobile ? 16 : 28

      await introControls.start({
        top: `calc(100% - ${targetBottom}px - 33px)`,
        left: `calc(100% - ${targetRight}px - 33px)`,
        scale: 1.0,
        transition: {
          duration: 1.35,
          ease: [0.22, 1, 0.36, 1],
        },
      })

      if (!isCancelled) {
        setStage("docked")
      }
    }

    void runIntro()
    return () => {
      isCancelled = true
    }
  }, [introControls])

  // ── 2. HIGH JUMP ──
  const triggerHighJump = useCallback(async () => {
    if (open) return
    setIsJumping(true)
    setIsSmiling(false)

    const jumpDistance = typeof window !== "undefined" ? window.innerHeight * 0.76 : 520

    await jumpControls.start({
      scaleX: 0.86,
      scaleY: 1.18,
      y: -jumpDistance * 0.25,
      rotate: [0, 8, -8, 0],
      transition: { duration: 0.28, ease: "easeOut" },
    })

    await jumpControls.start({
      scaleX: 0.92,
      scaleY: 1.2,
      y: -jumpDistance,
      rotate: [0, -12, 360],
      transition: { duration: 0.85, ease: [0.18, 0.89, 0.32, 1] },
    })

    setIsSmiling(true)
    await jumpControls.start({
      scaleX: 1.05,
      scaleY: 0.96,
      y: -jumpDistance - 12,
      transition: { duration: 0.35, ease: "easeInOut" },
    })

    await jumpControls.start({
      scaleX: 0.9,
      scaleY: 1.16,
      y: 0,
      transition: { duration: 0.65, ease: [0.65, 0.05, 0.85, 0.35] },
    })

    setIsJumping(false)

    await jumpControls.start({
      scaleX: [1.32, 0.94, 1.06, 1],
      scaleY: [0.68, 1.12, 0.97, 1],
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    })

    setTimeout(() => {
      setIsSmiling(false)
    }, 3500)
  }, [jumpControls, open])

  // ── 3. PERIODIC HINTS & INITIAL JUMP ──
  useEffect(() => {
    if (stage !== "docked") return

    const initialJumpTimer = setTimeout(() => {
      void triggerHighJump()
    }, 6000)

    const hintTimer = setInterval(() => {
      if (open) return
      setHintIndex((prev) => (prev + 1) % HINTS.length)
      void jumpControls.start({
        y: [0, -16, 0, -6, 0],
        transition: { duration: 0.75, ease: "easeOut" },
      })
    }, JUMP_INTERVAL_MS * 3)

    return () => {
      clearTimeout(initialJumpTimer)
      clearInterval(hintTimer)
    }
  }, [stage, triggerHighJump, jumpControls, open])

  // ── 4. AUTO-SCROLL ──
  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, loading, open])

  // ── 5. ESCAPE KEY ──
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        stopSpeaking()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // ── 6. MICROPHONE — toggleable (click to turn OFF / ON) ──
  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* ignore */ }
      try { recognitionRef.current.stop() } catch { /* ignore */ }
      recognitionRef.current = null
    }
    setMicActive(false)
  }, [])

  const startMic = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setMicError("Mic not supported in this browser")
      return
    }

    stopMic()

    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setMicActive(true)
      setMicError(null)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)
    }

    recognition.onend = () => {
      setMicActive(false)
      // Auto-submit via ref to avoid circular dependency with sendMessage
      setInput((current) => {
        const trimmed = current.trim()
        if (trimmed) {
          setTimeout(() => void sendMessageRef.current(trimmed), 80)
        }
        return current
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      setMicActive(false)
      if (event.error === "not-allowed") {
        setMicError("Microphone permission denied")
      }
    }

    try {
      recognition.start()
    } catch { /* already running */ }
  }, [stopMic])

  // Mic button on chat bar: toggles voice typing
  const toggleMic = useCallback(() => {
    if (micActive) {
      stopMic()
    } else {
      setMicError(null)
      startMic()
    }
  }, [micActive, startMic, stopMic])

  // Header sound button: when clicked off, voice stops immediately and saves preference!
  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      setSoundEnabled(false)
      soundEnabledRef.current = false
      stopSpeaking() // When off voice stops immediately!
      try {
        localStorage.setItem("fk_ai_voice_enabled", "false")
      } catch {
        /* ignore */
      }
    } else {
      setSoundEnabled(true)
      soundEnabledRef.current = true
      try {
        localStorage.setItem("fk_ai_voice_enabled", "true")
      } catch {
        /* ignore */
      }
    }
  }, [soundEnabled])

  // Stop any mic or speech when chat window closes
  useEffect(() => {
    if (!open) {
      stopMic()
      stopSpeaking()
    }
  }, [open, stopMic])

  const toggleOpen = useCallback(() => {
    if (open) {
      stopSpeaking()
      setOpen(false)
    } else {
      setOpen(true)
      setIsSmiling(true)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  // ── 7. SEND MESSAGE — streaming SSE consumer ──
  const sendMessage = useCallback(
    async (rawText: string) => {
      const query = rawText.trim().slice(0, LIMITS.maxInputChars)
      if (!query || loading) return

      // Stop and restart mic so it doesn't pick up the TTS voice
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch { /* ignore */ }
      }

      const userMsg: Message = {
        id: nextId.current++,
        role: "user",
        content: query,
        time: getFormattedTime(),
      }

      const updatedHistory = [...messages, userMsg]
      setMessages(updatedHistory)
      setInput("")
      setLoading(true)

      // Insert an empty streaming assistant bubble immediately
      const streamId = nextId.current++
      setMessages((prev) => [
        ...prev,
        {
          id: streamId,
          role: "assistant",
          content: "",
          time: "",
          streaming: true,
        },
      ])
      setLoading(false) // typing dots replaced by live bubble

      let fullReply = ""

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedHistory
              .filter((m) => m.id !== 0)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        // Stream loop — consume SSE chunks and update the live bubble
        outer: while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? "" // keep incomplete last line

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue
            const jsonStr = trimmed.slice(5).trim()
            if (jsonStr === "[DONE]") break outer

            try {
              const parsed = JSON.parse(jsonStr) as { token?: string }
              const token = parsed.token ?? ""
              if (!token) continue

              fullReply += token

              // Update the streaming bubble token-by-token
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === streamId
                    ? { ...m, content: fullReply }
                    : m
                )
              )

              // Auto-scroll as tokens arrive
              if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight
              }
            } catch { /* malformed SSE chunk — skip */ }
          }
        }
      } catch (err) {
        console.error("Streaming error:", err)
        fullReply = "I experienced a network issue. Please ask again or email Faizan at fk6307672466@email.com."
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, content: fullReply } : m
          )
        )
      }

      // Finalise bubble — mark not streaming, add timestamp
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId
            ? { ...m, content: fullReply, time: getFormattedTime(), streaming: false }
            : m
        )
      )

      // Speak response only if sound is enabled
      if (fullReply && soundEnabledRef.current) {
        speakDeep(fullReply)
      }
    },
    [messages, loading]
  )

  // Keep ref in sync with latest sendMessage on every render
  sendMessageRef.current = sendMessage

  return (
    <div className="fkai-root">
      {/* Intro Center Expansion Node */}
      {stage !== "docked" && (
        <motion.div
          animate={introControls}
          style={{
            position: "fixed",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RobotAvatar size={88} isSmiling={true} />
          {stage === "center-growing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: "16px",
                fontFamily: "var(--font-space)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "2px",
                color: "#00e5ff",
                textTransform: "uppercase",
                textShadow: "0 0 10px rgba(0, 229, 255, 0.6)",
                whiteSpace: "nowrap",
              }}
            >
              AI Assistant Initializing...
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Floating thought bubble hint */}
      <AnimatePresence mode="wait">
        {!open && stage === "docked" && (
          <motion.button
            key={hintIndex}
            type="button"
            className="fkai-hint"
            onClick={toggleOpen}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            aria-label="Invitation to chat with Faizan's AI assistant"
          >
            {isSmiling ? "Hello! 👋 I'm Faizan's AI — click me to chat! ✨" : HINTS[hintIndex]}
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp-inspired Sci-Fi Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fkai-panel"
            role="dialog"
            aria-label={`${ASSISTANT_NAME} Chat Window`}
            initial={{ opacity: 0, y: 22, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            {/* Header */}
            <header className="fkai-head">
              <RobotAvatar size={42} isSmiling={true} />
              <div className="fkai-title">
                <strong>{ASSISTANT_NAME}</strong>
                <span>
                  <i className="fkai-dot" /> {ASSISTANT_TAGLINE}
                </span>
              </div>
              <div className="fkai-actions">
                {/* Single Voice Audio Button — when off voice stops immediately! */}
                <button
                  type="button"
                  className={`fkai-speaker-btn ${soundEnabled ? "sound-on" : "sound-muted"}`}
                  title={soundEnabled ? "Voice is ON (click so voice stops)" : "Voice is OFF (click to turn ON)"}
                  aria-label={soundEnabled ? "Mute voice speech" : "Unmute voice speech"}
                  onClick={toggleSound}
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </button>

                <button
                  type="button"
                  className="fkai-icon-btn"
                  aria-label="Close assistant"
                  title="Close chat"
                  onClick={toggleOpen}
                >
                  ✕
                </button>
              </div>
            </header>

            {/* Message List */}
            <div className="fkai-list" ref={listRef} aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`fkai-row fkai-${m.role}`}>
                  <div className={`fkai-bubble ${m.streaming ? "fkai-streaming" : ""}`}>
                    <FormattedContent text={m.content} isStreaming={m.streaming} />
                    {m.time && !m.streaming && (
                      <span className="fkai-meta">
                        {m.time}
                        {m.role === "user" && <span className="fkai-ticks"> ✓✓</span>}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator — shown only briefly before first token */}
              {loading && (
                <div className="fkai-row fkai-assistant">
                  <div className="fkai-bubble fkai-typing" aria-label="Assistant is thinking">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              )}
            </div>

            {/* Predefined Quick Question Buttons */}
            <div className="fkai-chips" role="toolbar" aria-label="Predefined questions">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              className="fkai-form"
              onSubmit={(e) => {
                e.preventDefault()
                void sendMessage(input)
              }}
            >
              <input
                ref={inputRef}
                value={input}
                maxLength={LIMITS.maxInputChars}
                onChange={(e) => setInput(e.target.value)}
                placeholder={micActive ? "🎙️ Listening… speak now" : "Ask anything about Faizan..."}
                aria-label="Ask a question about Faizan Khan"
              />

              {/* Voice Typing Microphone Button on Chat Bar */}
              <button
                type="button"
                className={`fkai-input-mic-btn ${micActive ? "active" : ""}`}
                title={micActive ? "Listening (click to stop)" : "Voice typing (click to speak)"}
                aria-label={micActive ? "Stop microphone" : "Voice typing"}
                onClick={toggleMic}
              >
                {micActive ? "🎙️" : "🎤"}
              </button>

              <button
                type="submit"
                className="fkai-send-btn"
                aria-label="Send query"
                title="Send"
                disabled={loading || input.trim().length === 0}
              >
                ➤
              </button>
            </form>

            {/* Mic error banner */}
            {micError && (
              <div className="fkai-mic-error" role="alert">
                ⚠️ {micError}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot Trigger FAB */}
      {stage === "docked" && (
        <motion.button
          type="button"
          className="fkai-fab"
          aria-label={open ? "Close assistant" : "Open AI assistant"}
          title={open ? "Close chat" : "Ask Faizan's AI"}
          onClick={toggleOpen}
          animate={jumpControls}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          {open ? (
            <span className="fkai-fab-close">✕</span>
          ) : (
            <>
              <div className="fkai-radar-ring" />
              <RobotAvatar size={66} isSmiling={isSmiling} isJumping={isJumping} />
            </>
          )}
        </motion.button>
      )}
    </div>
  )
}
