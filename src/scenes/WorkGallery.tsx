import { useState } from 'react'
import type { Project } from '../data'
import { projects } from '../data'
import { useViewportSize } from '../hooks/useViewportSize'
import { useTilt } from '../hooks/useTilt'
import Reveal from '../components/Reveal'
import { playButtonHover, playButtonTap } from '../lib/uiSound'

interface Props {
  onSelectProject: (id: string) => void
  animClass: string
}

interface ArrowButtonProps {
  isHov: boolean
}

function ArrowButton({ isHov }: ArrowButtonProps) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        minWidth: 40,
        borderRadius: '50%',
        border: `1px solid ${isHov ? 'transparent' : 'var(--border-strong)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isHov ? '#fff' : 'var(--fg2)',
        transition: 'all 0.3s',
        background: isHov
          ? 'linear-gradient(135deg, var(--accent2), var(--accent))'
          : 'transparent',
        boxShadow: isHov ? '0 6px 18px rgba(154,115,84,0.35)' : 'none',
        fontSize: 16,
        transform: isHov ? 'rotate(-45deg)' : 'rotate(0deg)',
      }}
    >
      →
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  isHov: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

function MobileProjectCard({ project, isHov, onMouseEnter, onMouseLeave, onClick }: ProjectCardProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '18px 16px',
        minHeight: 44,
        borderRadius: 16,
        border: '1px solid',
        borderColor: isHov ? 'var(--accent2)' : 'var(--border)',
        background: isHov ? 'rgba(255,252,249,0.78)' : 'rgba(255,252,249,0.55)',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        backdropFilter: 'blur(10px)',
        boxShadow: isHov ? 'var(--shadow-lift)' : 'var(--shadow-soft)',
      }}
    >
      {/* Number + tagline */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div
          className="font-display"
          style={{
            fontSize: 32,
            fontStyle: 'italic',
            fontWeight: 500,
            color: 'var(--accent2)',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {project.num}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            color: 'var(--muted)',
          }}
        >
          {project.tagline.toUpperCase()}
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-display"
        style={{
          fontSize: 'clamp(20px, 6vw, 26px)',
          fontWeight: 700,
          color: 'var(--fg)',
          letterSpacing: '0.02em',
        }}
      >
        {project.title}
      </h3>

      {/* Tech pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {project.tech.slice(0, 4).map(t => (
          <span
            key={t}
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--fg2)',
              padding: '5px 10px',
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'transparent',
              transition: 'all 0.3s',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* View project + Arrow — full width row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          marginTop: 4,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            color: 'var(--accent2)',
            whiteSpace: 'nowrap',
          }}
        >
          VIEW PROJECT
        </span>
        <ArrowButton isHov={isHov} />
      </div>
    </div>
  )
}

function DesktopProjectCard({ project, isHov, isTablet, onMouseEnter, onMouseLeave, onClick }: ProjectCardProps & { isTablet: boolean }) {
  const tilt = useTilt<HTMLDivElement>()
  const [shineActive, setShineActive] = useState(false)

  return (
    <div
      ref={tilt.ref}
      onMouseEnter={() => {
        onMouseEnter()
        setShineActive(true)
      }}
      onMouseLeave={() => {
        onMouseLeave()
        setShineActive(false)
        tilt.onMouseLeave()
      }}
      onMouseMove={tilt.onMouseMove}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        alignItems: 'center',
        gap: isTablet ? 20 : 32,
        padding: isTablet ? '22px 22px' : '26px 28px',
        borderRadius: 18,
        border: '1px solid',
        borderColor: isHov ? 'var(--accent2)' : 'var(--border)',
        background: isHov ? 'rgba(255,252,249,0.78)' : 'rgba(255,252,249,0.55)',
        cursor: 'pointer',
        transition: `border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), ${tilt.style.transition ?? 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'}`,
        transform: `translateY(${isHov ? -3 : 0}px) ${tilt.style.transform ?? ''}`,
        backdropFilter: 'blur(10px)',
        boxShadow: isHov ? 'var(--shadow-lift)' : 'var(--shadow-soft)',
        willChange: tilt.style.willChange ?? 'auto',
      }}
    >
      {/* Shine sweep overlay */}
      <div className={`shine-sweep${shineActive ? ' shine-sweep--active' : ''}`} />

      {/* Number */}
      <div
        className="font-display"
        style={{
          fontSize: 44,
          fontStyle: 'italic',
          fontWeight: 500,
          color: 'var(--accent2)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {project.num}
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isTablet ? 18 : 28,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 220 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.15em',
              color: 'var(--muted)',
              marginBottom: 6,
            }}
          >
            {project.tagline.toUpperCase()}
          </div>
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(20px, 2.2vw, 26px)',
              fontWeight: 700,
              color: 'var(--fg)',
              letterSpacing: '0.02em',
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* Tech pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {project.tech.slice(0, 4).map(t => (
            <span
              key={t}
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                color: 'var(--fg2)',
                padding: '5px 10px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'transparent',
                transition: 'all 0.3s',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* View project + Arrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexShrink: 0,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            color: 'var(--accent2)',
            whiteSpace: 'nowrap',
          }}
        >
          VIEW PROJECT
        </span>
        <ArrowButton isHov={isHov} />
      </div>
    </div>
  )
}

export default function WorkGallery({ onSelectProject, animClass }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const { isMobile, isTablet } = useViewportSize()

  const sidePad = isMobile ? 20 : isTablet ? 40 : 80

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
      {/* GALLERY HEADER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: isMobile ? `40px ${sidePad}px 20px` : `72px ${sidePad}px 24px`,
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: isMobile ? 14 : 20,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 1,
              background: 'var(--accent2)',
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--accent2)',
            }}
          >
            PORTFOLIO / PROJECTS
          </span>
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: isMobile ? 'clamp(34px, 9vw, 72px)' : 'clamp(48px, 6vw, 72px)',
            fontWeight: 600,
            color: 'var(--fg)',
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
          }}
        >
          Projects
        </h2>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: 'var(--fg2)',
            marginTop: 14,
            maxWidth: 480,
            lineHeight: 1.5,
          }}
        >
          Few snapshots of digital products crafted with purpose and precision.
        </p>
      </div>

      {/* PROJECT ROWS — scrollable list */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          top: isMobile ? 220 : 260,
          bottom: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: `0 ${sidePad}px 60px`,
          zIndex: 20,
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 10 : 12,
            maxWidth: 1360,
          }}
        >
          {projects.map((project, idx) => {
            const isHov = hovered === project.id

            if (isMobile) {
              return (
                <Reveal key={project.id} delay={idx * 90}>
                  <MobileProjectCard
                    project={project}
                    isHov={isHov}
                    onMouseEnter={() => { setHovered(project.id); playButtonHover() }}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => { playButtonTap(); onSelectProject(project.id) }}
                  />
                </Reveal>
              )
            }

            return (
              <Reveal key={project.id} delay={idx * 90}>
                <DesktopProjectCard
                  project={project}
                  isHov={isHov}
                  isTablet={isTablet}
                  onMouseEnter={() => { setHovered(project.id); playButtonHover() }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { playButtonTap(); onSelectProject(project.id) }}
                />
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Bottom edge fade for scroll legibility */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'linear-gradient(to top, rgba(242,225,215,0.4), transparent)',
          pointerEvents: 'none',
          zIndex: 25,
        }}
      />
    </div>
  )
}
