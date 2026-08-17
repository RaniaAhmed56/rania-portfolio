import { useEffect, useRef } from 'react'
import { useViewportSize } from '../hooks/useViewportSize'

/**
 * A soft, warm radial glow that trails the mouse cursor with gentle lerp
 * easing. Purely decorative and pointer-events: none. Entirely inert on
 * mobile/tablet — no listeners attached, nothing rendered.
 */
export default function CursorGlow() {
  const { isMobile, isTablet } = useViewportSize()
  const elRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(false)

  const active = !isMobile && !isTablet

  useEffect(() => {
    if (!active) return
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      currentRef.current.x = currentRef.current.x || e.clientX
      currentRef.current.y = currentRef.current.y || e.clientY
      if (!visibleRef.current && elRef.current) {
        visibleRef.current = true
        elRef.current.style.opacity = '1'
      }
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15
      if (elRef.current) {
        elRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  if (!active) return null

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--glow-md), transparent 70%)',
        filter: 'blur(2px)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        willChange: 'transform',
      }}
    />
  )
}
