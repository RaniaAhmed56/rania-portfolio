/**
 * Turns a plain YouTube, Vimeo, or Google Drive share URL into an embeddable
 * iframe `src`. Returns null if the URL doesn't look like a supported video
 * link.
 */
export function getEmbedUrl(url?: string): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null

  // YouTube: https://www.youtube.com/watch?v=ID, https://youtu.be/ID, https://youtube.com/embed/ID, with optional query params
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Vimeo: https://vimeo.com/ID or https://player.vimeo.com/video/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // Google Drive: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // (the file must be shared as "anyone with the link can view" for the
  // embedded preview to load).
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  }

  return null
}
