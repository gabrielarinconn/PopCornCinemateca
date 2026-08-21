import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { searchMovies } from './search';

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

describe('searchMovies', () => {
  it('valida y devuelve los resultados de búsqueda', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/search/movie', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('query')).toBe('batman');
        return HttpResponse.json({
          page: 1,
          results: [
            {
              id: 268,
              title: 'Batman',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              vote_average: 7.2,
              vote_count: 500,
            },
          ],
          total_pages: 1,
          total_results: 1,
        });
      }),
    );

    const result = await searchMovies('batman');
    expect(result.results[0]?.title).toBe('Batman');
  });

  it('lanza DomainValidationError si la respuesta no cumple el schema', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/search/movie', () =>
        HttpResponse.json({ results: 'no es un arreglo' }),
      ),
    );

    await expect(searchMovies('batman')).rejects.toThrow(DomainValidationError);
  });
});
