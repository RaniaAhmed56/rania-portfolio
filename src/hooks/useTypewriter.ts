import { useEffect, useRef, useState } from 'react'
import { playTypeSound } from '../lib/uiSound'

export interface UseTypewriterOptions {
  /** Milliseconds between each revealed character. Default 34 (~28-40ms range). */
  speed?: number
  /** Milliseconds to wait before the animation begins. Default 0. */
  startDelay?: number
  /** When false, the animation is paused/held and nothing is revealed. Default true. */
  enabled?: boolean
}

export interface UseTypewriterResult {
  /** The progressively-revealed substring of `text`. */
  displayText: string
  /** True once the full `text` has been revealed. */
  done: boolean
}

/**
 * ChatGPT-style typewriter effect: reveals `text` one character at a time.
 * Cleans up all timers on unmount, when `text` changes, or when `enabled`
 * flips off mid-animation.
 */
export function useTypewriter(text: string, opts: UseTypewriterOptions = {}): UseTypewriterResult {
  const { speed = 34, startDelay = 0, enabled = true } = opts
  const [displayText, setDisplayText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) return

    setDisplayText('')
    setDone(false)

    let cancelled = false
    let intervalId: ReturnType<typeof setInterval> | undefined
    let index = 0

    const startTimeout = setTimeout(() => {
      if (cancelled) return
      intervalId = setInterval(() => {
        index += 1
        const ch = text[index - 1]
        // Soft key-tick per revealed character (skipped for whitespace, like a
        // real typing sound where spaces are near-silent).
        if (ch && !/\s/.test(ch)) playTypeSound()
        setDisplayText(text.slice(0, index))
        if (index >= text.length) {
          setDone(true)
          if (intervalId) clearInterval(intervalId)
        }
      }, Math.max(1, speed))
    }, Math.max(0, startDelay))

    return () => {
      cancelled = true
      clearTimeout(startTimeout)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speed, startDelay, enabled])

  return { displayText, done }
}
