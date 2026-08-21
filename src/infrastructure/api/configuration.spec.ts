import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { getConfiguration } from './configuration';

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

describe('getConfiguration', () => {
  it('valida y devuelve la configuración de imágenes', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/configuration', () =>
        HttpResponse.json({
          images: {
            base_url: 'http://image.tmdb.org/t/p/',
            secure_base_url: 'https://image.tmdb.org/t/p/',
            backdrop_sizes: ['w300'],
            logo_sizes: ['w45'],
            poster_sizes: ['w92'],
            profile_sizes: ['w45'],
            still_sizes: ['w92'],
          },
          change_keys: ['adult'],
        }),
      ),
    );

    const config = await getConfiguration();
    expect(config.images.poster_sizes).toContain('w92');
  });

  it('lanza DomainValidationError si la respuesta no cumple el schema', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/configuration', () =>
        HttpResponse.json({ images: 'esto no es un objeto' }),
      ),
    );

    await expect(getConfiguration()).rejects.toThrow(DomainValidationError);
  });
});
