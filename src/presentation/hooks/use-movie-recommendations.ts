import { useQuery } from '@tanstack/react-query';
import { movieRecommendationsPort } from '@/infrastructure/api/movie-recommendations.adapter';
import { shouldRetryQuery } from './should-retry-query';

const RECOMMENDATIONS_STALE_TIME_MS = 5 * 60 * 1000;

export function useMovieRecommendations(movieId: number) {
  return useQuery({
    queryKey: ['movies', 'recommendations', movieId] as const,
    queryFn: ({ signal }) => movieRecommendationsPort.getRecommendations(movieId, signal),
    staleTime: RECOMMENDATIONS_STALE_TIME_MS,
    retry: shouldRetryQuery,
  });
}
