/**
 * Mismo criterio de `discover-movies-query-key.ts`: el valor entra
 * normalizado a la clave de caché — dos búsquedas equivalentes con
 * espacios o mayúsculas distintas ("Batman " y "batman") generan la misma
 * entrada, sin depender de cómo TanStack Query serialice el string.
 */
export function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase();
}

export function searchMoviesQueryKey(query: string) {
  return ['movies', 'search', normalizeSearchQuery(query)] as const;
}
