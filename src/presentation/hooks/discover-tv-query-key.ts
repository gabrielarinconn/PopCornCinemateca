import type { DiscoverTvFilters } from '@/application/ports/tv-discovery.port';

const DEFAULT_SORT_BY = 'popularity.desc';

interface NormalizedDiscoverTvFilters {
  genreId?: number;
  minVoteAverage?: number;
  minVoteCount?: number;
  sortBy?: string;
}

export function normalizeDiscoverTvFilters(
  filters: DiscoverTvFilters,
): NormalizedDiscoverTvFilters {
  const normalized: NormalizedDiscoverTvFilters = {};

  if (filters.genreId !== undefined) normalized.genreId = filters.genreId;
  if (filters.minVoteAverage !== undefined) normalized.minVoteAverage = filters.minVoteAverage;
  if (filters.minVoteCount !== undefined) normalized.minVoteCount = filters.minVoteCount;
  if (filters.sortBy !== undefined && filters.sortBy !== DEFAULT_SORT_BY) {
    normalized.sortBy = filters.sortBy;
  }

  return normalized;
}

export function discoverTvQueryKey(filters: DiscoverTvFilters) {
  const normalized = normalizeDiscoverTvFilters(filters);
  const sortedEntries = Object.entries(normalized).sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB),
  );

  return ['tv', 'discover', Object.fromEntries(sortedEntries)] as const;
}
