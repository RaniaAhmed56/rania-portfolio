import { useState } from 'react'
import { techStack, type Tech } from '../data'
import { ArrowUpRight, Monitor, Server, Database, Sliders, MoreHorizontal, Webhook } from 'lucide-react'
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiDjango, SiPython,
  SiNodedotjs, SiPostgresql, SiMongodb, SiApachekafka, SiDocker,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { useViewportSize } from '../hooks/useViewportSize'
import { useTilt } from '../hooks/useTilt'
import Reveal from '../components/Reveal'
import { playButtonHover, playButtonTap } from '../lib/uiSound'

// Real, recognizable brand marks per technology (Simple Icons via react-icons),
// each rendered in its own authentic brand color rather than a generic glyph.
// Django REST Framework has no distinct public brand mark, so it gets a
// professional "API" glyph (lucide Webhook) instead of reusing Django's logo.
const BRAND_ICONS: Record<string, { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string }> = {
  react: { Icon: SiReact, color: '#61DAFB' },
  nextjs: { Icon: SiNextdotjs, color: '#2A1D17' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  javascript: { Icon: SiJavascript, color: '#E8B900' },
  django: { Icon: SiDjango, color: '#2E7D4F' },
  drf: { Icon: Webhook, color: '#B0705A' },
  python: { Icon: SiPython, color: '#3776AB' },
  nodejs: { Icon: SiNodedotjs, color: '#5FA344' },
  postgresql: { Icon: SiPostgresql, color: '#4169E1' },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  kafka: { Icon: SiApachekafka, color: '#5A5250' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  aws: { Icon: FaAws, color: '#DD8B00' },
}

interface Props {
  animClass: string
}

// Filter groups remap the 6 data categories into 5 UI pills
const FILTERS: { key: string; label: string; icon: React.ReactNode; categories: string[] }[] = [
  { key: 'Frontend', label: 'FRONTEND', icon: <Monitor size={12} />, categories: ['Frontend'] },
  { key: 'Backend', label: 'BACKEND', icon: <Server size={12} />, categories: ['Backend'] },
  { key: 'Database', label: 'DATABASE', icon: <Database size={12} />, categories: ['Database'] },
  { key: 'Devops', label: 'DEVOPS / TOOLS', icon: <Sliders size={12} />, categories: ['Infrastructure', 'Cloud'] },
  { key: 'Other', label: 'OTHER', icon: <MoreHorizontal size={12} />, categories: ['Language'] },
]

// Muted, warm-compatible accent colors per category
const CATEGORY_COLORS: Record<string, string> = {
  Frontend: '#6B8CAE',
  Backend: '#B0705A',
  Language: '#C99A4A',
  Database: '#7FA66B',
  Infrastructure: '#9A85B0',
  Cloud: '#6B8CAE',
}

function TechIcon({ tech, selected, onSelect, isMobile }: { tech: Tech; selected: boolean; onSelect: () => void; isMobile: boolean }) {
  const [hov, setHov] = useState(false)
  const color = CATEGORY_COLORS[tech.category] ?? 'var(--accent2)'
  const active = hov || selected
  const iconSize = isMobile ? 38 : 56
  const tilt = useTilt<HTMLButtonElement>()
  const brand = BRAND_ICONS[tech.id]

  return (
    <button
      ref={tilt.ref}
      onClick={() => { playButtonTap(); onSelect() }}
      onMouseEnter={() => { setHov(true); playButtonHover() }}
      onMouseLeave={() => {
        setHov(false)
        tilt.onMouseLeave()
      }}
      onMouseMove={tilt.onMouseMove}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? 6 : 8,
        padding: isMobile ? '12px 8px' : '16px 10px',
        borderRadius: isMobile ? 12 : 16,
        background: active ? 'var(--bg4)' : 'var(--panel)',
        border: `1px solid ${active ? 'var(--accent2)' : 'var(--border)'}`,
        cursor: 'pointer',
        transition: `border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), ${tilt.style.transition ?? 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'}`,
        boxShadow: active ? '0 8px 24px var(--glow-md), 0 0 0 1px var(--glow-md)' : 'none',
        backdropFilter: 'blur(12px)',
        transform: `translateY(${active ? -4 : 0}px) ${tilt.style.transform ?? ''}`,
        willChange: tilt.style.willChange ?? 'auto',
      }}
    >
      {/* Shine sweep overlay */}
      <div className={`shine-sweep${hov ? ' shine-sweep--active' : ''}`} />

      {/* Category indicator dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: active ? `0 0 8px ${color}` : 'none',
        transition: 'box-shadow 0.3s',
      }} />

      {/* Tech brand logo */}
      <div style={{
        width: iconSize,
        height: iconSize,
        borderRadius: '50%',
        border: `1px solid ${active ? 'var(--accent2)' : 'var(--border-md)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        background: active ? 'var(--bg3)' : 'var(--bg4)',
      }}>
        {brand
          ? <brand.Icon size={isMobile ? 18 : 24} color={brand.color} />
          : <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: isMobile ? 12 : 15,
              fontWeight: 600,
              color: active ? 'var(--accent2)' : 'var(--fg2)',
            }}>{tech.icon}</span>}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: isMobile ? 11 : 13,
        color: active ? 'var(--fg)' : 'var(--fg2)',
        transition: 'color 0.3s',
        whiteSpace: 'nowrap',
      }}>
        {tech.name}
      </div>
    </button>
  )
}

export default function StackLab({ animClass }: Props) {
  const defaultSelected = techStack.find(t => t.id === 'javascript') ?? null
  const [selected, setSelected] = useState<Tech | null>(defaultSelected)
  const [filter, setFilter] = useState<string | null>(null)
  const { isMobile, isTablet } = useViewportSize()

  const activeFilter = FILTERS.find(f => f.key === filter)
  const displayed = activeFilter
    ? techStack.filter(t => activeFilter.categories.includes(t.category))
    : techStack

  const handleSelect = (tech: Tech) => {
    setSelected(prev => (prev?.id === tech.id ? null : tech))
  }

  return (
    <div
      className={animClass}
      style={{ position: 'absolute', inset: 0, background: 'transparent', overflow: 'hidden' }}
    >
      {/* Scrollable content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        zIndex: 20,
        paddingTop: 90,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px 100px' : '0 48px 100px' }}>

          {/* Intro */}
          <div style={{ marginBottom: 40, animation: 'fade-up 0.6s both', textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              color: 'var(--fg2)',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '0 auto',
            }}>
              I&apos;m skilled in a wide range of technologies — tools I use to build modern and scalable digital products.
            </p>
          </div>

          {/* Category filter */}
          <div
            style={{
              display: 'flex',
              gap: isMobile ? 8 : 10,
              marginBottom: isMobile ? 32 : 48,
              flexWrap: isMobile ? 'nowrap' : 'wrap',
              justifyContent: isMobile ? 'flex-start' : 'center',
              overflowX: isMobile ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
              animation: 'fade-up 0.6s 0.1s both',
            }}
          >
            <button
              onClick={() => { playButtonTap(); setFilter(null) }}
              onMouseEnter={playButtonHover}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.15em',
                color: filter === null ? '#FAEFE8' : 'var(--fg2)',
                background: filter === null
                  ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                  : 'transparent',
                border: `1px solid ${filter === null ? 'transparent' : 'var(--border)'}`,
                borderRadius: 999,
                padding: isMobile ? '8px 16px' : '9px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: filter === null ? '0 6px 18px var(--glow-md)' : 'none',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              ALL
            </button>
            {FILTERS.map(f => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => { playButtonTap(); setFilter(active ? null : f.key) }}
                  onMouseEnter={playButtonHover}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    color: active ? '#FAEFE8' : 'var(--fg2)',
                    background: active
                      ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                      : 'transparent',
                    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                    borderRadius: 999,
                    padding: isMobile ? '8px 16px' : '9px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    boxShadow: active ? '0 6px 18px var(--glow-md)' : 'none',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.icon}
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Tech grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(auto-fill, minmax(78px, 1fr))'
              : 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: isMobile ? 6 : 10,
            marginBottom: isMobile ? 28 : 40,
            animation: 'fade-up 0.6s 0.15s both',
          }}>
            {displayed.map((tech, idx) => (
              <Reveal key={tech.id} delay={(idx % 12) * 40}>
                <TechIcon
                  tech={tech}
                  selected={selected?.id === tech.id}
                  onSelect={() => handleSelect(tech)}
                  isMobile={isMobile}
                />
              </Reveal>
            ))}
          </div>

          {/* Detail panel — appears when tech selected */}
          {selected && (
            <div
              key={selected.id}
              className="panel-glass"
              style={{
                borderRadius: 20,
                padding: isMobile ? 20 : 36,
                animation: 'fade-up 0.4s both',
                position: 'relative',
              }}
            >
              <button
                style={{
                  position: 'absolute',
                  top: isMobile ? 14 : 20,
                  right: isMobile ? 14 : 20,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px solid var(--border-md)',
                  background: 'var(--bg4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--fg2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
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
                <ArrowUpRight size={15} />
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
                gap: isMobile ? 24 : 40,
                paddingRight: isMobile ? 30 : 0,
              }}>
                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--accent2)',
                    marginBottom: 10,
                  }}>
                    {selected.category.toUpperCase()}
                  </div>
                  <h3 className="font-display" style={{
                    fontSize: isMobile ? 26 : 32,
                    fontWeight: 700,
                    color: 'var(--fg)',
                    marginBottom: 16,
                  }}>
                    {selected.name}
                  </h3>
                  <div style={{
                    width: 48,
                    height: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                    marginBottom: 16,
                  }} />
                  <p style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 14,
                    color: 'var(--fg2)',
                    lineHeight: 1.7,
                  }}>
                    {selected.description}
                  </p>
                </div>

                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--muted)',
                    marginBottom: 16,
                  }}>
                    USED IN PROJECTS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selected.projects.map(proj => (
                      <div key={proj} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 13,
                        color: 'var(--fg2)',
                      }}>
                        <div style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--accent2)',
                          flexShrink: 0,
                        }} />
                        {proj}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer branding */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 32,
        display: isMobile ? 'none' : 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 25,
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'var(--accent2)',
        }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.15em',
          color: 'var(--muted)',
        }}>
          RANIA AHMED — PORTFOLIO
        </span>
      </div>
    </div>
  )
}
