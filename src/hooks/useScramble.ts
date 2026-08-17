import { useEffect, useRef, useState } from 'react'

export interface UseScrambleOptions {
  /** Total time in ms for the text to fully resolve. Default 900. */
  duration?: number
  /** Pool of characters used to render unresolved positions. */
  charPool?: string
  /** Gate that starts/restarts the animation when it flips to true. Default true. */
  enabled?: boolean
}

const DEFAULT_CHAR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

function randomChar(pool: string): string {
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Progressively "decodes" `text` from random glitching characters into the
 * final string, roughly left-to-right with a bit of per-character jitter so
 * it doesn't resolve on a perfectly straight line. Whitespace is preserved
 * as-is and never scrambled.
 */
export function useScramble(text: string, opts: UseScrambleOptions = {}): string {
  const { duration = 900, charPool = DEFAULT_CHAR_POOL, enabled = true } = opts
  const [output, setOutput] = useState(text)
  const rafRef = useRef<number>(0)
  const frameRef = useRef(0)
  const currentCharsRef = useRef<string[]>(text.split(''))

  useEffect(() => {
    if (!enabled) {
      setOutput(text)
      currentCharsRef.current = text.split('')
      return
    }

    // Per-character random offset so resolution isn't perfectly linear.
    const jitter = text.split('').map(() => Math.random() * 0.3 - 0.15)
    const start = performance.now()
    frameRef.current = 0
    currentCharsRef.current = text.split('').map(() => randomChar(charPool))

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / Math.max(1, duration))
      const eased = easeOutQuad(progress)
      frameRef.current += 1
      const reglitch = frameRef.current % 2 === 0

      const chars = currentCharsRef.current
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (char === ' ' || char === '\n' || char === '\t') {
          chars[i] = char
          continue
        }
        const threshold = Math.min(1, Math.max(0, i / Math.max(1, text.length - 1) + jitter[i]))
        if (eased >= threshold) {
          chars[i] = char
        } else if (reglitch) {
          chars[i] = randomChar(charPool)
        }
      }
      setOutput(chars.join(''))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setOutput(text)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, charPool, enabled])

  return output
}
