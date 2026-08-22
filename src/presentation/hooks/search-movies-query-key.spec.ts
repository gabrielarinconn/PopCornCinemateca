import { describe, expect, it } from 'vitest';
import { normalizeSearchQuery, searchMoviesQueryKey } from './search-movies-query-key';

describe('searchMoviesQueryKey', () => {
  it('genera la misma clave para búsquedas equivalentes con espacios o mayúsculas distintas', () => {
    const keyA = searchMoviesQueryKey('Batman ');
    const keyB = searchMoviesQueryKey('batman');

    expect(keyA).toEqual(keyB);
  });

  it('dos términos distintos generan claves distintas', () => {
    const keyA = searchMoviesQueryKey('batman');
    const keyB = searchMoviesQueryKey('superman');

    expect(keyA).not.toEqual(keyB);
  });
});

describe('normalizeSearchQuery', () => {
  it('recorta espacios y convierte a minúsculas', () => {
    expect(normalizeSearchQuery('  Batman  ')).toBe('batman');
  });
});
