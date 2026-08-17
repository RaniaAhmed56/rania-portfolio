import { ArrowLeft, Search, Volume2, VolumeX } from 'lucide-react'
import { useViewportSize } from '../hooks/useViewportSize'
import { playButtonHover } from '../lib/uiSound'

type Scene = 'intro' | 'hub' | 'work' | 'project' | 'stack' | 'about' | 'contact'

interface Props {
  scene: Scene
  onBack: () => void
  soundOn: boolean
  onToggleSound: () => void
  onOpenPalette: () => void
}

const SCENE_LABELS: Partial<Record<Scene, string>> = {
  hub: 'CENTRAL HUB',
  work: 'PROJECTS',
  project: 'PROJECT',
  stack: 'TECH STACK',
  about: 'ABOUT',
  contact: 'CONTACT',
}

export default function FloatingNav({ scene, onBack, soundOn, onToggleSound, onOpenPalette }: Props) {
  const { isMobile } = useViewportSize()
  if (scene === 'intro') return null

  const label = SCENE_LABELS[scene]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '14px 16px' : '20px 32px',
        background: 'linear-gradient(to bottom, rgba(242,225,215,0.55) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 6 : 10,
          background: 'rgba(255,252,249,0.75)',
          border: '1px solid var(--border-md)',
          color: 'var(--accent)',
          padding: isMobile ? '8px 14px' : '9px 20px',
          borderRadius: 999,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isMobile ? 10 : 11,
          fontWeight: 600,
          letterSpacing: '0.14em',
          cursor: 'pointer',
          transition: 'all 0.2s',
          pointerEvents: 'auto',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 18px rgba(154,115,84,0.12)',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,252,249,0.95)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,252,249,0.75)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        }}
      >
        <ArrowLeft size={13} />
        {!isMobile && 'BACK'}
      </button>

      {/* Breadcrumb — hidden on phones to keep the bar from overflowing */}
      {label && !isMobile && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <span style={{ color: 'var(--accent2)' }}>RANIA AHMED</span>
          <span style={{ color: 'var(--muted)' }}>›</span>
          <span>{label}</span>
        </div>
      )}
      {label && isMobile && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.15em',
            color: 'var(--accent2)',
          }}
        >
          {label}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto', flexShrink: 0 }}>
        <button
          onClick={onOpenPalette}
          title="Command palette (/)"
          style={{
            width: isMobile ? 36 : 38,
            height: isMobile ? 36 : 38,
            borderRadius: '50%',
            background: 'rgba(255,252,249,0.75)',
            border: '1px solid var(--border-md)',
            color: 'var(--fg2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 18px rgba(154,115,84,0.12)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent2)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-md)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--fg2)'
          }}
        >
          <Search size={15} />
        </button>
        <button
          onClick={onToggleSound}
          title={soundOn ? 'Mute motion sounds' : 'Enable motion sounds'}
          style={{
            position: 'relative',
            width: isMobile ? 36 : 38,
            height: isMobile ? 36 : 38,
            borderRadius: '50%',
            background: soundOn ? 'rgba(184,121,66,0.14)' : 'rgba(255,252,249,0.75)',
            border: `1px solid ${soundOn ? 'var(--accent2)' : 'var(--border-md)'}`,
            color: soundOn ? 'var(--accent2)' : 'var(--fg2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 18px rgba(154,115,84,0.12)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent2)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = soundOn ? 'var(--accent2)' : 'var(--border-md)'
            ;(e.currentTarget as HTMLElement).style.color = soundOn ? 'var(--accent2)' : 'var(--fg2)'
          }}
        >
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          {soundOn && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 6,
                right: 6,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1.5,
                height: 7,
              }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    width: 2,
                    background: 'var(--accent2)',
                    borderRadius: 1,
                    animation: `eq-bounce ${0.7 + i * 0.15}s ${i * 0.12}s ease-in-out infinite`,
                  }}
                />
              ))}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
