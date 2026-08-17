import type { CSSProperties } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

interface TypewriterProps {
  text: string
  speed?: number
  startDelay?: number
  className?: string
  style?: CSSProperties
  showCursor?: boolean
}

/**
 * ChatGPT-style character-by-character reveal of `text`, with an optional
 * blinking cursor rendered after the revealed portion.
 */
export default function Typewriter({
  text,
  speed,
  startDelay,
  className,
  style,
  showCursor = true,
}: TypewriterProps) {
  const { displayText, done } = useTypewriter(text, { speed, startDelay })

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && !done && <span className="typewriter-cursor" aria-hidden="true">|</span>}
    </span>
  )
}
