import { useCallback, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { useViewportSize } from './useViewportSize'

export interface TiltHandlers<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T | null>
  style: CSSProperties
  onMouseMove: (e: MouseEvent<T>) => void
  onMouseLeave: () => void
}

const MAX_DEG = 6
const RESTING_TRANSFORM = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
const MOVE_TRANSITION = 'transform 0.15s ease-out'
const RESET_TRANSITION = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)'

/**
 * Subtle 3D tilt-on-hover effect for card-like elements. Tracks cursor
 * position relative to the element's center and produces a gentle
 * perspective rotation (max ~6deg) plus a slight scale-up while hovering.
 * Snaps back to a neutral resting transform on mouse leave with a smoother
 * ease.
 *
 * Entirely inert on touch/mobile/tablet — no listeners are ever attached
 * there (checked via useViewportSize + a pointer:fine media query), so the
 * hook is a complete no-op and there is no layout shift or perf cost on
 * touch devices.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(): TiltHandlers<T> {
  const { isMobile, isTablet } = useViewportSize()
  const finePointer =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: fine)').matches
      : true
  const enabled = !isMobile && !isTablet && finePointer

  const ref = useRef<T | null>(null)
  const [transform, setTransform] = useState<string>(RESTING_TRANSFORM)
  const [transition, setTransition] = useState<string>(RESET_TRANSITION)

  const onMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      if (!enabled || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const dx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const dy = ((e.clientY - rect.top) / rect.height) * 2 - 1
      setTransition(MOVE_TRANSITION)
      setTransform(
        `perspective(900px) rotateX(${(-dy * MAX_DEG).toFixed(2)}deg) rotateY(${(dx * MAX_DEG).toFixed(2)}deg) scale(1.015)`
      )
    },
    [enabled]
  )

  const onMouseLeave = useCallback(() => {
    if (!enabled) return
    setTransition(RESET_TRANSITION)
    setTransform(RESTING_TRANSFORM)
  }, [enabled])

  if (!enabled) {
    return {
      ref,
      style: {},
      onMouseMove: () => {},
      onMouseLeave: () => {},
    }
  }

  return {
    ref,
    style: { transform, transition, willChange: 'transform' },
    onMouseMove,
    onMouseLeave,
  }
}
