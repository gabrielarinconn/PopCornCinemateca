import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../test/msw/server';
import { createMovieDetailPort } from './movie-detail.adapter';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
const FIXED_TODAY = new Date('2026-01-01');

function baseMovieResponse(overrides: Record<string, unknown> = {}) {
  return {
    id: 550,
    title: 'Fight Club',
    overview: 'Un hombre insomne...',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 26000,
    budget: 63000000,
    genres: [{ id: 18, name: 'Drama' }],
    credits: { cast: [] },
    videos: { results: [] },
    translations: {
      translations: [{ iso_639_1: 'en', data: { overview: 'An insomniac office worker...' } }],
    },
    ...overrides,
  };
}

describe('movieDetailPort.getMovieDetail', () => {
  it('un presupuesto en 0 se mapea a "sin dato" (undefined), nunca a $0', async () => {
    const networkSpy = vi.fn();
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () => {
        networkSpy();
        return HttpResponse.json(baseMovieResponse({ budget: 0 }));
      }),
    );

    const port = createMovieDetailPort(() => FIXED_TODAY);
    const detail = await port.getMovieDetail(550);

    expect(detail.budget).toBeUndefined();
    expect(networkSpy).toHaveBeenCalledTimes(1);
  });

  it('vote_count: 0 se mapea a "sin votos", nunca a 0,0', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () =>
        HttpResponse.json(baseMovieResponse({ vote_average: 0, vote_count: 0 })),
      ),
    );

    const port = createMovieDetailPort(() => FIXED_TODAY);
    const detail = await port.getMovieDetail(550);

    expect(detail.rating).toEqual({ kind: 'no-votes' });
  });

  it('una sinopsis vacía en español cae al inglés con el aviso correspondiente', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () =>
        HttpResponse.json(baseMovieResponse({ overview: '' })),
      ),
    );

    const port = createMovieDetailPort(() => FIXED_TODAY);
    const detail = await port.getMovieDetail(550);

    expect(detail.overview).toEqual({
      text: 'An insomniac office worker...',
      isFallbackToEnglish: true,
    });
  });

  it('se resuelve con una sola petición, usando el parámetro de expansión', async () => {
    let appendParam = '';
    const networkSpy = vi.fn();

    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', ({ request }) => {
        networkSpy();
        appendParam = new URL(request.url).searchParams.get('append_to_response') ?? '';
        return HttpResponse.json(baseMovieResponse());
      }),
    );

    const port = createMovieDetailPort(() => FIXED_TODAY);
    const detail = await port.getMovieDetail(550);

    expect(networkSpy).toHaveBeenCalledTimes(1);
    expect(appendParam).toBe('credits,videos,translations');
    expect(detail.title).toBe('Fight Club');
    expect(detail.releaseStatus).toEqual({ kind: 'released', releaseDate: new Date('1999-10-15') });
    expect(detail.genres).toEqual(['Drama']);
  });

  it('mapea el elenco y los tráilers cuando vienen presentes', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () =>
        HttpResponse.json(
          baseMovieResponse({
            credits: {
              cast: [
                {
                  id: 1,
                  name: 'Edward Norton',
                  character: 'The Narrator',
                  profile_path: '/en.jpg',
                },
              ],
            },
            videos: {
              results: [
                {
                  id: 'v1',
                  key: 'abc123',
                  name: 'Official Trailer',
                  site: 'YouTube',
                  type: 'Trailer',
                },
              ],
            },
          }),
        ),
      ),
    );

    const port = createMovieDetailPort(() => FIXED_TODAY);
    const detail = await port.getMovieDetail(550);

    expect(detail.cast).toEqual([
      { id: 1, name: 'Edward Norton', character: 'The Narrator', profilePath: '/en.jpg' },
    ]);
    expect(detail.trailers).toEqual([
      { id: 'v1', key: 'abc123', name: 'Official Trailer', site: 'YouTube' },
    ]);
  });

  it('un miembro del elenco sin personaje ni foto se mapea a null, no a undefined', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () =>
        HttpResponse.json(
          baseMovieResponse({ credits: { cast: [{ id: 2, name: 'Extra sin acreditar' }] } }),
        ),
      ),
    );

    const port = createMovieDetailPort(() => FIXED_TODAY);
    const detail = await port.getMovieDetail(550);

    expect(detail.cast).toEqual([
      { id: 2, name: 'Extra sin acreditar', character: null, profilePath: null },
    ]);
  });
});
