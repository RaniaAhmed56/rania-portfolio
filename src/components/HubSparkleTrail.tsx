import { useEffect, useRef, useState } from 'react'
import { useViewportSize } from '../hooks/useViewportSize'

interface Sparkle {
  id: number
  x: number
  y: number
  createdAt: number
}

// Spawn a new particle at most every SPAWN_INTERVAL_MS of continuous mouse
// movement, and never keep more than MAX_PARTICLES alive at once.
const SPAWN_INTERVAL_MS = 75
const PARTICLE_LIFETIME_MS = 1000
const MAX_PARTICLES = 20

let sparkleIdCounter = 0

/**
 * Cursor-following sparkle trail — a subtle, premium "wow" touch reserved
 * for the Hub scene only. While mounted it tracks mouse movement over its
 * container and spawns small soft glowing particles that float up and fade
 * out. It is a complete no-op on touch/mobile/tablet devices, since those
 * don't have a hover cursor to track.
 */
export default function HubSparkleTrail() {
  const { isMobile, isTablet } = useViewportSize()
  const containerRef = useRef<HTMLDivElement>(null)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const lastSpawnRef = useRef(0)

  const disabled =
    isMobile ||
    isTablet ||
    (typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (disabled) return

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) return
      lastSpawnRef.current = now

      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return

      setSparkles((prev) => {
        const next = [...prev, { id: sparkleIdCounter++, x, y, createdAt: now }]
        return next.length > MAX_PARTICLES ? next.slice(next.length - MAX_PARTICLES) : next
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [disabled])

  // Prune expired particles on a lightweight tick rather than a per-frame
  // JS position update — the actual motion/fade is driven by CSS.
  useEffect(() => {
    if (disabled) return
    const interval = window.setInterval(() => {
      const cutoff = performance.now() - PARTICLE_LIFETIME_MS
      setSparkles((prev) => (prev.length ? prev.filter((s) => s.createdAt > cutoff) : prev))
    }, 200)
    return () => window.clearInterval(interval)
  }, [disabled])

  if (disabled) return null

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(184,121,66,0.4) 60%, transparent 100%)',
            pointerEvents: 'none',
            animation: `hub-sparkle-float ${PARTICLE_LIFETIME_MS}ms ease-out forwards`,
          }}
        />
      ))}
    </div>
  )
}
