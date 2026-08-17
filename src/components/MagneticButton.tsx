import { useRef, useCallback, type ElementType, type CSSProperties, type ReactNode } from 'react'
import { useViewportSize } from '../hooks/useViewportSize'
import { playButtonHover, playButtonTap } from '../lib/uiSound'

interface MagneticButtonProps {
  as?: ElementType
  strength?: number
  style?: CSSProperties
  className?: string
  children?: ReactNode
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onClick?: (e: React.MouseEvent) => void
  [key: string]: unknown
}

const SNAP_BACK_TRANSITION = 'transform 0.25s cubic-bezier(0.22,1,0.36,1)'

/**
 * Thin wrapper that adds a subtle "magnetic" pull toward the cursor on
 * hover. Wraps whatever element/component is passed via `as` (button, a,
 * etc.) without restyling its contents — only the wrapper's transform is
 * touched. No-ops on mobile / coarse-pointer devices.
 */
export default function MagneticButton({
  as: Component = 'button',
  strength = 18,
  style,
  className,
  children,
  onMouseEnter: onMouseEnterProp,
  onMouseMove: onMouseMoveProp,
  onMouseLeave: onMouseLeaveProp,
  onClick: onClickProp,
  ...rest
}: MagneticButtonProps) {
  const { isMobile } = useViewportSize()
  const ref = useRef<HTMLElement | null>(null)

  const isFinePointer = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    onMouseMoveProp?.(e)
    if (isMobile || !isFinePointer()) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const x = Math.max(-strength, Math.min(strength, dx * 0.35))
    const y = Math.max(-strength, Math.min(strength, dy * 0.35))
    el.style.transition = 'transform 0.1s linear'
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [isMobile, strength, onMouseMoveProp])

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    onMouseLeaveProp?.(e)
    const el = ref.current
    if (!el) return
    el.style.transition = SNAP_BACK_TRANSITION
    el.style.transform = 'translate(0px, 0px)'
  }, [onMouseLeaveProp])

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    playButtonHover()
    onMouseEnterProp?.(e)
  }, [onMouseEnterProp])

  const handleClick = useCallback((e: React.MouseEvent) => {
    playButtonTap()
    onClickProp?.(e)
  }, [onClickProp])

  return (
    <Component
      ref={ref}
      className={className}
      style={{ display: 'inline-block', ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Component>
  )
}
