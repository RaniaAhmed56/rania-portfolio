import { useEffect, useState } from 'react'

export interface ViewportSize {
  width: number
  height: number
  /** true when width < 640px — phones */
  isMobile: boolean
  /** true when width < 900px — phones + small tablets/portrait tablets */
  isTablet: boolean
}

function getSize(): ViewportSize {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280
  const height = typeof window !== 'undefined' ? window.innerHeight : 800
  return { width, height, isMobile: width < 640, isTablet: width < 900 }
}

/**
 * Reactive viewport size + breakpoint flags, used across scenes to switch
 * between the desktop layout and a simplified single-column mobile layout.
 * Breakpoints: isMobile < 640px (phones), isTablet < 900px (phones + small
 * tablets in portrait).
 */
export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(getSize)

  useEffect(() => {
    const onResize = () => setSize(getSize())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return size
}
