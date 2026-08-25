import { env } from '@/config/env';

const PLACEHOLDER_SEED = 'cineteca-placeholder';

export function tmdbPosterUrl(
  path: string | null | undefined,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500',
): string {
  if (!path) return `https://picsum.photos/seed/${PLACEHOLDER_SEED}/400/600`;
  return `${env.VITE_TMDB_IMAGE_BASE}/${size}${path}`;
}

export function tmdbBackdropUrl(
  path: string | null | undefined,
  size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280',
): string {
  if (!path) return `https://picsum.photos/seed/${PLACEHOLDER_SEED}/1280/720`;
  return `${env.VITE_TMDB_IMAGE_BASE}/${size}${path}`;
}

export function tmdbProfileUrl(
  path: string | null | undefined,
  size: 'w45' | 'w185' | 'h632' | 'original' = 'w185',
): string | null {
  if (!path) return null;
  return `${env.VITE_TMDB_IMAGE_BASE}/${size}${path}`;
}
