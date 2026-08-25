import type { MovieSummary } from '@/application/ports/movie-discovery.port';
import type { PosterCardData, RankedFeatureData } from '@/presentation/data/types';
import { tmdbPosterUrl } from './tmdb-image';

function extractYear(releaseDate: Date | undefined): string | undefined {
  if (!releaseDate || Number.isNaN(releaseDate.getTime())) return undefined;
  return String(releaseDate.getFullYear());
}

function getReleaseDate(status: MovieSummary['releaseStatus']): Date | undefined {
  if (status.kind === 'released' || status.kind === 'unreleased') {
    return status.releaseDate;
  }
  return undefined;
}

function formatMeta(movie: MovieSummary): string {
  const year = extractYear(getReleaseDate(movie.releaseStatus));
  if (year) return year;
  return movie.releaseStatus.kind === 'unreleased' ? 'Próximamente' : '';
}

function ratingValue(rating: MovieSummary['rating']): number | undefined {
  if (rating.kind === 'no-votes') return undefined;
  return rating.average;
}

export function toPosterCardData(movie: MovieSummary): PosterCardData {
  const rating = ratingValue(movie.rating);
  return {
    id: String(movie.id),
    title: movie.title,
    meta: formatMeta(movie),
    imageUrl: tmdbPosterUrl(movie.posterPath),
    ...(rating !== undefined && { rating }),
    href: `/pelicula/${String(movie.id)}`,
  };
}

export function toRankedFeatureData(
  movie: MovieSummary,
  rank: number,
  options?: { description?: string; simple?: boolean },
): RankedFeatureData {
  const rating = ratingValue(movie.rating);
  const watermark = movie.title.split(' ')[0]?.toUpperCase();
  return {
    id: String(movie.id),
    rank,
    title: movie.title,
    description: options?.description ?? movie.overview.slice(0, 160),
    meta: formatMeta(movie),
    imageUrl: tmdbPosterUrl(movie.posterPath),
    ...(rating !== undefined && { rating }),
    ...(watermark !== undefined && { watermark }),
    simple: options?.simple ?? rank > 1,
  };
}
