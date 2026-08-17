import { useEffect, useState } from 'react'

interface Props {
  onDone?: () => void
}

const HOLD_MS = 900
const FADE_MS = 300

/**
 * Brief full-screen overlay shown once on first app mount, before the
 * Intro scene's own entrance transition plays. Purely cosmetic — does not
 * touch App.tsx's scene state machine.
 */
export default function Preloader({ onDone }: Props) {
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const holdTimer = setTimeout(() => setFading(true), HOLD_MS)
    return () => clearTimeout(holdTimer)
  }, [])

  useEffect(() => {
    if (!fading) return
    const fadeTimer = setTimeout(() => {
      setMounted(false)
      onDone?.()
    }, FADE_MS)
    return () => clearTimeout(fadeTimer)
  }, [fading, onDone])

  if (!mounted) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 6vw, 40px)',
          letterSpacing: '0.08em',
          color: 'var(--fg)',
          marginBottom: 18,
        }}
      >
        RA
      </div>
      <div
        style={{
          width: 140,
          height: 1,
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '0%',
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
            animation: 'preloader-bar-fill 800ms ease-out forwards',
          }}
        />
      </div>
    </div>
  )
}
