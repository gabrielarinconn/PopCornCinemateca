import { useQuery } from '@tanstack/react-query';
import { getTrendingTv } from '@/infrastructure/api/trending-tv';
import { tmdbPosterUrl } from '@/presentation/lib/tmdb-image';
import type { PosterCardData } from '@/presentation/data/types';
import { shouldRetryQuery } from './should-retry-query';

const TRENDING_TV_STALE_TIME_MS = 5 * 60 * 1000;

export const trendingTvQueryKey = ['tv', 'trending'] as const;

export function useTrendingTv(timeWindow: 'day' | 'week' = 'week', limit = 20) {
  return useQuery({
    queryKey: [...trendingTvQueryKey, timeWindow] as const,
    queryFn: ({ signal }) => getTrendingTv(timeWindow, signal),
    staleTime: TRENDING_TV_STALE_TIME_MS,
    retry: shouldRetryQuery,
    select: (data): PosterCardData[] =>
      data.results.slice(0, limit).map((show) => ({
        id: String(show.id),
        title: show.name,
        meta: show.first_air_date ? show.first_air_date.slice(0, 4) : '',
        imageUrl: tmdbPosterUrl(show.poster_path),
        rating: show.vote_count > 0 ? show.vote_average : undefined,
        href: `/serie/${String(show.id)}`,
      })),
  });
}
