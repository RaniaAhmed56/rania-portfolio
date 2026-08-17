import { useMemo } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export default function Stars({ count = 60 }: { count?: number }) {
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 0.6,
      opacity: Math.random() * 0.5 + 0.15,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
    })), [count])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,250,244,0.7) 55%, transparent 100%)',
            boxShadow: '0 0 6px 1px rgba(255,255,255,0.55)',
            // @ts-expect-error css var
            '--star-opacity': s.opacity,
            opacity: s.opacity,
            animation: `star-twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
