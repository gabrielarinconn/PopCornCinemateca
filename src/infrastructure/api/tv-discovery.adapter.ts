import type { DiscoverTvFilters, TvDiscoveryPort } from '@/application/ports/tv-discovery.port';
import { getDiscoverTv } from './discover-tv';
import { toTvShowSummary } from './tv-summary.mapper';

export const MAX_DISCOVER_PAGE = 500;

function buildTmdbParams(
  filters: DiscoverTvFilters,
  page: number,
): Record<string, string | number> {
  const params: Record<string, string | number> = { page };

  if (filters.genreId !== undefined) params.with_genres = filters.genreId;
  if (filters.minVoteAverage !== undefined) params['vote_average.gte'] = filters.minVoteAverage;
  if (filters.minVoteCount !== undefined) params['vote_count.gte'] = filters.minVoteCount;
  if (filters.sortBy !== undefined) params.sort_by = filters.sortBy;

  return params;
}

export function createTvDiscoveryPort(today: () => Date = () => new Date()): TvDiscoveryPort {
  return {
    async discoverTv(filters, page, signal) {
      if (page > MAX_DISCOVER_PAGE) {
        return { shows: [], page, totalPages: MAX_DISCOVER_PAGE };
      }

      const response = await getDiscoverTv(buildTmdbParams(filters, page), signal);
      const now = today();

      return {
        shows: response.results.map((raw) => toTvShowSummary(raw, now)),
        page: response.page,
        totalPages: Math.min(response.total_pages, MAX_DISCOVER_PAGE),
      };
    },
  };
}

export const tvDiscoveryPort: TvDiscoveryPort = createTvDiscoveryPort();
