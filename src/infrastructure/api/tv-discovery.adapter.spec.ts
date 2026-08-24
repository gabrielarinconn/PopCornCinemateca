import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw/server';
import { createTvDiscoveryPort, MAX_DISCOVER_PAGE } from './tv-discovery.adapter';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
const FIXED_TODAY = new Date('2026-01-01');

function respondWith(page: number, totalPages: number, results: unknown[] = []) {
  server.use(
    http.get('https://api.themoviedb.org/3/discover/tv', () =>
      HttpResponse.json({ page, results, total_pages: totalPages, total_results: results.length }),
    ),
  );
}

describe('tvDiscoveryPort.discoverTv', () => {
  it('mapea el estado de estreno y la fiabilidad de la valoración — el dominio ya está aplicado', async () => {
    respondWith(1, 1, [
      {
        id: 1399,
        name: 'Game of Thrones',
        overview: 'sinopsis',
        poster_path: '/got.jpg',
        backdrop_path: null,
        first_air_date: '2011-04-17',
        vote_average: 8.4,
        vote_count: 20000,
      },
    ]);

    const port = createTvDiscoveryPort(() => FIXED_TODAY);
    const result = await port.discoverTv({}, 1);

    expect(result.shows[0]?.name).toBe('Game of Thrones');
    expect(result.shows[0]?.releaseStatus).toEqual({
      kind: 'released',
      releaseDate: new Date('2011-04-17'),
    });
    expect(result.shows[0]?.rating).toEqual({
      kind: 'consolidated',
      average: 8.4,
      voteCount: 20000,
    });
  });

  it('respeta el tope duro de 500 páginas aunque TMDB reporte más', async () => {
    respondWith(1, 900);

    const port = createTvDiscoveryPort(() => FIXED_TODAY);
    const result = await port.discoverTv({}, 1);

    expect(result.totalPages).toBe(MAX_DISCOVER_PAGE);
  });

  it('pedir una página más allá del tope se detiene con un estado explícito, sin llamar a la red', async () => {
    const networkSpy = vi.fn();
    server.use(
      http.get('https://api.themoviedb.org/3/discover/tv', () => {
        networkSpy();
        return HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }),
    );

    const port = createTvDiscoveryPort(() => FIXED_TODAY);
    const result = await port.discoverTv({}, MAX_DISCOVER_PAGE + 1);

    expect(result).toEqual({
      shows: [],
      page: MAX_DISCOVER_PAGE + 1,
      totalPages: MAX_DISCOVER_PAGE,
    });
    expect(networkSpy).not.toHaveBeenCalled();
  });

  it('traduce los filtros a los parámetros de TMDB', async () => {
    let capturedParams: URLSearchParams | undefined;
    server.use(
      http.get('https://api.themoviedb.org/3/discover/tv', ({ request }) => {
        capturedParams = new URL(request.url).searchParams;
        return HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }),
    );

    const port = createTvDiscoveryPort(() => FIXED_TODAY);
    await port.discoverTv(
      { genreId: 18, minVoteAverage: 7, minVoteCount: 100, sortBy: 'popularity.desc' },
      1,
    );

    expect(capturedParams?.get('with_genres')).toBe('18');
    expect(capturedParams?.get('vote_average.gte')).toBe('7');
    expect(capturedParams?.get('vote_count.gte')).toBe('100');
    expect(capturedParams?.get('sort_by')).toBe('popularity.desc');
  });
});
