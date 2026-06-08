export function getYouTubeId(src: string): string | null {
  const m = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function youtubeThumb(src: string): string | null {
  const id = getYouTubeId(src);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function youtubeEmbed(src: string): string {
  const id = getYouTubeId(src);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : src;
}
