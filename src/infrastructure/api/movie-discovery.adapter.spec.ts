import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw/server';
import { createMovieDiscoveryPort, MAX_DISCOVER_PAGE } from './movie-discovery.adapter';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
const FIXED_TODAY = new Date('2026-01-01');

function respondWith(page: number, totalPages: number, results: unknown[] = []) {
  server.use(
    http.get('https://api.themoviedb.org/3/discover/movie', () =>
      HttpResponse.json({ page, results, total_pages: totalPages, total_results: results.length }),
    ),
  );
}

describe('movieDiscoveryPort.discoverMovies', () => {
  it('mapea el estado de estreno y la fiabilidad de la valoración — el dominio ya está aplicado', async () => {
    respondWith(1, 1, [
      {
        id: 1,
        title: 'Estrenada hace mucho',
        overview: 'sinopsis',
        poster_path: '/p.jpg',
        backdrop_path: null,
        release_date: '2020-01-01',
        vote_average: 8.5,
        vote_count: 5000,
      },
      {
        id: 2,
        title: 'Sin votos',
        overview: 'sinopsis',
        poster_path: null,
        backdrop_path: null,
        vote_average: 0,
        vote_count: 0,
      },
    ]);

    const port = createMovieDiscoveryPort(() => FIXED_TODAY);
    const result = await port.discoverMovies({}, 1);

    expect(result.movies[0]?.releaseStatus).toEqual({
      kind: 'released',
      releaseDate: new Date('2020-01-01'),
    });
    expect(result.movies[0]?.rating).toEqual({
      kind: 'consolidated',
      average: 8.5,
      voteCount: 5000,
    });

    expect(result.movies[1]?.releaseStatus).toEqual({ kind: 'unknown-date' });
    expect(result.movies[1]?.rating).toEqual({ kind: 'no-votes' });
  });

  it('respeta el tope duro de 500 páginas aunque TMDB reporte más', async () => {
    respondWith(1, 900);

    const port = createMovieDiscoveryPort(() => FIXED_TODAY);
    const result = await port.discoverMovies({}, 1);

    expect(result.totalPages).toBe(MAX_DISCOVER_PAGE);
  });

  it('pedir una página más allá del tope se detiene con un estado explícito, sin llamar a la red', async () => {
    const networkSpy = vi.fn();
    server.use(
      http.get('https://api.themoviedb.org/3/discover/movie', () => {
        networkSpy();
        return HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }),
    );

    const port = createMovieDiscoveryPort(() => FIXED_TODAY);
    const result = await port.discoverMovies({}, MAX_DISCOVER_PAGE + 1);

    expect(result).toEqual({
      movies: [],
      page: MAX_DISCOVER_PAGE + 1,
      totalPages: MAX_DISCOVER_PAGE,
    });
    expect(networkSpy).not.toHaveBeenCalled();
  });

  it('traduce los filtros a los parámetros de TMDB', async () => {
    let capturedParams: URLSearchParams | undefined;
    server.use(
      http.get('https://api.themoviedb.org/3/discover/movie', ({ request }) => {
        capturedParams = new URL(request.url).searchParams;
        return HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }),
    );

    const port = createMovieDiscoveryPort(() => FIXED_TODAY);
    await port.discoverMovies(
      { genreId: 28, year: 2020, minVoteAverage: 7, minVoteCount: 100, sortBy: 'popularity.desc' },
      1,
    );

    expect(capturedParams?.get('with_genres')).toBe('28');
    expect(capturedParams?.get('primary_release_year')).toBe('2020');
    expect(capturedParams?.get('vote_average.gte')).toBe('7');
    expect(capturedParams?.get('vote_count.gte')).toBe('100');
    expect(capturedParams?.get('sort_by')).toBe('popularity.desc');
  });
});
