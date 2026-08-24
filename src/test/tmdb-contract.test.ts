import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';

import {
  DomainNotFoundError,
  DomainRateLimitError,
  DomainValidationError,
} from '../domain/shared/errors/api-errors';

import { getMovieDetails } from '../infrastructure/api/movie';
import { getGenres } from '../infrastructure/api/genres';
import { server } from './msw/server';

// Servidor MSW global (arrancado en vitest.setup.ts) — crear otro
// setupServer() local aquí duplicaba de verdad cada petición: dos capas de
// interceptores activas a la vez, no solo un doble conteo del espía.

describe('Contrato de Infraestructura TMDB', () => {
  it('debe traducir el código de error 34 de TMDB a DomainNotFoundError', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/999999', () => {
        return HttpResponse.json(
          { status_code: 34, status_message: 'The resource you requested could not be found.' },
          { status: 404 },
        );
      }),
    );

    await expect(getMovieDetails(999999)).rejects.toThrow(DomainNotFoundError);
  });

  it('debe manejar el HTTP 429 devolviendo DomainRateLimitError con el tiempo Retry-After', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/genre/movie/list', () => {
        return HttpResponse.json(
          { status_code: 25, status_message: 'Your request count is over the allowed limit.' },
          {
            status: 429,
            headers: { 'Retry-After': '12' },
          },
        );
      }),
    );

    try {
      await getGenres();
      expect.fail('se esperaba que getGenres() lanzara DomainRateLimitError');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(DomainRateLimitError);
      expect((error as DomainRateLimitError).retryAfterSeconds).toBe(12);
    }
  });

  it('debe lanzar DomainValidationError si la respuesta de TMDB no cumple con el esquema de Zod', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/genre/movie/list', () => {
        return HttpResponse.json({ genres: 'campo_corrupto_invalido' });
      }),
    );

    await expect(getGenres()).rejects.toThrow(DomainValidationError);
  });

  it('debe resolver la ficha de la película en una sola petición usando append_to_response', async () => {
    let appendParamValue = '';

    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', ({ request }) => {
        const url = new URL(request.url);
        appendParamValue = url.searchParams.get('append_to_response') ?? '';

        return HttpResponse.json({
          id: 550,
          title: 'Fight Club',
          overview: 'An insurance worker...',
          poster_path: '/path.jpg',
          backdrop_path: '/back.jpg',
          vote_average: 8.4,
          vote_count: 26000,
          budget: 63000000,
          genres: [{ id: 18, name: 'Drama' }],
          credits: { cast: [] },
          videos: { results: [] },
        });
      }),
    );

    const movie = await getMovieDetails(550);

    expect(movie.title).toBe('Fight Club');
    expect(appendParamValue).toBe('credits,videos,translations');
  });
});
