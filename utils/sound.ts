// Web Audio API Procedural Sound Engine
// Zero external audio files — instant, high-fidelity, low-latency, and cross-platform

class SoundEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private compressor: DynamicsCompressorNode | null = null
  private isMuted: boolean = false
  private hasUnlocked: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.unlock()
        window.removeEventListener('pointerdown', unlockAudio)
        window.removeEventListener('keydown', unlockAudio)
        window.removeEventListener('touchstart', unlockAudio)
      }
      window.addEventListener('pointerdown', unlockAudio, { passive: true })
      window.addEventListener('keydown', unlockAudio, { passive: true })
      window.addEventListener('touchstart', unlockAudio, { passive: true })
    }
  }

  private initCtx() {
    if (this.ctx) return
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioContextClass()

      // Master dynamics compressor to eliminate any harshness
      this.compressor = this.ctx.createDynamicsCompressor()
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime)
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime)
      this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime)
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime)
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime)

      // Master gain node
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime)

      this.masterGain.connect(this.compressor)
      this.compressor.connect(this.ctx.destination)
    } catch {
      // AudioContext not supported or blocked
    }
  }

  public unlock() {
    this.initCtx()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.hasUnlocked = true
      }).catch(() => {})
    } else if (this.ctx) {
      this.hasUnlocked = true
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime)
    }
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  /**
   * Crisp, delicate micro-click for buttons and links
   * Free of any low-frequency knock or thud
   */
  public playButtonClick(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return
    this.unlock()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime

    // High-precision gentle glass tick (1800Hz - 2200Hz) — pure, soft, no knock
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1900 * pitchMultiplier, now)
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.02)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + 0.025)
  }

  /**
   * Ethereal ascending crystalline pop & dissolve sound for skill chips
   */
  public playSkillPop() {
    if (this.isMuted) return
    this.unlock()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime

    // 1. Warm ascending bubble pop (420Hz -> 980Hz)
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.11)

    gain.gain.setValueAtTime(0.0, now)
    gain.gain.linearRampToValueAtTime(0.30, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + 0.15)

    // 2. Soft golden crystalline harmonic ping (1480Hz)
    const shimmer = this.ctx.createOscillator()
    const shimmerGain = this.ctx.createGain()
    shimmer.type = 'sine'
    shimmer.frequency.setValueAtTime(1480, now + 0.02)
    shimmer.frequency.exponentialRampToValueAtTime(2200, now + 0.12)

    shimmerGain.gain.setValueAtTime(0.0, now)
    shimmerGain.gain.linearRampToValueAtTime(0.12, now + 0.03)
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    shimmer.connect(shimmerGain)
    shimmerGain.connect(this.masterGain)
    shimmer.start(now + 0.02)
    shimmer.stop(now + 0.16)
  }

  /**
   * Shimmering harp-like ascending pentatonic chord sweep when Replaying/Resetting skills
   */
  public playSkillReplay() {
    if (this.isMuted) return
    this.unlock()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime
    // Warm golden pentatonic notes: D4, F#4, A4, B4, D5, F#5, A5
    const frequencies = [293.66, 369.99, 440.00, 493.88, 587.33, 739.99, 880.00]

    frequencies.forEach((freq, idx) => {
      const delay = idx * 0.038
      const noteTime = now + delay

      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.0, noteTime)
      gain.gain.linearRampToValueAtTime(0.20, noteTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45)

      osc.connect(gain)
      gain.connect(this.masterGain!)
      osc.start(noteTime)
      osc.stop(noteTime + 0.5)
    })
  }

  // Deprecated/removed starting sounds (no-op to prevent any start or scroll audio)
  public playPortraitGather() {}
  public playParticleScatter() {}
  public playSandErase() {}
}

// Singleton export
export const sound = new SoundEngine()
export default sound
