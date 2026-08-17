import { useEffect, useRef, useState } from 'react'
import { Monitor, Layers, User, Mail, ChevronRight } from 'lucide-react'
import { useViewportSize } from '../hooks/useViewportSize'
import HubSparkleTrail from '../components/HubSparkleTrail'
import { playButtonHover, playButtonTap } from '../lib/uiSound'

type Destination = 'work' | 'stack' | 'about' | 'contact'

interface Props {
  onNavigate: (dest: Destination) => void
  animClass: string
}

const DESTINATIONS = [
  {
    id: 'work' as Destination,
    label: 'WORK',
    sub: 'Projects & Case Studies',
    icon: <Monitor size={26} />,
    angle: 0, // top
    color: 'var(--accent2)',
    glow: 'rgba(184,121,66,0.32)',
    desc: 'Five complete digital products built from ground up',
  },
  {
    id: 'stack' as Destination,
    label: 'STACK',
    sub: 'Technology Laboratory',
    icon: <Layers size={26} />,
    angle: 90, // right
    color: 'var(--accent)',
    glow: 'rgba(156,118,91,0.32)',
    desc: '13 technologies mastered across the full spectrum',
  },
  {
    id: 'about' as Destination,
    label: 'ABOUT',
    sub: 'Personal Workspace',
    icon: <User size={26} />,
    angle: 180, // bottom
    color: '#8A6F5C',
    glow: 'rgba(138,111,92,0.32)',
    desc: 'A developer who builds complete digital products',
  },
  {
    id: 'contact' as Destination,
    label: 'CONTACT',
    sub: 'Communication Chamber',
    icon: <Mail size={26} />,
    angle: 270, // left
    color: '#B3805C',
    glow: 'rgba(179,128,92,0.32)',
    desc: 'Open for new projects and collaborations',
  },
]

// Sizes for the center hub circle and the 4 outer nodes — used to make sure
// the connecting radius always keeps a clear gap between them.
const CENTER_SIZE = 230
const NODE_SIZE = 150
const MIN_GAP = 46
const MIN_RADIUS = CENTER_SIZE / 2 + NODE_SIZE / 2 + MIN_GAP

// Small glowing sparkle points placed along the ring, skipping the angles
// already occupied by the 4 destination nodes (0/90/180/270).
const SPARKLE_ANGLES = [35, 55, 125, 145, 215, 235, 305, 325]

export default function Hub({ onNavigate, animClass }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState<Destination | null>(null)
  const [pressed, setPressed] = useState<Destination | null>(null)
  const { isMobile, isTablet } = useViewportSize()
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  })
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
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.04
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.04
      setMouse({ x: currentRef.current.x, y: currentRef.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ---------------------------------------------------------------------
  // MOBILE (< 640px) — a simple vertical stack: compact name card up top,
  // then the 4 destinations as full-width tappable rows. The radial cross
  // layout doesn't fit a phone screen, so we skip it entirely here.
  // ---------------------------------------------------------------------
  if (isMobile) {
    return (
      <div
        className={animClass}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 24px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Compact name card */}
          <div
            className="panel-glass"
            style={{
              width: '100%',
              borderRadius: 28,
              background: 'var(--glass)',
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(24px, 8vw, 30px)',
                fontWeight: 700,
                color: 'var(--fg)',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}
            >
              RANIA
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--fg2)', fontSize: '0.85em' }}>
                AHMED
              </span>
            </div>
            <div
              style={{
                width: 40,
                height: 1,
                background: 'var(--accent)',
                margin: '12px auto',
              }}
            />
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.25em',
                color: 'var(--muted)',
              }}
            >
              SELECT A DESTINATION
            </div>
          </div>

          {/* Destination rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DESTINATIONS.map((dest) => {
              const isPressed = pressed === dest.id
              return (
                <button
                  key={dest.id}
                  onClick={() => { playButtonTap(); onNavigate(dest.id) }}
                  onTouchStart={() => { setPressed(dest.id); playButtonHover() }}
                  onTouchEnd={() => setPressed(null)}
                  onTouchCancel={() => setPressed(null)}
                  onMouseDown={() => setPressed(dest.id)}
                  onMouseUp={() => setPressed(null)}
                  onMouseLeave={() => setPressed(null)}
                  className="panel-glass"
                  style={{
                    width: '100%',
                    minHeight: 64,
                    borderRadius: 18,
                    background: 'var(--glass)',
                    border: '1px solid var(--border-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 16px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transform: isPressed ? 'scale(0.97)' : 'scale(1)',
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--glass-md)',
                      border: '1px solid var(--border-md)',
                      color: 'var(--accent)',
                    }}
                  >
                    {dest.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        fontSize: 12,
                        letterSpacing: '0.18em',
                        color: 'var(--fg)',
                      }}
                    >
                      {dest.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 12,
                        color: 'var(--muted)',
                        letterSpacing: '0.02em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dest.sub}
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--accent2)" style={{ flexShrink: 0 }} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Position nodes in a cross pattern
  const getPos = (angle: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    }
  }

  const hoveredDest = DESTINATIONS.find(d => d.id === hovered)
  // Tablet portraits (640–900px) get a scaled-down version of the same
  // radial layout — smaller circles and gap so nothing clips the viewport.
  // Desktop (>= 900px) keeps the exact original sizing untouched.
  const centerSize = isTablet ? 168 : CENTER_SIZE
  const nodeSize = isTablet ? 104 : NODE_SIZE
  const minGap = isTablet ? 26 : MIN_GAP
  const minRadius = centerSize / 2 + nodeSize / 2 + minGap
  // Keep a generous, guaranteed gap between the center circle and the outer
  // nodes so they never touch/overlap, while still scaling with the viewport.
  const radius = Math.min(
    Math.max(Math.min(viewport.w, viewport.h) * 0.34, minRadius),
    isTablet ? 260 : 380
  )

  return (
    <div
      className={animClass}
      style={{ position: 'absolute', inset: 0, background: 'transparent', overflow: 'hidden' }}
    >
      {/* Faint connecting ring between the 4 outer nodes */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="2 10"
        />
      </svg>

      {/* Cursor-following sparkle trail — desktop-only, sits above the
          background but naturally behind the nodes/center panel since they
          carry explicit z-index while this stays at the default stacking
          order. Purely decorative (pointer-events: none throughout). */}
      <HubSparkleTrail />

      {/* Glowing sparkle points along the ring */}
      {SPARKLE_ANGLES.map((angle, i) => {
        const pos = getPos(angle, radius)
        return (
          <div
            key={angle}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 0,
              height: 0,
              transform: `translateX(calc(-50% + ${pos.x}px)) translateY(calc(-50% + ${pos.y}px))`,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 0 8px 2px rgba(255,255,255,0.85), 0 0 20px 5px rgba(255,255,255,0.5), 0 0 30px 8px rgba(184,121,66,0.25)',
                animation: `sparkle-twinkle ${2.4 + (i % 4) * 0.5}s ${i * 0.35}s ease-in-out infinite`,
              }}
            />
          </div>
        )
      })}

      {/* Nodes — 4 destinations in a cross layout */}
      {DESTINATIONS.map((dest) => {
        const pos = getPos(dest.angle, radius)
        const isHov = hovered === dest.id
        return (
          <div
            key={dest.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translateX(calc(-50% + ${pos.x}px)) translateY(calc(-50% + ${pos.y}px)) translateY(${isHov ? -4 : 0}px)`,
              transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              cursor: 'pointer',
              zIndex: isHov ? 10 : 1,
            }}
            onMouseEnter={() => { setHovered(dest.id); playButtonHover() }}
            onMouseLeave={() => setHovered(null)}
            onClick={() => { playButtonTap(); onNavigate(dest.id) }}
          >
            <div
              style={{
                width: nodeSize,
                height: nodeSize,
                borderRadius: '50%',
                border: `1px solid ${isHov ? 'var(--accent2)' : 'var(--border-md)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: isHov ? 'var(--glass-md)' : 'var(--glass)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transition: 'all 0.35s',
                boxShadow: isHov
                  ? `0 0 36px ${dest.glow}, var(--shadow-lift)`
                  : 'var(--shadow-soft)',
                // @ts-expect-error css var
                '--p-glow': dest.glow,
                animation: isHov ? 'none' : `portal-breathe 4s ${dest.angle / 90}s ease-in-out infinite`,
              }}
            >
              <div style={{ color: isHov ? 'var(--accent2)' : 'var(--accent)', transition: 'color 0.3s' }}>
                {dest.icon}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: isHov ? 'var(--accent2)' : 'var(--fg)',
                  transition: 'color 0.3s',
                }}
              >
                {dest.label}
              </div>
            </div>

            {/* Sub-caption below */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 14,
                whiteSpace: 'nowrap',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: isHov ? 'var(--fg2)' : 'var(--muted)',
                transition: 'color 0.3s',
                textAlign: 'center',
                letterSpacing: '0.05em',
              }}
            >
              {dest.sub}
            </div>
          </div>
        )
      })}

      {/* CENTER — name + instruction */}
      <div
        className="panel-glass"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: centerSize,
          height: centerSize,
          borderRadius: '50%',
          background: 'var(--glass)',
          transform: `translate(-50%, -50%) translate(${mouse.x * -6}px, ${mouse.y * -4}px)`,
          transition: 'transform 0.15s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 20,
          padding: isTablet ? 12 : 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: isTablet ? 'clamp(18px, 4vw, 24px)' : 'clamp(22px, 3vw, 34px)',
            fontWeight: 700,
            color: 'var(--fg)',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
          }}
        >
          RANIA
          <br />
          <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--fg2)', fontSize: '0.85em' }}>
            AHMED
          </span>
        </div>
        <div
          style={{
            width: 40,
            height: 1,
            background: 'var(--accent)',
            margin: '12px auto',
          }}
        />
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: isTablet ? 8 : 9,
            letterSpacing: isTablet ? '0.14em' : '0.25em',
            color: 'var(--muted)',
          }}
        >
          SELECT A DESTINATION
        </div>
      </div>

      {/* Description tooltip */}
      <div
        style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          color: hoveredDest ? 'var(--fg2)' : 'transparent',
          transition: 'color 0.3s',
          letterSpacing: '0.04em',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        {hoveredDest?.desc}
      </div>
    </div>
  )
}
