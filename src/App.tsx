import { useState, useCallback, useEffect } from 'react'
import Intro from './scenes/Intro'
import Hub from './scenes/Hub'
import WorkGallery from './scenes/WorkGallery'
import ProjectRoom from './scenes/ProjectRoom'
import StackLab from './scenes/StackLab'
import AboutRoom from './scenes/AboutRoom'
import ContactRoom from './scenes/ContactRoom'
import FloatingNav from './components/FloatingNav'
import CursorGlow from './components/CursorGlow'
import Preloader from './components/Preloader'
import CommandPalette from './components/CommandPalette'
import ScrollProgress from './components/ScrollProgress'
import { useAmbientMusic } from './hooks/useAmbientMusic'
import { setUiSoundEnabled, playWhoosh, playPageEnter, playButtonTap } from './lib/uiSound'

type Scene = 'intro' | 'hub' | 'work' | 'project' | 'stack' | 'about' | 'contact'

interface SceneState {
  current: Scene
  projectId: string | null
  phase: 'idle' | 'exit' | 'enter'
}

const BACK_MAP: Partial<Record<Scene, Scene>> = {
  hub: 'intro',
  work: 'hub',
  project: 'work',
  stack: 'hub',
  about: 'hub',
  contact: 'hub',
}

// Intro & Hub use the circular-portal background; every other room uses
// the soft draped-wave background.
const CIRCLE_BG_SCENES: Scene[] = ['intro', 'hub']

// Dynamic browser-tab title per scene — a small, easy-to-miss detail that
// still signals attention to craft.
const SCENE_TITLES: Record<Scene, string> = {
  intro: 'Rania Ahmed — Full Stack Developer',
  hub: 'Rania Ahmed — Central Hub',
  work: 'Rania Ahmed — Projects',
  project: 'Rania Ahmed — Project',
  stack: 'Rania Ahmed — Tech Stack',
  about: 'Rania Ahmed — About',
  contact: 'Rania Ahmed — Contact',
}

export default function App() {
  const [state, setState] = useState<SceneState>({
    current: 'intro',
    projectId: null,
    phase: 'enter',
  })
  const [soundOn, setSoundOn] = useState(false)
  const [showPreloader] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useAmbientMusic(soundOn)

  useEffect(() => {
    setUiSoundEnabled(soundOn)
  }, [soundOn])

  useEffect(() => {
    document.title = SCENE_TITLES[state.current]
  }, [state.current])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/') return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return
      e.preventDefault()
      setPaletteOpen(true)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Apply enter animation class after first render
    const t = setTimeout(() => {
      setState(s => ({ ...s, phase: 'idle' }))
    }, 1400)
    return () => clearTimeout(t)
  }, [])

  const navigateTo = useCallback((scene: Scene, projectId?: string) => {
    // Start exit
    playWhoosh()
    setState(s => ({ ...s, phase: 'exit' }))

    const exitDuration = 550
    setTimeout(() => {
      setState({ current: scene, projectId: projectId ?? null, phase: 'enter' })
      playPageEnter()
      setTimeout(() => {
        setState(s => ({ ...s, phase: 'idle' }))
      }, 1200)
    }, exitDuration)
  }, [])

  const goBack = useCallback(() => {
    const dest = BACK_MAP[state.current]
    if (dest) {
      if (dest === 'intro') {
        navigateTo('intro')
      } else {
        navigateTo(dest)
      }
    }
  }, [state.current, navigateTo])

  const getAnimClass = () => {
    if (state.phase === 'exit') return 'scene-exit'
    if (state.phase === 'enter') return 'scene-enter'
    return ''
  }

  const animClass = getAnimClass()

  const renderScene = () => {
    switch (state.current) {
      case 'intro':
        return (
          <Intro
            animClass={animClass}
            onStart={() => navigateTo('hub')}
          />
        )
      case 'hub':
        return (
          <Hub
            animClass={animClass}
            onNavigate={(dest) => navigateTo(dest)}
          />
        )
      case 'work':
        return (
          <WorkGallery
            animClass={animClass}
            onSelectProject={(id) => navigateTo('project', id)}
          />
        )
      case 'project':
        return (
          <ProjectRoom
            animClass={animClass}
            projectId={state.projectId ?? 'eschool'}
            onNavigateProject={(id) => navigateTo('project', id)}
          />
        )
      case 'stack':
        return (
          <StackLab animClass={animClass} />
        )
      case 'about':
        return (
          <AboutRoom animClass={animClass} />
        )
      case 'contact':
        return (
          <ContactRoom animClass={animClass} />
        )
    }
  }

  const bgClass = CIRCLE_BG_SCENES.includes(state.current) ? 'bg-scene-circle' : 'bg-scene-wave'

  return (
    <div
      className={bgClass}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif",
        transition: 'background-image 0.6s ease',
      }}
    >
      {/* Scene layer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {renderScene()}
      </div>

      {/* Nav overlay */}
      <FloatingNav
        scene={state.current}
        onBack={() => {
          playButtonTap()
          goBack()
        }}
        soundOn={soundOn}
        onToggleSound={() => {
          if (soundOn) {
            setSoundOn(false)
          } else {
            setSoundOn(true)
          }
          playButtonTap()
        }}
        onOpenPalette={() => {
          playButtonTap()
          setPaletteOpen(true)
        }}
      />

      {/* Scroll progress bar (reflects the active scene's internal scroll container) */}
      <ScrollProgress />

      {/* Command palette — press "/" or click the search icon in FloatingNav */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={(scene) => {
          setPaletteOpen(false)
          navigateTo(scene)
        }}
      />

      {/* Cursor glow (no-ops on mobile/tablet internally) */}
      <CursorGlow />

      {/* Subtle cinematic film-grain + vignette — barely-there texture that adds depth */}
      <div className="film-grain" />
      <div className="film-vignette" />

      {/* One-time preloader shown on first mount */}
      {showPreloader && <Preloader />}
    </div>
  )
}
