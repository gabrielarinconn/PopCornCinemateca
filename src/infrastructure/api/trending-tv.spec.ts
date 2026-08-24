import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { server } from '../../test/msw/server';
import { getTrendingTv } from './trending-tv';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
describe('getTrendingTv', () => {
  it('valida y devuelve las tendencias de la semana por defecto', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/trending/tv/week', () =>
        HttpResponse.json({
          page: 1,
          results: [
            {
              id: 1399,
              name: 'Game of Thrones',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              vote_average: 8.4,
              vote_count: 20000,
            },
          ],
          total_pages: 1,
          total_results: 1,
        }),
      ),
    );

    const result = await getTrendingTv();
    expect(result.results[0]?.name).toBe('Game of Thrones');
  });

  it('pide la ventana de "day" cuando se especifica', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/trending/tv/day', () =>
        HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      ),
    );

    const result = await getTrendingTv('day');
    expect(result.results).toHaveLength(0);
  });

  it('lanza DomainValidationError si la respuesta no cumple el schema', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/trending/tv/week', () =>
        HttpResponse.json({ results: 'no es un arreglo' }),
      ),
    );

    await expect(getTrendingTv()).rejects.toThrow(DomainValidationError);
  });
});
