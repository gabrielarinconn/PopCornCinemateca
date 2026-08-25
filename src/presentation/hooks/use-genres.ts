import { useQuery } from '@tanstack/react-query';
import { getGenres } from '@/infrastructure/api/genres';
import { shouldRetryQuery } from './should-retry-query';

// El catálogo de géneros de TMDB casi no cambia — cachearlo agresivamente
// evita pedirlo de nuevo cada vez que se visita la pantalla.
const GENRES_STALE_TIME_MS = 24 * 60 * 60 * 1000;

export const genresQueryKey = ['genres', 'movie'] as const;

export function useGenres() {
  return useQuery({
    queryKey: genresQueryKey,
    queryFn: () => getGenres(),
    staleTime: GENRES_STALE_TIME_MS,
    retry: shouldRetryQuery,
    select: (data) => data.genres,
  });
}
