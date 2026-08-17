import { useEffect, useRef, useState } from 'react'
import { CodeXml, Layers, Share2 } from 'lucide-react'
import { useViewportSize } from '../hooks/useViewportSize'
import { useCountUp } from '../hooks/useCountUp'
import Typewriter from '../components/Typewriter'
import ScrambleText from '../components/ScrambleText'

interface Props {
  animClass: string
}

const STATEMENTS = [
  { icon: CodeXml, text: 'I BUILD COMPLETE DIGITAL PRODUCTS.', sub: 'End-to-end, from architecture to deployment.' },
  { icon: Layers, text: 'FRONTEND + BACKEND.', sub: 'React interfaces. Django & Node.js APIs. All of it.' },
  { icon: Share2, text: 'I TURN COMPLEX SYSTEMS INTO SIMPLE EXPERIENCES.', sub: 'Kafka pipelines, distributed data — made human.' },
]

const FACTS = [
  { label: 'PROJECTS SHIPPED', value: '5+' },
  { label: 'TECHNOLOGIES', value: '13' },
  { label: 'YEARS BUILDING', value: '3+' },
  { label: 'ARCHITECTURE', value: 'Microservices' },
]

/** Splits a fact value like "5+" or "13" into an animatable number plus a static suffix. */
function parseFactValue(value: string): { number: number; suffix: string } | null {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return { number: parseFloat(match[1]), suffix: match[2] }
}

function AnimatedFact({ value }: { value: string }) {
  const parsed = parseFactValue(value)
  const { value: animated, ref } = useCountUp<HTMLSpanElement>(parsed?.number ?? 0, { duration: 1400 })

  if (!parsed) {
    return <span>{value}</span>
  }

  return (
    <span ref={ref}>
      {Math.round(animated)}
      {parsed.suffix}
    </span>
  )
}

export default function AboutRoom({ animClass }: Props) {
  const { isMobile, isTablet } = useViewportSize()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.04
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.04
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
      style={{ position: 'absolute', inset: 0, background: 'transparent', overflow: 'hidden' }}
    >
      {/* CONTENT overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          zIndex: 30,
          paddingTop: 90,
        }}
      >
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: `0 ${isMobile ? 20 : 48}px 80px` }}>

          {/* Header */}
          <div style={{ marginBottom: 48, animation: 'fade-up 0.6s both' }}>
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ color: 'var(--accent2)' }}>→</span>
              <span style={{ color: 'var(--accent2)' }}>PERSONAL</span>
              <span style={{ color: 'var(--muted)' }}>/</span>
              <span style={{ color: 'var(--muted)' }}>ABOUT</span>
            </div>
            <ScrambleText
              as="h2"
              text="About Rania"
              duration={900}
              className="font-display"
              style={{
                fontSize: 'clamp(40px, 6vw, 64px)',
                fontWeight: 500,
                color: 'var(--fg)',
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            />
            <div style={{ width: 50, height: 2, background: 'linear-gradient(90deg, var(--accent), var(--accent2))' }} />
          </div>

          {/* Two column layout */}
          <div
            style={{
              display: 'flex',
              gap: isTablet ? 32 : 48,
              marginBottom: 40,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: avatar */}
            <div
              style={{
                flex: isMobile ? '1 1 100%' : isTablet ? '0 0 240px' : '0 0 300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                animation: 'fade-up 0.6s 0.05s both',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: isMobile ? 180 : 230,
                  height: isMobile ? 180 : 230,
                  borderRadius: '50%',
                  border: '1px solid var(--border-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  transform: `translate(${mouse.x * 4}px, ${mouse.y * 3}px)`,
                  transition: 'transform 0.2s ease-out',
                }}
              >
                {/* sparkle glints */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 30,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--accent2)',
                    boxShadow: '0 0 8px var(--glow-strong)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 14,
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px var(--glow)',
                  }}
                />
                <div
                  className="panel-glass"
                  style={{
                    width: isMobile ? 140 : 180,
                    height: isMobile ? 140 : 180,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px var(--glow-md)',
                  }}
                >
                  <span
                    className="font-display"
                    style={{
                      fontSize: isMobile ? 64 : 84,
                      fontWeight: 600,
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    R
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: 'var(--fg2)',
                  maxWidth: 260,
                  minHeight: '4.95em',
                }}
              >
                <Typewriter
                  text="I'm a passionate Full Stack Developer who loves building clean, scalable and meaningful digital experiences."
                  startDelay={300}
                />
              </p>
            </div>

            {/* Right: statement cards */}
            <div
              style={{
                flex: isMobile ? '1 1 100%' : '1 1 420px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {STATEMENTS.map((stmt, i) => {
                const Icon = stmt.icon
                return (
                  <div
                    key={i}
                    className="panel-glass"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: isMobile ? '18px 20px' : '24px 28px',
                      borderRadius: 18,
                      animation: `fade-up 0.6s ${i * 0.1}s both`,
                    }}
                  >
                    <div
                      style={{
                        flex: '0 0 44px',
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        border: '1px solid var(--border-md)',
                        background: 'var(--bg4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} color="var(--accent2)" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div
                        className="font-display"
                        style={{
                          fontSize: isMobile ? 'clamp(14px, 4.2vw, 17px)' : 'clamp(16px, 2vw, 20px)',
                          fontWeight: 700,
                          color: 'var(--fg)',
                          letterSpacing: '0.02em',
                          marginBottom: 6,
                        }}
                      >
                        {stmt.text}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 13,
                          color: 'var(--fg2)',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {stmt.sub}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div
            className="panel-glass"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              borderRadius: 18,
              marginBottom: 32,
              animation: 'fade-up 0.6s 0.3s both',
              overflow: 'hidden',
            }}
          >
            {FACTS.map((fact, i) => (
              <div
                key={i}
                style={{
                  padding: isMobile ? '20px 14px' : '24px 16px',
                  textAlign: 'center',
                  borderLeft: isMobile ? (i % 2 === 1 ? '1px solid var(--border)' : 'none') : (i > 0 ? '1px solid var(--border)' : 'none'),
                  borderTop: isMobile && i > 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div
                  className="font-display"
                  style={{
                    fontSize: 28,
                    color: 'var(--accent2)',
                    marginBottom: 6,
                    fontStyle: fact.label === 'ARCHITECTURE' ? 'italic' : 'normal',
                  }}
                >
                  <AnimatedFact value={fact.value} />
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.15em',
                    color: 'var(--muted)',
                  }}
                >
                  {fact.label}
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy */}
          <div
            className="panel-glass"
            style={{
              padding: isMobile ? '20px 20px' : '36px 40px',
              borderRadius: 18,
              animation: 'fade-up 0.6s 0.4s both',
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'var(--accent2)',
                marginBottom: 16,
              }}
            >
              APPROACH
            </div>
            <p
              className="font-display"
              style={{
                fontSize: isMobile ? 'clamp(14px, 4vw, 17px)' : 'clamp(16px, 2vw, 22px)',
                fontWeight: 400,
                color: 'var(--fg2)',
                lineHeight: 1.65,
                fontStyle: 'italic',
              }}
            >
              "I don't just write code — I architect solutions. Every project is an opportunity to design systems that scale, APIs that feel natural, and interfaces that make complex things feel simple."
            </p>
            <div
              className="font-mono"
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid var(--border)',
                fontSize: 10,
                color: 'var(--muted)',
                letterSpacing: '0.2em',
              }}
            >
              — RANIA AHMED
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
