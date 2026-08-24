import type { DiscoverMoviesFilters } from '@/application/ports/movie-discovery.port';

const DEFAULT_SORT_BY = 'popularity.desc';

interface NormalizedDiscoverFilters {
  genreId?: number;
  year?: number;
  minVoteAverage?: number;
  minVoteCount?: number;
  sortBy?: string;
}

/**
 * Quita los valores por defecto — dos combinaciones de filtros equivalentes
 * (con o sin el valor por defecto explícito) deben generar la misma entrada
 * de caché.
 */
export function normalizeDiscoverFilters(
  filters: DiscoverMoviesFilters,
): NormalizedDiscoverFilters {
  const normalized: NormalizedDiscoverFilters = {};

  if (filters.genreId !== undefined) normalized.genreId = filters.genreId;
  if (filters.year !== undefined) normalized.year = filters.year;
  if (filters.minVoteAverage !== undefined) normalized.minVoteAverage = filters.minVoteAverage;
  if (filters.minVoteCount !== undefined) normalized.minVoteCount = filters.minVoteCount;
  if (filters.sortBy !== undefined && filters.sortBy !== DEFAULT_SORT_BY) {
    normalized.sortBy = filters.sortBy;
  }

  return normalized;
}

/**
 * El texto de búsqueda o los filtros entran normalizados a la clave, con
 * las propiedades en un orden estable — dos llamadas con los mismos
 * filtros en distinto orden de propiedades generan exactamente la misma
 * clave de caché, sin depender de cómo TanStack Query serialice el objeto.
 */
export function discoverMoviesQueryKey(filters: DiscoverMoviesFilters) {
  const normalized = normalizeDiscoverFilters(filters);
  const sortedEntries = Object.entries(normalized).sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB),
  );

  return ['movies', 'discover', Object.fromEntries(sortedEntries)] as const;
}
