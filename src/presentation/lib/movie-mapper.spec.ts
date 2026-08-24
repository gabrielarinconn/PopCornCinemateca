import { describe, expect, it } from 'vitest';
import type { MovieSummary } from '@/application/ports/movie-discovery.port';
import { toPosterCardData, toRankedFeatureData } from './movie-mapper';

function movie(overrides: Partial<MovieSummary> = {}): MovieSummary {
  return {
    id: 268,
    title: 'Batman',
    overview: 'Un hombre se disfraza de murciélago para combatir el crimen en Gotham.',
    posterPath: '/batman.jpg',
    releaseStatus: { kind: 'released', releaseDate: new Date('1989-06-23') },
    rating: { kind: 'consolidated', average: 7.2, voteCount: 5000 },
    ...overrides,
  };
}

describe('toPosterCardData', () => {
  it('mapea id, título, imagen y enlace a la ficha', () => {
    const result = toPosterCardData(movie());
    expect(result).toMatchObject({
      id: '268',
      title: 'Batman',
      href: '/pelicula/268',
      imageUrl: 'https://image.tmdb.org/t/p/w500/batman.jpg',
    });
  });

  it('con una película estrenada, usa el año como meta', () => {
    const result = toPosterCardData(movie());
    expect(result.meta).toBe('1989');
  });

  it('con una película sin estrenar pero con fecha válida, igual muestra el año', () => {
    const result = toPosterCardData(
      movie({ releaseStatus: { kind: 'unreleased', releaseDate: new Date('2099-06-15') } }),
    );
    expect(result.meta).toBe('2099');
  });

  it('con una fecha de estreno inválida, cae a "Próximamente"', () => {
    const result = toPosterCardData(
      movie({ releaseStatus: { kind: 'unreleased', releaseDate: new Date('no-es-una-fecha') } }),
    );
    expect(result.meta).toBe('Próximamente');
  });

  it('con fecha desconocida, la meta queda vacía', () => {
    const result = toPosterCardData(movie({ releaseStatus: { kind: 'unknown-date' } }));
    expect(result.meta).toBe('');
  });

  it('sin votos, no expone `rating`', () => {
    const result = toPosterCardData(movie({ rating: { kind: 'no-votes' } }));
    expect(result.rating).toBeUndefined();
  });

  it('con votos, expone el promedio como `rating`', () => {
    const result = toPosterCardData(
      movie({ rating: { kind: 'few-votes', average: 6.1, voteCount: 3 } }),
    );
    expect(result.rating).toBe(6.1);
  });
});

describe('toRankedFeatureData', () => {
  it('usa la sinopsis recortada a 160 caracteres cuando no se da una descripción propia', () => {
    const longOverview = 'x'.repeat(200);
    const result = toRankedFeatureData(movie({ overview: longOverview }), 1);
    expect(result.description).toHaveLength(160);
  });

  it('con una descripción propia, la usa en vez de la sinopsis', () => {
    const result = toRankedFeatureData(movie(), 1, { description: 'Descripción a medida' });
    expect(result.description).toBe('Descripción a medida');
  });

  it('el watermark es la primera palabra del título en mayúsculas', () => {
    const result = toRankedFeatureData(movie({ title: 'Batman Begins' }), 1);
    expect(result.watermark).toBe('BATMAN');
  });

  it('por defecto, `simple` es true a partir del rango 2', () => {
    expect(toRankedFeatureData(movie(), 1).simple).toBe(false);
    expect(toRankedFeatureData(movie(), 2).simple).toBe(true);
  });

  it('`simple` explícito prevalece sobre el valor por defecto del rango', () => {
    expect(toRankedFeatureData(movie(), 1, { simple: true }).simple).toBe(true);
  });
});
