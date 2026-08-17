import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useViewportSize } from '../hooks/useViewportSize'
import MagneticButton from '../components/MagneticButton'
import ScrambleText from '../components/ScrambleText'

interface Props {
  onStart: () => void
  animClass: string
}

export default function Intro({ onStart, animClass }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [showContent, setShowContent] = useState(false)
  const [scrambleName, setScrambleName] = useState(false)
  const { isMobile } = useViewportSize()
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Name heading uses `title-reveal` (0.4s delay + 1.2s duration), so let
  // that entrance settle before the scramble/decode reveal kicks in.
  useEffect(() => {
    if (!showContent) return
    const timer = setTimeout(() => setScrambleName(true), 300)
    return () => clearTimeout(timer)
  }, [showContent])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.05
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.05
      setMouse({ x: currentRef.current.x, y: currentRef.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className={animClass}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* MAIN TITLE */}
      {showContent && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
          padding: isMobile ? '0 20px' : 0,
          boxSizing: 'border-box',
          maxWidth: '100vw',
          transform: `translate(${mouse.x * -6}px, ${mouse.y * -4}px)`,
          transition: 'transform 0.15s ease-out',
        }}>
          {/* Label line */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: isMobile ? '0.2em' : '0.3em',
            color: 'var(--accent2)',
            marginBottom: isMobile ? 18 : 24,
            animation: 'sub-reveal 0.8s 0.2s both',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 8 : 12,
            maxWidth: '100%',
          }}>
            <span style={{
              display: 'inline-block',
              width: isMobile ? 20 : 32,
              flexShrink: 0,
              height: 1,
              background: 'var(--accent2)',
            }} />
            <span style={{ whiteSpace: 'nowrap' }}>DIGITAL PORTFOLIO</span>
            <span style={{
              display: 'inline-block',
              width: isMobile ? 20 : 32,
              flexShrink: 0,
              height: 1,
              background: 'var(--accent2)',
            }} />
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: isMobile ? 'clamp(40px, 13vw, 110px)' : 'clamp(52px, 9vw, 110px)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            color: 'var(--fg)',
            lineHeight: 1,
            animation: 'title-reveal 1.2s 0.4s both',
            textAlign: 'center',
          }}>
            <ScrambleText text="RANIA" enabled={scrambleName} duration={900} /><br />
            <ScrambleText
              text="AHMED"
              enabled={scrambleName}
              duration={900}
              className="text-gradient-accent"
              style={{
                fontStyle: 'italic',
                letterSpacing: '0.04em',
                textShadow: '0 4px 24px var(--glow-md)',
              }}
            />
          </h1>

          {/* Role */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(11px, 1.6vw, 14px)',
            letterSpacing: isMobile ? '0.16em' : '0.28em',
            color: 'var(--muted)',
            marginTop: isMobile ? 16 : 22,
            animation: 'sub-reveal 0.8s 0.8s both',
            textTransform: 'uppercase',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            Full Stack Developer
          </div>

          {/* CTA */}
          <MagneticButton
            as="button"
            strength={18}
            onClick={onStart}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              border: 'none',
              borderRadius: 999,
              color: 'var(--bg4)',
              padding: isMobile ? '14px 26px' : '16px 40px',
              maxWidth: '90vw',
              boxSizing: 'border-box',
              marginTop: isMobile ? 30 : 44,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: 'sub-reveal 0.8s 1.2s both',
              boxShadow: '0 8px 24px var(--glow)',
            }}
            onMouseEnter={(e: React.MouseEvent) => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 14px 36px var(--glow-strong)'
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 8px 24px var(--glow)'
            }}
          >
            START EXPLORING
            <ArrowRight size={14} />
          </MagneticButton>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? 24 : 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            animation: 'sub-reveal 0.8s 2s both',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.3em',
              color: 'var(--muted)',
            }}>
              SCROLL TO EXPLORE
            </span>
            <span style={{
              width: 1,
              height: 24,
              background: 'linear-gradient(to bottom, var(--border-strong), transparent)',
              display: 'inline-block',
            }} />
            <span style={{
              animation: 'dot-pulse 2s 0s ease-in-out infinite',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 0 6px 2px rgba(255,255,255,0.75)',
              display: 'inline-block',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}
