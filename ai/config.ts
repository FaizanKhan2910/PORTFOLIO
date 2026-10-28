// ai/config.ts
// Configuration parameters, prompts, and UI constants for Faizan's AI assistant.

export const OWNER = "Faizan Khan"
export const ASSISTANT_NAME = "Faizan's AI"
export const ASSISTANT_TAGLINE = "Full-Stack Application Developer + AI Engineer"
export const INTRO_AUDIO_PATH = "/audio/voice/intro.mp3"

// The thought-bubble invitation hints that cycle above the floating robot
export const HINTS: string[] = [
  "Ask me about Faizan ⚡",
  "3 hackathons entered. 3 won 🏆",
  "Ask about DENTRA & SigmaGPT 🚀",
  "Explore Faizan's tech stack 💻",
  "Hiring? Discover Why Hire Me 💼",
]

// The 6 exact predefined question buttons requested by the user
export const QUICK_QUESTIONS: string[] = [
  "About Me",
  "Projects",
  "Technical Skills",
  "Hackathon Wins",
  "AI/ML Experience",
  "Why Hire Me?",
]

export const GREETING =
  "Hi! I'm Faizan's digital assistant. Faizan is a pre-final year AI & Machine Learning student, Full-Stack Application Developer + AI Engineer, and a 3-time Hackathon winner. He builds AI-powered products, full-stack applications, and innovative solutions designed to create real-world impact.\n\nAsk me anything about his projects, technical stack, or hackathon wins!"

export const LIMITS = {
  maxInputChars: 400,
  maxHistory: 8,
  maxOutputTokens: 600,
  rateLimitWindowMs: 60 * 1000,
  maxRequestsPerMinute: 20,
}

// Micro-bounce interval (every ~2.8s)
export const JUMP_INTERVAL_MS = 2800

