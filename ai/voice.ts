// ai/voice.ts
// Natural deep adult male voice — smooth, articulate, resonant, and organic.
// Excludes synthetic/broken novelty voices (e.g. Fred, Ralph, Zarvox).
// Prioritizes premium natural voices: Daniel, Rishi, Reed, Google UK English Male.

export interface VoiceProvider {
  speak(text: string, onStart?: () => void, onEnd?: () => void): void
  stop(): void
  isAvailable(): boolean
}

class NaturalDeepMaleVoiceProvider implements VoiceProvider {
  private selectedVoice: SpeechSynthesisVoice | null = null
  private voicesLoaded = false

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.initVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices()
      }
    }
  }

  private initVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const voices = window.speechSynthesis.getVoices()
    if (!voices || voices.length === 0) return

    // Blacklist of novelty / synthetic / broken robotic voices
    const excludedVoiceNames = [
      "fred",
      "ralph",
      "bad news",
      "bells",
      "boing",
      "bubbles",
      "cellos",
      "good news",
      "jester",
      "organ",
      "superstar",
      "trinoids",
      "whisper",
      "zarvox",
      "albert",
      "wobble",
    ]

    // Ranked priority of the most natural, human-sounding deep male voices across platforms
    const naturalMalePreferences = [
      "daniel",                 // macOS/iOS: Daniel — deep, smooth, resonant natural male
      "google uk english male", // Chrome: high-quality deep British male
      "reed",                   // macOS: Reed — natural adult male
      "rishi",                  // macOS/iOS: Rishi — deep natural male
      "guy",                    // Edge: Microsoft Guy Online (Natural)
      "microsoft david",        // Windows: David
      "oliver",                 // Natural UK male
      "rocko",                  // Natural male
      "george",                 // Natural male
      "english male",
    ]

    // 1. Try finding by preference list (ensuring it is not in the excluded list)
    for (const pref of naturalMalePreferences) {
      const match = voices.find((v) => {
        const lowerName = v.name.toLowerCase()
        const isExcluded = excludedVoiceNames.some((ex) => lowerName.includes(ex))
        return !isExcluded && lowerName.includes(pref) && v.lang.startsWith("en")
      })
      if (match) {
        this.selectedVoice = match
        this.voicesLoaded = true
        return
      }
    }

    // 2. Fallback: find any non-excluded English voice
    const fallback = voices.find((v) => {
      const lowerName = v.name.toLowerCase()
      const isExcluded = excludedVoiceNames.some((ex) => lowerName.includes(ex))
      return !isExcluded && v.lang.startsWith("en")
    })

    this.selectedVoice = fallback || voices[0] || null
    this.voicesLoaded = true
  }

  isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window
  }

  speak(text: string, onStart?: () => void, onEnd?: () => void): void {
    if (!this.isAvailable()) return

    // Cancel any current speech immediately
    window.speechSynthesis.cancel()

    // Clean text: strip markdown, URLs, symbols, and bullets
    let cleanText = text
      .replace(/[*_#`~[\]]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[✓✨⚡🏆🚀💻💼👋✦•⚠️]/g, "")
      .replace(/\s+/g, " ")
      .trim()

    // Phonetic tuning for Faizan:
    // Ensures speech synthesis engines pronounce the name accurately as "fay-zahn" / "fay-ZAAN" (IPA: /feɪˈzɑːn/)
    // avoiding common browser TTS mispronunciations like "Fie-zan" or "Fah-ee-zan".
    cleanText = cleanText
      .replace(/\bFaizan['’]s\b/gi, "Fay-zahn's")
      .replace(/\bFaizankhan\b/gi, "Fay-zahn Khan")
      .replace(/\bFaizan\b/gi, "Fay-zahn")

    if (!cleanText) return

    if (!this.selectedVoice && !this.voicesLoaded) {
      this.initVoices()
    }

    const utterance = new SpeechSynthesisUtterance(cleanText)
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice
    }

    // === NATURAL DEEP MALE TUNING ===
    // Pitch: 0.88 gives a mature, deep, resonant chest tone without the digital crackling / robotic distortion of <0.6
    utterance.pitch = 0.88
    // Rate: 0.98 is confident, articulate, natural human cadence (no dragging or stuttering)
    utterance.rate = 0.98
    // Volume: full clarity
    utterance.volume = 1.0

    utterance.onstart = () => {
      onStart?.()
    }

    utterance.onend = () => {
      onEnd?.()
    }

    utterance.onerror = (e) => {
      // Ignore interruption errors (caused by user toggling mic/speaker or clicking stop)
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("Speech synthesis error:", e.error)
      }
      onEnd?.()
    }

    // Small delay ensures cancel() completes before new utterance begins (Chrome requirement)
    setTimeout(() => {
      if (this.isAvailable()) {
        window.speechSynthesis.speak(utterance)
      }
    }, 60)
  }

  stop(): void {
    if (this.isAvailable()) {
      window.speechSynthesis.cancel()
    }
  }
}

// Singleton provider instance
export const activeVoiceProvider: VoiceProvider = new NaturalDeepMaleVoiceProvider()

export function speakDeep(text: string, onStart?: () => void, onEnd?: () => void): void {
  activeVoiceProvider.speak(text, onStart, onEnd)
}

export function stopSpeaking(): void {
  activeVoiceProvider.stop()
}
