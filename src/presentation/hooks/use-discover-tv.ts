import { useInfiniteQuery } from '@tanstack/react-query';
import { tvDiscoveryPort } from '@/infrastructure/api/tv-discovery.adapter';
import { MAX_DISCOVER_PAGE } from '@/infrastructure/api/tv-discovery.adapter';
import type { DiscoverTvFilters } from '@/application/ports/tv-discovery.port';
import { discoverTvQueryKey } from './discover-tv-query-key';

const DISCOVER_TV_STALE_TIME_MS = 5 * 60 * 1000;

export function useDiscoverTv(filters: DiscoverTvFilters) {
  return useInfiniteQuery({
    queryKey: discoverTvQueryKey(filters),
    queryFn: ({ pageParam, signal }) =>
      tvDiscoveryPort.discoverTv(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= Math.min(lastPage.totalPages, MAX_DISCOVER_PAGE)) return undefined;
      return lastPage.page + 1;
    },
    staleTime: DISCOVER_TV_STALE_TIME_MS,
  });
}
