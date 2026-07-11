/** Video helpers shared by the lecture components. */
export type Video = { type: 'youtube' | 'vimeo'; id: string };

/** Poster image for a video (YouTube only; Vimeo has no no-auth thumbnail). */
export function videoThumb(v: Video): string {
  if (v.type === 'youtube' && v.id) {
    return `https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg`;
  }
  return '';
}

/** Autoplay embed URL used once the visitor clicks to play. */
export function videoEmbedSrc(v: Video): string {
  if (v.type === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0`;
  }
  if (v.type === 'vimeo') {
    return `https://player.vimeo.com/video/${encodeURIComponent(v.id)}?autoplay=1`;
  }
  return '';
}
