import { describe, expect, it } from 'vitest';
import { tmdbBackdropUrl, tmdbPosterUrl, tmdbProfileUrl } from './tmdb-image';

describe('tmdbPosterUrl', () => {
  it('con una ruta, arma la URL de TMDB con el tamaño por defecto', () => {
    expect(tmdbPosterUrl('/poster.jpg')).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('con un tamaño explícito, lo usa', () => {
    expect(tmdbPosterUrl('/poster.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/poster.jpg');
  });

  it('sin ruta (null o undefined), cae a un marcador de posición', () => {
    expect(tmdbPosterUrl(null)).toContain('picsum.photos');
    expect(tmdbPosterUrl(undefined)).toContain('picsum.photos');
  });
});

describe('tmdbBackdropUrl', () => {
  it('con una ruta, arma la URL de TMDB con el tamaño por defecto', () => {
    expect(tmdbBackdropUrl('/backdrop.jpg')).toBe('https://image.tmdb.org/t/p/w1280/backdrop.jpg');
  });

  it('sin ruta, cae a un marcador de posición', () => {
    expect(tmdbBackdropUrl(null)).toContain('picsum.photos');
  });
});

describe('tmdbProfileUrl', () => {
  it('con una ruta, arma la URL de TMDB con el tamaño por defecto', () => {
    expect(tmdbProfileUrl('/actor.jpg')).toBe('https://image.tmdb.org/t/p/w185/actor.jpg');
  });

  it('sin ruta, devuelve null (a diferencia de póster/backdrop, sin marcador de posición)', () => {
    expect(tmdbProfileUrl(null)).toBeNull();
  });
});
