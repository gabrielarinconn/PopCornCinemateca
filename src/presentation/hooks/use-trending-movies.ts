import { useQuery } from '@tanstack/react-query';
import { getTrendingMovies } from '@/infrastructure/api/trending';
import { tmdbPosterUrl } from '@/presentation/lib/tmdb-image';
import type { PosterCardData } from '@/presentation/data/types';
import { shouldRetryQuery } from './should-retry-query';

const TRENDING_STALE_TIME_MS = 5 * 60 * 1000;

export const trendingMoviesQueryKey = ['movies', 'trending'] as const;

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week', limit = 20) {
  return useQuery({
    queryKey: [...trendingMoviesQueryKey, timeWindow] as const,
    queryFn: ({ signal }) => getTrendingMovies(timeWindow, signal),
    staleTime: TRENDING_STALE_TIME_MS,
    retry: shouldRetryQuery,
    select: (data): PosterCardData[] =>
      data.results.slice(0, limit).map((movie) => ({
        id: String(movie.id),
        title: movie.title,
        meta: movie.release_date ? movie.release_date.slice(0, 4) : '',
        imageUrl: tmdbPosterUrl(movie.poster_path),
        ...(movie.vote_count > 0 && { rating: movie.vote_average }),
        href: `/pelicula/${String(movie.id)}`,
      })),
  });
}
