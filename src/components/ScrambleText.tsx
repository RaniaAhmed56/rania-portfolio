import type { CSSProperties, ElementType } from 'react'
import { useScramble } from '../hooks/useScramble'

interface ScrambleTextProps {
  text: string
  as?: ElementType
  duration?: number
  charPool?: string
  enabled?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Renders `text` via a hacking/decode-style scramble reveal: characters
 * start randomized and rapidly resolve left-to-right (with a little jitter)
 * into the final copy. Wraps in the tag given by `as` (default `span`).
 */
export default function ScrambleText({
  text,
  as: Tag = 'span',
  duration,
  charPool,
  enabled,
  className,
  style,
}: ScrambleTextProps) {
  const scrambled = useScramble(text, { duration, charPool, enabled })

  return (
    <Tag className={className} style={style}>
      {scrambled}
    </Tag>
  )
}
