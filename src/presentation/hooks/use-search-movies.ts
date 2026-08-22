import { useQuery } from '@tanstack/react-query';
import { movieSearchPort } from '@/infrastructure/api/movie-search.adapter';
import { shouldRetryQuery } from './should-retry-query';
import { normalizeSearchQuery, searchMoviesQueryKey } from './search-movies-query-key';

const SEARCH_STALE_TIME_MS = 5 * 60 * 1000;

/** Un término vacío deja la consulta deshabilitada — no sale ninguna petición. */
export function useSearchMovies(query: string) {
  const normalizedQuery = normalizeSearchQuery(query);

  return useQuery({
    queryKey: searchMoviesQueryKey(normalizedQuery),
    queryFn: ({ signal }) => movieSearchPort.searchMovies(normalizedQuery, 1, signal),
    enabled: normalizedQuery.length > 0,
    staleTime: SEARCH_STALE_TIME_MS,
    retry: shouldRetryQuery,
  });
}
