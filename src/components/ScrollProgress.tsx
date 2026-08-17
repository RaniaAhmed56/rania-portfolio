import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document
      const el = target instanceof Document ? document.scrollingElement : target
      if (!el) return

      const scrollable = el.scrollHeight - el.clientHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      const pct = (el.scrollTop / scrollable) * 100
      setProgress(Math.max(0, Math.min(100, pct)))
    }

    document.addEventListener('scroll', handleScroll, true)
    return () => document.removeEventListener('scroll', handleScroll, true)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 200,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  )
}
