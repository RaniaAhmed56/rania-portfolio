import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Home, FolderKanban, Layers, User, Mail, Sparkles } from 'lucide-react'
import { useViewportSize } from '../hooks/useViewportSize'
import { playButtonTap, playChime } from '../lib/uiSound'

type Destination = 'hub' | 'work' | 'stack' | 'about' | 'contact'

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (scene: Destination) => void
}

interface DestItem {
  id: Destination
  label: string
  icon: typeof Home
}

const DESTINATIONS: DestItem[] = [
  { id: 'hub', label: 'Hub', icon: Home },
  { id: 'work', label: 'Projects', icon: FolderKanban },
  { id: 'stack', label: 'Tech Stack', icon: Layers },
  { id: 'about', label: 'About', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
]

// A small, easy-to-stumble-on delight: type "hire me" and the palette
// celebrates with a confetti burst + chime before jumping to Contact.
const EASTER_EGG_QUERIES = ['hire me', 'hire', "let's work together", 'work together']
const CONFETTI_COLORS = ['#B87942', '#9C765B', '#C99A4A', '#7FA66B', '#6B8CAE', '#F2E1D7']

export default function CommandPalette({ open, onClose, onNavigate }: Props) {
  const { isMobile } = useViewportSize()
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEasterEgg = useMemo(
    () => EASTER_EGG_QUERIES.includes(query.trim().toLowerCase()),
    [query]
  )

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.6,
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        drift: (Math.random() - 0.5) * 60,
      })),
    [celebrate]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DESTINATIONS
    return DESTINATIONS.filter(d => d.label.toLowerCase().includes(q))
  }, [query])

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  const triggerEasterEgg = () => {
    playChime()
    setCelebrate(true)
    timersRef.current.push(
      setTimeout(() => onNavigate('contact'), 850),
      setTimeout(() => setCelebrate(false), 1600)
    )
  }

  useEffect(() => {
    if (open) {
      setQuery('')
      setHighlighted(0)
      // Auto-focus on open
      const t = setTimeout(() => inputRef.current?.focus(), 10)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setHighlighted(0)
  }, [query])

  const handleSelect = (dest: Destination) => {
    playButtonTap()
    onNavigate(dest)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => (filtered.length === 0 ? 0 : (h + 1) % filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => (filtered.length === 0 ? 0 : (h - 1 + filtered.length) % filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isEasterEgg) {
        triggerEasterEgg()
        return
      }
      const item = filtered[highlighted]
      if (item) {
        playButtonTap()
        handleSelect(item.id)
      }
    }
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(42,29,23,0.35)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: isMobile ? '10vh' : '20vh',
        paddingLeft: isMobile ? 16 : 0,
        paddingRight: isMobile ? 16 : 0,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          width: isMobile ? '100%' : 520,
          maxWidth: '100%',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--panel)',
          border: '1px solid var(--border-md)',
          borderRadius: 18,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: 'var(--shadow-lift)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: isMobile ? '14px 16px' : '16px 20px',
            borderBottom: '1px solid var(--border-md)',
          }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jump to..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--fg)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: isMobile ? 13 : 14,
              letterSpacing: '0.02em',
            }}
          />
        </div>

        <div style={{ overflowY: 'auto', padding: 8 }}>
          {isEasterEgg && (
            <div
              onClick={triggerEasterEgg}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: isMobile ? '10px 12px' : '11px 14px',
                borderRadius: 12,
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(184,121,66,0.16), rgba(201,154,74,0.12))',
                color: 'var(--accent2)',
                marginBottom: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={15} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  Let&apos;s build something great — say hello!
                </span>
              </div>
              <ArrowRight size={14} />
            </div>
          )}
          {!isEasterEgg && filtered.length === 0 && (
            <div
              style={{
                padding: '18px 12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.08em',
                color: 'var(--muted)',
                textAlign: 'center',
              }}
            >
              NO MATCHES
            </div>
          )}
          {filtered.map((item, idx) => {
            const Icon = item.icon
            const active = idx === highlighted
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => handleSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: isMobile ? '10px 12px' : '11px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: active ? 'rgba(184,121,66,0.14)' : 'transparent',
                  color: active ? 'var(--accent2)' : 'var(--fg)',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={15} />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: isMobile ? 12 : 13,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <ArrowRight size={14} style={{ opacity: active ? 1 : 0.35 }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Confetti celebration for the "hire me" easter egg */}
      {celebrate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, pointerEvents: 'none', overflow: 'hidden' }}>
          {confettiPieces.map((p, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: '-5%',
                left: `${p.left}%`,
                width: 7,
                height: 10,
                background: p.color,
                borderRadius: 2,
                opacity: 0.9,
                transform: `rotate(${p.rotate}deg)`,
                animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
                // @ts-expect-error css custom prop
                '--confetti-drift': `${p.drift}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
