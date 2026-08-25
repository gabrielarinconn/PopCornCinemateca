import { useQuery } from '@tanstack/react-query';
import { getGenres, type GenreMediaType } from '@/infrastructure/api/genres';
import { shouldRetryQuery } from './should-retry-query';

// El catálogo de géneros de TMDB casi no cambia — cachearlo agresivamente
// evita pedirlo de nuevo cada vez que se visita la pantalla.
const GENRES_STALE_TIME_MS = 24 * 60 * 60 * 1000;

export function genresQueryKey(mediaType: GenreMediaType) {
  return ['genres', mediaType] as const;
}

export function useGenres(mediaType: GenreMediaType = 'movie') {
  return useQuery({
    queryKey: genresQueryKey(mediaType),
    queryFn: () => getGenres(mediaType),
    staleTime: GENRES_STALE_TIME_MS,
    retry: shouldRetryQuery,
    select: (data) => data.genres,
  });
}
