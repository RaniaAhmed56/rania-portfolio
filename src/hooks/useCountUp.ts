import { useEffect, useRef, useState } from 'react'

export interface UseCountUpOptions {
  /** Total animation duration in ms. Default 1400. */
  duration?: number
  /** Only start counting once the returned `ref` element scrolls into view. Default true. */
  startWhenVisible?: boolean
  /** Number of decimal places to round the animated value to. Default 0. */
  decimals?: number
}

export interface UseCountUpResult<T extends HTMLElement> {
  /** Current animated value, eased from 0 to `target`. */
  value: number
  /** Attach to the element that should trigger the count-up when visible. */
  ref: React.RefObject<T | null>
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Animates a number from 0 up to `target` with an ease-out curve. When
 * `startWhenVisible` is true, the animation only begins once the element
 * bound to `ref` scrolls into the viewport (triggers once).
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  opts: UseCountUpOptions = {}
): UseCountUpResult<T> {
  const { duration = 1400, startWhenVisible = true, decimals = 0 } = opts
  const [value, setValue] = useState(0)
  const ref = useRef<T | null>(null)
  const rafRef = useRef<number>(0)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    let observer: IntersectionObserver | undefined

    const runAnimation = () => {
      if (hasStartedRef.current) return
      hasStartedRef.current = true

      const start = performance.now()
      const factor = Math.pow(10, decimals)

      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(1, elapsed / Math.max(1, duration))
        const eased = easeOutCubic(progress)
        const next = Math.round(target * eased * factor) / factor
        setValue(next)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (!startWhenVisible || !ref.current) {
      runAnimation()
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              runAnimation()
              observer?.disconnect()
            }
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(ref.current)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, startWhenVisible, decimals])

  return { value, ref }
}
