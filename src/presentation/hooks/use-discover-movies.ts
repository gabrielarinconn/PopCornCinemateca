import { useInfiniteQuery } from '@tanstack/react-query';
import { movieDiscoveryPort } from '@/infrastructure/api/movie-discovery.adapter';
import { MAX_DISCOVER_PAGE } from '@/infrastructure/api/movie-discovery.adapter';
import type { DiscoverMoviesFilters } from '@/application/ports/movie-discovery.port';
import { discoverMoviesQueryKey } from './discover-movies-query-key';

// El catálogo de descubrimiento cambia poco durante una sesión — no hace
// falta revalidar cada vez que la pantalla vuelve a montar.
const DISCOVER_STALE_TIME_MS = 5 * 60 * 1000;

export function useDiscoverMovies(filters: DiscoverMoviesFilters) {
  return useInfiniteQuery({
    queryKey: discoverMoviesQueryKey(filters),
    queryFn: ({ pageParam, signal }) =>
      movieDiscoveryPort.discoverMovies(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= Math.min(lastPage.totalPages, MAX_DISCOVER_PAGE)) return undefined;
      return lastPage.page + 1;
    },
    staleTime: DISCOVER_STALE_TIME_MS,
  });
}
