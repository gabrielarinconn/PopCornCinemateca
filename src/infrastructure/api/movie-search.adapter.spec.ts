import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw/server';
import { createMovieSearchPort, MAX_SEARCH_PAGE } from './movie-search.adapter';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
const FIXED_TODAY = new Date('2026-01-01');

function respondWith(page: number, totalPages: number, results: unknown[] = []) {
  server.use(
    http.get('https://api.themoviedb.org/3/search/movie', () =>
      HttpResponse.json({ page, results, total_pages: totalPages, total_results: results.length }),
    ),
  );
}

describe('movieSearchPort.searchMovies', () => {
  it('mapea el estado de estreno y la fiabilidad de la valoración — el dominio ya está aplicado', async () => {
    respondWith(1, 1, [
      {
        id: 268,
        title: 'Batman',
        overview: 'sinopsis',
        poster_path: '/p.jpg',
        backdrop_path: null,
        release_date: '1989-06-23',
        vote_average: 7.2,
        vote_count: 5000,
      },
    ]);

    const port = createMovieSearchPort(() => FIXED_TODAY);
    const result = await port.searchMovies('batman', 1);

    expect(result.movies[0]?.title).toBe('Batman');
    expect(result.movies[0]?.releaseStatus).toEqual({
      kind: 'released',
      releaseDate: new Date('1989-06-23'),
    });
    expect(result.movies[0]?.rating).toEqual({
      kind: 'consolidated',
      average: 7.2,
      voteCount: 5000,
    });
  });

  it('respeta el tope duro de 500 páginas aunque TMDB reporte más', async () => {
    respondWith(1, 900);

    const port = createMovieSearchPort(() => FIXED_TODAY);
    const result = await port.searchMovies('batman', 1);

    expect(result.totalPages).toBe(MAX_SEARCH_PAGE);
  });

  it('pedir una página más allá del tope se detiene con un estado explícito, sin llamar a la red', async () => {
    const networkSpy = vi.fn();
    server.use(
      http.get('https://api.themoviedb.org/3/search/movie', () => {
        networkSpy();
        return HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }),
    );

    const port = createMovieSearchPort(() => FIXED_TODAY);
    const result = await port.searchMovies('batman', MAX_SEARCH_PAGE + 1);

    expect(result).toEqual({ movies: [], page: MAX_SEARCH_PAGE + 1, totalPages: MAX_SEARCH_PAGE });
    expect(networkSpy).not.toHaveBeenCalled();
  });

  it('envía el término de búsqueda como parámetro `query` a TMDB', async () => {
    let capturedParams: URLSearchParams | undefined;
    server.use(
      http.get('https://api.themoviedb.org/3/search/movie', ({ request }) => {
        capturedParams = new URL(request.url).searchParams;
        return HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 });
      }),
    );

    const port = createMovieSearchPort(() => FIXED_TODAY);
    await port.searchMovies('batman', 1);

    expect(capturedParams?.get('query')).toBe('batman');
  });
});
