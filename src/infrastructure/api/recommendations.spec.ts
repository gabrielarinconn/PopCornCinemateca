import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { server } from '../../test/msw/server';
import { getMovieRecommendations } from './recommendations';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
describe('getMovieRecommendations', () => {
  it('valida y devuelve las recomendaciones de una película', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550/recommendations', () =>
        HttpResponse.json({
          page: 1,
          results: [
            {
              id: 807,
              title: 'Seven',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              vote_average: 8.6,
              vote_count: 1000,
            },
          ],
          total_pages: 1,
          total_results: 1,
        }),
      ),
    );

    const recommendations = await getMovieRecommendations(550);
    expect(recommendations.results).toHaveLength(1);
    expect(recommendations.results[0]?.title).toBe('Seven');
  });

  it('lanza DomainValidationError si la respuesta no cumple el schema', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550/recommendations', () =>
        HttpResponse.json({ results: 'no es un arreglo' }),
      ),
    );

    await expect(getMovieRecommendations(550)).rejects.toThrow(DomainValidationError);
  });
});
