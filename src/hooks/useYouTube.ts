/**
 * YouTube Integration — Extract metadata from YouTube URLs.
 * No API key needed. Uses direct URL construction + noembed fallback.
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  // Maybe it's already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'sd' | 'maxres' = 'hq'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string, options?: { autoplay?: boolean; start?: number }): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    fs: '1',
  });
  if (options?.autoplay) {
    params.set('autoplay', '1');
    params.set('mute', '1');
  }
  if (options?.start) {
    params.set('start', String(options.start));
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export interface YouTubeMeta {
  title: string;
  author: string;
  thumbnail: string;
}

const metaCache = new Map<string, YouTubeMeta>();

export async function fetchYouTubeMeta(url: string): Promise<YouTubeMeta | null> {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  if (metaCache.has(videoId)) return metaCache.get(videoId)!;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(getYouTubeWatchUrl(videoId))}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.json();
    if (data.error) return null;

    const meta: YouTubeMeta = {
      title: data.title || '',
      author: data.author_name || '',
      thumbnail: data.thumbnail_url || getYouTubeThumbnail(videoId),
    };
    metaCache.set(videoId, meta);
    return meta;
  } catch {
    // Fallback: use video ID to construct thumbnail, title unknown
    const meta: YouTubeMeta = {
      title: '',
      author: '',
      thumbnail: getYouTubeThumbnail(videoId),
    };
    metaCache.set(videoId, meta);
    return meta;
  }
}

export function formatYouTubeDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return iso;
  const h = m[1] ? parseInt(m[1]) : 0;
  const min = m[2] ? parseInt(m[2]) : 0;
  const s = m[3] ? parseInt(m[3]) : 0;
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${min}:${String(s).padStart(2, '0')}`;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
