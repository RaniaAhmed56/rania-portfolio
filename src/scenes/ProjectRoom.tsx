import { useEffect, useRef, useState } from 'react'
import { projects } from '../data'
import { getEmbedUrl } from '../lib/video'
import { useViewportSize } from '../hooks/useViewportSize'
import { useCountUp } from '../hooks/useCountUp'
import Typewriter from '../components/Typewriter'
import {
  ExternalLink, GitBranch, BookOpen, CheckCircle2, Zap,
  Activity, GraduationCap, Target, ChevronRight, ChevronLeft,
  Calendar, Users, Link2, PlayCircle,
} from 'lucide-react'
import { playButtonHover, playButtonTap } from '../lib/uiSound'

interface Props {
  projectId: string
  animClass: string
}

/**
 * Splits a metric's leading token (e.g. "500+", "60%", "<100ms", "4.8/5",
 * "10K+") into an optional static prefix, an animatable number, its decimal
 * precision, and a static trailing suffix.
 */
function parseMetricToken(token: string): { prefix: string; number: number; decimals: number; suffix: string } | null {
  const match = token.match(/^([<>]?)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const decimalPart = numStr.split('.')[1]
  return { prefix, number: parseFloat(numStr), decimals: decimalPart ? decimalPart.length : 0, suffix }
}

function AnimatedMetricValue({ token }: { token: string }) {
  const parsed = parseMetricToken(token)
  const { value, ref } = useCountUp<HTMLSpanElement>(parsed?.number ?? 0, {
    duration: 1400,
    decimals: parsed?.decimals ?? 0,
  })

  if (!parsed) {
    return <span>{token}</span>
  }

  const formatted = parsed.decimals > 0 ? value.toFixed(parsed.decimals) : Math.round(value)

  return (
    <span ref={ref}>
      {parsed.prefix}
      {formatted}
      {parsed.suffix}
    </span>
  )
}

export default function ProjectRoom({ projectId, animClass }: Props) {
  const project = projects.find(p => p.id === projectId) ?? projects[0]
  const { isMobile, isTablet } = useViewportSize()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
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

  const projectIndex = projects.findIndex(p => p.id === projectId)

  const monthsByNum: Record<string, string> = {
    '01': 'MARCH 2024',
    '02': 'JUNE 2024',
    '03': 'SEPTEMBER 2023',
    '04': 'DECEMBER 2023',
    '05': 'FEBRUARY 2024',
  }
  const completedLabel = monthsByNum[project.num] ?? 'JANUARY 2024'
  const teamSizes = ['3 MEMBERS', '5 MEMBERS', '4 MEMBERS', '6 MEMBERS']
  const teamLabel = teamSizes[projectIndex % teamSizes.length]

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
      {/* Soft ambient glow, subtle per-project accent bar aside */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--glow-md) 0%, transparent 70%)',
        opacity: 0.5,
        pointerEvents: 'none',
        transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)`,
        transition: 'transform 0.3s ease-out',
      }} />

      {/* MAIN CONTENT PANEL */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        zIndex: 10,
        paddingTop: 88,
      }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: isMobile ? '0 20px 64px' : '0 48px 96px',
          textAlign: 'center',
        }}>

          {/* 4px accent bar, subtle per-project variety */}
          <div style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: project.color,
            opacity: 0.55,
            margin: '0 auto 20px',
            animation: 'fade-up 0.6s both',
          }} />

          {/* Header */}
          <div style={{ marginBottom: 44, animation: 'fade-up 0.6s 0.05s both' }}>
            <div className="font-mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--accent2)',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}>
              {project.tagline}
            </div>

            <h1 className="font-display" style={{
              fontSize: isMobile ? 'clamp(32px, 10vw, 88px)' : 'clamp(48px, 7vw, 88px)',
              fontWeight: 700,
              color: 'var(--fg)',
              letterSpacing: '0',
              lineHeight: 1.05,
              marginBottom: 20,
              textTransform: 'uppercase',
            }}>
              {project.title}
            </h1>

            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15,
              color: 'var(--fg2)',
              lineHeight: 1.6,
              maxWidth: isMobile ? '100%' : 640,
              margin: '0 auto',
              minHeight: '3.2em',
            }}>
              <Typewriter key={project.id} text={project.description} startDelay={300} />
            </p>
          </div>

          {/* VIDEO — the primary place to watch a demo of this project */}
          {(() => {
            const embedUrl = getEmbedUrl(project.videoUrl)
            return (
              <div
                className="panel-glass"
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginBottom: 24,
                  animation: 'fade-up 0.6s 0.08s both',
                }}
              >
                {embedUrl ? (
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <iframe
                      src={embedUrl}
                      title={`${project.title} demo video`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '48px 24px',
                    color: 'var(--muted)',
                  }}>
                    <PlayCircle size={34} color="var(--accent2)" style={{ opacity: 0.7 }} />
                    <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.16em' }}>
                      DEMO VIDEO COMING SOON
                    </span>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Metrics row */}
          <div className="panel-glass" style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : 'repeat(3, 1fr)',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            animation: 'fade-up 0.6s 0.1s both',
          }}>
            {project.metrics.map((metric, i) => (
              <div key={i} style={{
                padding: isMobile ? '18px 24px' : '26px 28px',
                textAlign: 'center',
                borderRight: !isTablet && i < 2 ? '1px solid var(--border)' : 'none',
                borderBottom: isTablet && i < project.metrics.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div className="font-display" style={{
                  fontSize: 'clamp(30px, 3.4vw, 42px)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--accent2)',
                  marginBottom: 6,
                }}>
                  <AnimatedMetricValue token={metric.split(' ')[0]} />
                </div>
                <div className="font-mono" style={{
                  fontSize: 10,
                  color: 'var(--muted)',
                  letterSpacing: '0.14em',
                }}>
                  {metric.split(' ').slice(1).join(' ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Tech + Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 20,
            marginBottom: 24,
            animation: 'fade-up 0.6s 0.15s both',
          }}>
            {/* Technologies */}
            <div className="panel-glass" style={{ borderRadius: 20, padding: isMobile ? 20 : 28, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-md)',
                  flexShrink: 0,
                }}>
                  <GraduationCap size={14} color="var(--accent2)" />
                </div>
                <span className="font-mono" style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--accent2)',
                }}>TECHNOLOGIES</span>
              </div>
              <div className="font-display" style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--fg)',
                marginBottom: 18,
              }}>
                {project.role}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {project.tech.map(t => (
                  <span key={t} className="font-mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: 'var(--fg2)',
                    padding: '5px 12px',
                    borderRadius: 999,
                    border: '1px solid var(--border-md)',
                    background: 'var(--bg4)',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="panel-glass" style={{ borderRadius: 20, padding: isMobile ? 20 : 28, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-md)',
                  flexShrink: 0,
                }}>
                  <Target size={14} color="var(--accent2)" />
                </div>
                <span className="font-mono" style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--accent2)',
                }}>KEY FEATURES</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', maxWidth: isMobile ? '100%' : 340, margin: '0 auto' }}>
                {project.features.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13.5,
                    color: 'var(--fg2)',
                    lineHeight: 1.5,
                  }}>
                    <CheckCircle2 size={15} color="var(--accent2)" style={{ flexShrink: 0, marginTop: 1 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Completed / Team / Role row */}
          <div className="panel-glass" style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : 'repeat(3, 1fr)',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 40,
            animation: 'fade-up 0.6s 0.2s both',
          }}>
            {[
              { icon: <Calendar size={14} color="var(--accent2)" />, label: 'COMPLETED', value: completedLabel },
              { icon: <Users size={14} color="var(--accent2)" />, label: 'TEAM SIZE', value: teamLabel },
              { icon: <Link2 size={14} color="var(--accent2)" />, label: 'ROLE', value: project.role.toUpperCase() },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: isMobile ? '16px 20px' : '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTablet ? 'flex-start' : 'center',
                gap: 12,
                borderRight: !isTablet && i < 2 ? '1px solid var(--border)' : 'none',
                borderBottom: isTablet && i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-md)',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div className="font-mono" style={{
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    color: 'var(--muted)',
                    marginBottom: 3,
                  }}>{item.label}</div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--fg)',
                  }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture / Challenges / Solutions / Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
            {[
              { icon: <GitBranch size={14} />, label: 'ARCHITECTURE', content: project.architecture },
              { icon: <Activity size={14} />, label: 'CHALLENGES', content: project.challenges },
              { icon: <Zap size={14} />, label: 'SOLUTIONS', content: project.solutions },
              { icon: <BookOpen size={14} />, label: 'RESULTS', content: project.results },
            ].map(({ icon, label, content }, i) => (
              <div key={label} className="panel-glass" style={{
                borderRadius: 20,
                padding: isMobile ? 20 : 28,
                textAlign: 'center',
                animation: `fade-up 0.5s ${0.25 + i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ color: 'var(--accent2)', display: 'flex' }}>{icon}</span>
                  <span className="font-mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--accent2)',
                  }}>{label}</span>
                </div>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14.5,
                  color: 'var(--fg2)',
                  lineHeight: 1.7,
                  maxWidth: isMobile ? '100%' : 620,
                  margin: '0 auto',
                }}>
                  {content}
                </p>
              </div>
            ))}
          </div>

          {/* ACTION PORTALS */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 12 : 16,
            marginBottom: 40,
            animation: 'fade-up 0.6s 0.35s both',
          }}>
            {[
              {
                id: 'demo',
                label: 'WATCH DEMO',
                icon: <ExternalLink size={15} />,
                desc: project.videoUrl ? 'Open the demo video' : 'Video coming soon',
                href: project.videoUrl,
              },
              {
                id: 'github',
                label: 'GITHUB',
                icon: <GitBranch size={15} />,
                desc: 'Explore the source code',
                href: undefined as string | undefined,
              },
              {
                id: 'case',
                label: 'CASE STUDY',
                icon: <BookOpen size={15} />,
                desc: 'Read the full case study',
                href: undefined as string | undefined,
              },
            ].map(action => {
              const isHov = hoveredLink === action.id
              const disabled = !action.href
              return (
                <a
                  key={action.id}
                  href={action.href ?? undefined}
                  target={action.href ? '_blank' : undefined}
                  rel={action.href ? 'noreferrer' : undefined}
                  onClick={disabled ? (e) => e.preventDefault() : () => playButtonTap()}
                  onMouseEnter={() => { setHoveredLink(action.id); if (!disabled) playButtonHover() }}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="panel-glass"
                  style={{
                    flex: 1,
                    padding: '20px 24px',
                    borderRadius: 16,
                    border: `1px solid ${isHov && !disabled ? 'var(--accent2)' : 'var(--border-strong)'}`,
                    color: isHov && !disabled ? 'var(--accent2)' : 'var(--fg2)',
                    cursor: disabled ? 'default' : 'pointer',
                    opacity: disabled ? 0.55 : 1,
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 8,
                    textDecoration: 'none',
                    transform: isHov && !disabled ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isHov && !disabled ? '0 12px 32px var(--glow-md)' : 'var(--shadow-soft)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    {action.icon}
                    <span className="font-mono" style={{
                      fontSize: 10,
                      letterSpacing: '0.2em',
                    }}>
                      {action.label}
                    </span>
                    <ChevronRight size={12} style={{
                      marginLeft: 'auto',
                      transform: isHov && !disabled ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                    }} />
                  </div>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11.5,
                    color: 'var(--muted)',
                    textAlign: 'left',
                  }}>
                    {action.desc}
                  </span>
                </a>
              )
            })}
          </div>

          {/* Project nav — previous / next */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
          }}>
            {projectIndex > 0 ? (
              <div className="font-mono" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: isMobile ? 10 : 11,
                letterSpacing: '0.1em',
                color: 'var(--fg2)',
                maxWidth: isMobile ? '46%' : '48%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}>
                <ChevronLeft size={14} color="var(--accent2)" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {projects[projectIndex - 1].title}
                </span>
              </div>
            ) : <div />}
            {projectIndex < projects.length - 1 && (
              <div className="font-mono" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: isMobile ? 10 : 11,
                letterSpacing: '0.1em',
                color: 'var(--fg2)',
                maxWidth: isMobile ? '46%' : '48%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                justifyContent: 'flex-end',
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {projects[projectIndex + 1].title}
                </span>
                <ChevronRight size={14} color="var(--accent2)" style={{ flexShrink: 0 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
