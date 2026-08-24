import { describe, expect, it } from 'vitest';
import { discoverTvQueryKey, normalizeDiscoverTvFilters } from './discover-tv-query-key';

describe('discoverTvQueryKey', () => {
  it('genera la misma clave para los mismos filtros en distinto orden de propiedades', () => {
    const keyA = discoverTvQueryKey({ genreId: 18, minVoteAverage: 7 });
    const keyB = discoverTvQueryKey({ minVoteAverage: 7, genreId: 18 });

    expect(keyA).toEqual(keyB);
  });

  it('omite el valor de sortBy cuando es el valor por defecto', () => {
    const withDefault = discoverTvQueryKey({ sortBy: 'popularity.desc' });
    const withoutIt = discoverTvQueryKey({});

    expect(withDefault).toEqual(withoutIt);
  });

  it('sí distingue un sortBy que no es el valor por defecto', () => {
    const key = discoverTvQueryKey({ sortBy: 'vote_average.desc' });
    expect(key).toEqual(['tv', 'discover', { sortBy: 'vote_average.desc' }]);
  });

  it('dos filtros distintos generan claves distintas', () => {
    const keyA = discoverTvQueryKey({ genreId: 18 });
    const keyB = discoverTvQueryKey({ genreId: 10759 });
    expect(keyA).not.toEqual(keyB);
  });
});

describe('normalizeDiscoverTvFilters', () => {
  it('omite las claves cuyo valor es undefined', () => {
    expect(normalizeDiscoverTvFilters({ genreId: undefined, minVoteAverage: 7 })).toEqual({
      minVoteAverage: 7,
    });
  });
});
