// Lightweight, dependency-free UI sound design using the Web Audio API.
// This portfolio uses motion and interaction sounds instead of ambient music:
// typing, transitions, button taps, and small crafted cues. Every sound is
// layered from a short noise "transient" (the tactile attack) plus one or
// two soft tonal partials (the body/pitch), which is what keeps these from
// reading as flat synth beeps.

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let enabled = false

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    type WebkitWindow = typeof window & { webkitAudioContext?: typeof AudioContext }
    const Ctx = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
    masterGain = ctx.createGain()
    masterGain.gain.value = 1
    masterGain.connect(ctx.destination)
  }
  return ctx
}

export function setUiSoundEnabled(v: boolean) {
  enabled = v
  if (v) {
    const c = getCtx()
    if (c && c.state === 'suspended') c.resume().catch(() => {})
  }
}

// ---------------------------------------------------------------------------
// Low-level building blocks
// ---------------------------------------------------------------------------

/** A single filtered-noise transient — the "attack" that makes a click,
 * peck, or swish feel physical rather than purely tonal. */
function playNoiseBurst({
  duration,
  volume,
  filterType = 'bandpass',
  freq,
  freqTo,
  Q = 1,
  startOffset = 0,
  attack = 0.004,
}: {
  duration: number
  volume: number
  filterType?: BiquadFilterType
  freq: number
  freqTo?: number
  Q?: number
  startOffset?: number
  attack?: number
}) {
  const c = getCtx()
  if (!c || !masterGain) return
  const now = c.currentTime + startOffset
  const size = Math.max(1, Math.floor(c.sampleRate * duration))
  const buffer = c.createBuffer(1, size, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1

  const src = c.createBufferSource()
  src.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = filterType
  filter.Q.value = Q
  filter.frequency.setValueAtTime(freq, now)
  if (freqTo) filter.frequency.exponentialRampToValueAtTime(freqTo, now + duration)

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  src.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)
  src.start(now)
  src.stop(now + duration + 0.02)
}

/** A single soft tonal partial with its own short envelope. */
function playPartial({
  freq,
  freqTo,
  duration,
  volume,
  type = 'sine',
  startOffset = 0,
  attack = 0.008,
}: {
  freq: number
  freqTo?: number
  duration: number
  volume: number
  type?: OscillatorType
  startOffset?: number
  attack?: number
}) {
  const c = getCtx()
  if (!c || !masterGain) return
  const now = c.currentTime + startOffset
  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  if (freqTo) osc.frequency.exponentialRampToValueAtTime(freqTo, now + duration)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  osc.connect(gain)
  gain.connect(masterGain)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

// ---------------------------------------------------------------------------
// UI sounds
// ---------------------------------------------------------------------------

/** Soft key-peck for the typewriter effect — a tiny filtered click, like a
 * quiet mechanical keyboard, with a whisper of low tonal body so it doesn't
 * sound like static. Randomised slightly so a full sentence feels alive
 * rather than looped. */
export function playTypeSound() {
  if (!enabled) return
  const jitter = Math.random() * 900
  playNoiseBurst({
    duration: 0.028,
    volume: 0.05,
    filterType: 'bandpass',
    freq: 3200 + jitter,
    freqTo: 2100 + jitter * 0.4,
    Q: 2.2,
    attack: 0.002,
  })
  playPartial({
    freq: 620 + jitter * 0.15,
    freqTo: 340,
    duration: 0.045,
    volume: 0.012,
    type: 'triangle',
  })
}

/** Tactile click for buttons and toggles — a quick high "snap" transient
 * layered over a short low-frequency "thud" body, the same recipe real
 * tactile-switch and haptic click sounds use. */
export function playButtonTap() {
  if (!enabled) return
  playNoiseBurst({
    duration: 0.032,
    volume: 0.07,
    filterType: 'bandpass',
    freq: 2600,
    freqTo: 1400,
    Q: 1.6,
    attack: 0.002,
  })
  playPartial({ freq: 210, freqTo: 130, duration: 0.09, volume: 0.05, type: 'sine', attack: 0.004 })
  playPartial({ freq: 640, freqTo: 480, duration: 0.05, volume: 0.016, type: 'triangle', startOffset: 0.008 })
}

/** Light hover sound for interactive controls — a barely-there airy tick,
 * softer and higher than the tap so the two are easy to tell apart. */
export function playButtonHover() {
  if (!enabled) return
  playNoiseBurst({
    duration: 0.05,
    volume: 0.018,
    filterType: 'highpass',
    freq: 3400,
    Q: 0.7,
    attack: 0.006,
  })
  playPartial({ freq: 1180, freqTo: 1500, duration: 0.06, volume: 0.008, type: 'sine' })
}

/** Soft scene transition for room/scene changes — a filtered noise sweep
 * that falls in pitch, read as an "exit" gesture. */
export function playWhoosh() {
  if (!enabled) return
  const c = getCtx()
  if (!c || !masterGain) return
  const now = c.currentTime
  const dur = 0.48
  const size = Math.max(1, Math.floor(c.sampleRate * dur))
  const buffer = c.createBuffer(1, size, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * 0.35))

  const src = c.createBufferSource()
  src.buffer = buffer
  const bandpass = c.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.setValueAtTime(260, now)
  bandpass.frequency.exponentialRampToValueAtTime(1600, now + dur * 0.55)
  bandpass.frequency.exponentialRampToValueAtTime(380, now + dur)
  bandpass.Q.value = 0.8

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.05, now + dur * 0.18)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

  src.connect(bandpass)
  bandpass.connect(gain)
  gain.connect(masterGain)
  src.start(now)
  src.stop(now + dur + 0.02)

  // A quiet falling tonal thread underneath, so the exit reads as a
  // deliberate downward gesture rather than pure noise.
  playPartial({ freq: 520, freqTo: 200, duration: dur * 0.85, volume: 0.02, type: 'sine', attack: 0.05 })
}

/** Soft "settle-in" sound for when a new scene/page finishes appearing.
 * Distinct from `playWhoosh` (used on exit): brighter, shorter, and rises
 * rather than falls, so exit and enter read as two different gestures. */
export function playPageEnter() {
  if (!enabled) return
  const c = getCtx()
  if (!c || !masterGain) return
  const now = c.currentTime

  // Airy noise swell, filtered upward — a light "breath in" texture.
  const dur = 0.34
  const size = Math.max(1, Math.floor(c.sampleRate * dur))
  const buffer = c.createBuffer(1, size, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-Math.abs(i - size * 0.55) / (size * 0.4))

  const src = c.createBufferSource()
  src.buffer = buffer
  const bandpass = c.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.setValueAtTime(900, now)
  bandpass.frequency.exponentialRampToValueAtTime(2600, now + dur * 0.75)
  bandpass.Q.value = 0.9

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.0001, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.03, now + dur * 0.4)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

  src.connect(bandpass)
  bandpass.connect(noiseGain)
  noiseGain.connect(masterGain)
  src.start(now)
  src.stop(now + dur + 0.02)

  // Two soft sine partials, gently detuned, that bloom in just after —
  // a small harmonic "arrival" cue.
  ;[660, 990].forEach((freq, i) => {
    playPartial({
      freq: freq * 0.94,
      freqTo: freq,
      duration: 0.3,
      volume: i === 0 ? 0.022 : 0.014,
      type: 'sine',
      startOffset: 0.06 + i * 0.02,
      attack: 0.05,
    })
  })
}

/** Small celebratory chime for special actions. */
export function playChime() {
  if (!enabled) return
  const c = getCtx()
  if (!c || !masterGain) return
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    playPartial({
      freq,
      duration: 0.5,
      volume: 0.05,
      type: 'sine',
      startOffset: i * 0.08,
      attack: 0.03,
    })
  })
}
