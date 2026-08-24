import type { TvShowSummary } from '@/application/ports/tv-discovery.port';
import type { PosterCardData } from '@/presentation/data/types';
import { tmdbPosterUrl } from './tmdb-image';

function extractYear(releaseDate: Date | undefined): string | undefined {
  if (!releaseDate || Number.isNaN(releaseDate.getTime())) return undefined;
  return String(releaseDate.getFullYear());
}

function getReleaseDate(status: TvShowSummary['releaseStatus']): Date | undefined {
  if (status.kind === 'released' || status.kind === 'unreleased') {
    return status.releaseDate;
  }
  return undefined;
}

function formatMeta(show: TvShowSummary): string {
  const year = extractYear(getReleaseDate(show.releaseStatus));
  if (year) return year;
  return show.releaseStatus.kind === 'unreleased' ? 'Próximamente' : '';
}

function ratingValue(rating: TvShowSummary['rating']): number | undefined {
  if (rating.kind === 'no-votes') return undefined;
  return rating.average;
}

export function toTvPosterCardData(show: TvShowSummary): PosterCardData {
  const rating = ratingValue(show.rating);
  return {
    id: String(show.id),
    title: show.name,
    meta: formatMeta(show),
    imageUrl: tmdbPosterUrl(show.posterPath),
    ...(rating !== undefined && { rating }),
    href: `/serie/${String(show.id)}`,
  };
}
