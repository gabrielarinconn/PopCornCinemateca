import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { getTrendingMovies } from './trending';

const server = setupServer();

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('getTrendingMovies', () => {
  it('valida y devuelve las tendencias de la semana por defecto', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/trending/movie/day', () =>
        HttpResponse.json({
          page: 1,
          results: [
            {
              id: 1,
              title: 'Tendencia',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              vote_average: 6.5,
              vote_count: 10,
            },
          ],
          total_pages: 1,
          total_results: 1,
        }),
      ),
    );

    const result = await getTrendingMovies();
    expect(result.results[0]?.title).toBe('Tendencia');
  });

  it('pide la ventana de "week" cuando se especifica', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/trending/movie/week', () =>
        HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      ),
    );

    const result = await getTrendingMovies('week');
    expect(result.results).toHaveLength(0);
  });

  it('lanza DomainValidationError si la respuesta no cumple el schema', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/trending/movie/day', () =>
        HttpResponse.json({ results: 'no es un arreglo' }),
      ),
    );

    await expect(getTrendingMovies()).rejects.toThrow(DomainValidationError);
  });
});
