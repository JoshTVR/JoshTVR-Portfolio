export interface YouTubeMeta {
  title: string
  thumbnailUrl: string
  authorName: string
  width: number
  height: number
}

/**
 * Fetch YouTube video metadata via oEmbed (no API key required).
 * Works for any public YouTube video URL.
 */
export async function getYouTubeMeta(url: string): Promise<YouTubeMeta | null> {
  if (!url) return null
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title ?? '',
      thumbnailUrl: data.thumbnail_url ?? '',
      authorName: data.author_name ?? '',
      width: data.thumbnail_width ?? 1280,
      height: data.thumbnail_height ?? 720,
    }
  } catch {
    return null
  }
}

/** Extract video ID from any YouTube URL format */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

/** Get highest-quality thumbnail URL for a video ID */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
