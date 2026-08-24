import { useQuery } from '@tanstack/react-query';
import { movieDetailPort } from '@/infrastructure/api/movie-detail.adapter';
import { shouldRetryQuery } from './should-retry-query';

// La ficha de una película ya estrenada casi no cambia durante una sesión.
const MOVIE_DETAIL_STALE_TIME_MS = 5 * 60 * 1000;

export function movieDetailQueryKey(movieId: number) {
  return ['movies', 'detail', movieId] as const;
}

export function useMovieDetail(movieId: number) {
  return useQuery({
    queryKey: movieDetailQueryKey(movieId),
    queryFn: ({ signal }) => movieDetailPort.getMovieDetail(movieId, signal),
    staleTime: MOVIE_DETAIL_STALE_TIME_MS,
    retry: shouldRetryQuery,
  });
}
