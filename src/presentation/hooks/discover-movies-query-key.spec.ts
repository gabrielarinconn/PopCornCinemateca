import { describe, expect, it } from 'vitest';
import { discoverMoviesQueryKey, normalizeDiscoverFilters } from './discover-movies-query-key';

describe('discoverMoviesQueryKey', () => {
  it('genera la misma clave para los mismos filtros en distinto orden de propiedades', () => {
    const keyA = discoverMoviesQueryKey({ genreId: 28, year: 2020, minVoteAverage: 7 });
    const keyB = discoverMoviesQueryKey({ minVoteAverage: 7, year: 2020, genreId: 28 });

    expect(keyA).toEqual(keyB);
  });

  it('omite el valor de sortBy cuando es el valor por defecto', () => {
    const withDefault = discoverMoviesQueryKey({ sortBy: 'popularity.desc' });
    const withoutIt = discoverMoviesQueryKey({});

    expect(withDefault).toEqual(withoutIt);
  });

  it('sí distingue un sortBy que no es el valor por defecto', () => {
    const key = discoverMoviesQueryKey({ sortBy: 'vote_average.desc' });
    expect(key).toEqual(['movies', 'discover', { sortBy: 'vote_average.desc' }]);
  });

  it('dos filtros distintos generan claves distintas', () => {
    const keyA = discoverMoviesQueryKey({ genreId: 28 });
    const keyB = discoverMoviesQueryKey({ genreId: 12 });
    expect(keyA).not.toEqual(keyB);
  });
});

describe('normalizeDiscoverFilters', () => {
  it('omite las claves cuyo valor es undefined', () => {
    expect(normalizeDiscoverFilters({ genreId: undefined, year: 2020 })).toEqual({ year: 2020 });
  });
});
