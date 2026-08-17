import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger delay in ms, applied via animationDelay once visible. */
  delay?: number
  className?: string
  style?: CSSProperties
}

/**
 * Scroll-triggered reveal wrapper. Observes the wrapping <div> with an
 * IntersectionObserver and, the first time it enters the viewport, plays the
 * shared `fade-up` keyframe (defined in src/index.css) with a per-item
 * `animationDelay`. Triggers once — the element is never re-hidden if it
 * scrolls back out of view.
 *
 * Note on layout: this renders a plain block-level <div> (no `display`
 * override, so it defaults to `block`). It intentionally does NOT use
 * `display: contents` — that breaks IntersectionObserver sizing in some
 * browsers and strips the fade/translate transform from view. If you wrap a
 * CSS grid or flex child with <Reveal>, the wrapper div becomes the grid/flex
 * item instead of the original element; keep the wrapped element's own
 * width/height at 100% (or otherwise don't fight the wrapper) and the layout
 * will look identical. Pass `style`/`className` through if the call site
 * needs the wrapper itself to participate in a specific layout (e.g.
 * `style={{ display: 'inherit' }}`).
 */
export default function Reveal({ children, delay = 0, className, style }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? undefined : 0,
        animation: visible ? `fade-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards` : undefined,
        animationDelay: visible ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  )
}
