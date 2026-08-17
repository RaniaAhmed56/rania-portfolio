import { useEffect, useRef, useState } from 'react'
import { Mail, Link2, GitBranch, FileText, ChevronRight } from 'lucide-react'
import { useViewportSize } from '../hooks/useViewportSize'
import { playButtonHover, playButtonTap } from '../lib/uiSound'

interface Props {
  animClass: string
}

const CONTACTS = [
  {
    id: 'email',
    label: 'EMAIL',
    value: 'rania.ahmed@email.com',
    icon: <Mail size={22} />,
    desc: 'Send a direct message',
    action: 'mailto:rania.ahmed@email.com',
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    value: '/in/rania-ahmed-dev',
    icon: <Link2 size={22} />,
    desc: 'Connect professionally',
    action: '#',
  },
  {
    id: 'github',
    label: 'GITHUB',
    value: '@rania-ahmed',
    icon: <GitBranch size={22} />,
    desc: 'Explore the source code',
    action: '#',
  },
  {
    id: 'cv',
    label: 'CV / RESUME',
    value: 'Download PDF',
    icon: <FileText size={22} />,
    desc: 'Full professional profile',
    action: '#',
  },
]

export default function ContactRoom({ animClass }: Props) {
  const { isMobile, isTablet } = useViewportSize()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState<string | null>(null)
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
      {/* MAIN CONTENT */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        padding: isMobile ? '72px 20px 32px' : isTablet ? '76px 32px 40px' : '80px 48px 48px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        transform: `translate(${mouse.x * 4}px, ${mouse.y * 3}px)`,
        transition: 'transform 0.2s ease-out',
      }}>
        <div style={{ width: '100%', maxWidth: 900 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fade-up 0.6s both' }}>
            <div className="font-mono" style={{
              fontSize: 10,
              letterSpacing: '0.25em',
              color: 'var(--accent2)',
              marginBottom: 16,
            }}>
              COMMUNICATION / CONTACT
            </div>
            <h2 className="font-display" style={{
              fontSize: isMobile ? 'clamp(32px, 11vw, 48px)' : 'clamp(40px, 6vw, 68px)',
              fontWeight: 600,
              color: 'var(--fg)',
              letterSpacing: '0.01em',
              lineHeight: 1.08,
              marginBottom: 20,
            }}>
              Let's Build<br />
              <span style={{
                fontStyle: 'italic',
                fontWeight: 500,
                background: 'linear-gradient(135deg, var(--fg2), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Something</span>
            </h2>
            <p className="font-body" style={{
              fontSize: 14,
              color: 'var(--muted)',
              letterSpacing: '0.02em',
              maxWidth: 440,
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Open for new projects, collaborations, and full-time opportunities.
            </p>

            {/* Decorative divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 28,
            }}>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-strong)' }} />
              <span style={{ width: 36, height: 1, background: 'var(--border-strong)' }} />
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent2)' }} />
              <span style={{ width: 36, height: 1, background: 'var(--border-strong)' }} />
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-strong)' }} />
            </div>
          </div>

          {/* Contact cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(2, 1fr)',
            gap: 14,
            marginTop: 40,
          }}>
            {CONTACTS.map((contact, i) => {
              const isHov = hovered === contact.id
              return (
                <a
                  key={contact.id}
                  href={contact.action}
                  target={contact.action !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  onMouseEnter={() => { setHovered(contact.id); playButtonHover() }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => playButtonTap()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: isMobile ? '18px 20px' : '22px 24px',
                    borderRadius: 18,
                    background: isHov ? 'var(--glass-md)' : 'var(--glass)',
                    border: `1px solid ${isHov ? 'var(--accent2)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow: isHov ? 'var(--shadow-lift)' : 'var(--shadow-soft)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    transform: isHov ? 'translateY(-3px)' : 'none',
                    textDecoration: 'none',
                    animation: `fade-up 0.6s ${i * 0.1}s both`,
                  }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    border: `1px solid ${isHov ? 'var(--accent2)' : 'var(--border-md)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--accent)',
                    background: isHov ? 'var(--bg4)' : 'var(--bg3)',
                    transition: 'all 0.3s',
                  }}>
                    {contact.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-mono" style={{
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      color: 'var(--accent2)',
                      marginBottom: 4,
                    }}>
                      {contact.label}
                    </div>
                    <div className="font-body" style={{
                      fontSize: 14,
                      color: 'var(--fg)',
                      letterSpacing: '0.01em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {contact.value}
                    </div>
                    <div className="font-body" style={{
                      fontSize: 11,
                      color: 'var(--muted)',
                      marginTop: 2,
                    }}>
                      {contact.desc}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{
                    color: isHov ? 'var(--accent2)' : 'var(--muted)',
                    transition: 'all 0.3s',
                    transform: isHov ? 'translateX(4px)' : 'none',
                    flexShrink: 0,
                  }}>
                    <ChevronRight size={16} />
                  </div>
                </a>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="font-mono" style={{
            textAlign: 'center',
            marginTop: isMobile ? 28 : 36,
            fontSize: isMobile ? 9 : 10,
            letterSpacing: '0.2em',
            color: 'var(--muted)',
            animation: 'fade-up 0.6s 0.5s both',
          }}>
            <span style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#6FA37A',
              marginRight: 8,
              animation: 'dot-pulse 2s ease-in-out infinite',
              verticalAlign: 'middle',
            }} />
            AVAILABLE FOR NEW PROJECTS
          </div>
        </div>
      </div>
    </div>
  )
}
