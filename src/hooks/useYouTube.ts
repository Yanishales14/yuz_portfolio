/**
 * YouTube Utility
 * Parse YouTube URLs, extract video IDs, generate embed URLs and thumbnails
 */

/**
 * Extract YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 * - https://www.youtube.com/v/ID
 * - https://www.youtube.com/shorts/ID
 * - Just the ID itself
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const trimmed = url.trim();
  
  // Direct video ID (11 characters, alphanumeric + - + _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  
  try {
    const parsed = new URL(trimmed);
    
    // youtube.com/watch?v=ID
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) {
      return parsed.searchParams.get('v');
    }
    
    // youtu.be/ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }
    
    // youtube.com/embed/ID
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] || null;
    }
    
    // youtube.com/v/ID
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/v/')) {
      return parsed.pathname.split('/v/')[1]?.split('/')[0] || null;
    }
    
    // youtube.com/shorts/ID
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null;
    }
    
  } catch { /* not a URL */ }
  
  return null;
}

/**
 * Check if a URL is a YouTube video
 */
export function isYouTubeUrl(url: string): boolean {
  return !!getYouTubeVideoId(url);
}

/**
 * Get YouTube embed URL for iframe
 */
export function getYouTubeEmbedUrl(url: string, autoplay = false): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1&mute=1' : ''}`;
}

/**
 * Get YouTube thumbnail URL
 * maxresdefault (1280x720) → hqdefault (480x360) → mqdefault (320x180)
 */
export function getYouTubeThumbnail(url: string, quality: 'max' | 'high' | 'medium' = 'high'): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  
  const qualityMap = {
    max: 'maxresdefault',   // 1280x720
    high: 'hqdefault',     // 480x360
    medium: 'mqdefault',   // 320x180
  };
  
  return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`;
}

/**
 * Parse a YouTube URL input and return video info
 */
export function parseYouTubeInput(url: string): { videoId: string; embedUrl: string; thumbnailUrl: string } | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  return {
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}
