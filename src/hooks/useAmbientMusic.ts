import { useEffect } from 'react'

/**
 * This portfolio intentionally avoids ambient music.
 * All feedback is delivered through lightweight motion/click sounds in the
 * Web Audio layer, keeping the experience elegant and less intrusive.
 */
export function useAmbientMusic(_playing: boolean) {
  useEffect(() => {
    // Intentionally empty: no looped background track.
  }, [_playing])
}
