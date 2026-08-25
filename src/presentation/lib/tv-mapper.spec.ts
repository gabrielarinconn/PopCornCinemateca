import { describe, expect, it } from 'vitest';
import type { TvShowSummary } from '@/application/ports/tv-discovery.port';
import { toTvPosterCardData } from './tv-mapper';

function show(overrides: Partial<TvShowSummary> = {}): TvShowSummary {
  return {
    id: 1399,
    name: 'Game of Thrones',
    overview: 'Familias nobles luchan por el control del Trono de Hierro.',
    posterPath: '/got.jpg',
    releaseStatus: { kind: 'released', releaseDate: new Date('2011-04-17') },
    rating: { kind: 'consolidated', average: 8.4, voteCount: 20000 },
    ...overrides,
  };
}

describe('toTvPosterCardData', () => {
  it('mapea id, título (desde `name`), imagen y enlace a la serie', () => {
    const result = toTvPosterCardData(show());
    expect(result).toMatchObject({
      id: '1399',
      title: 'Game of Thrones',
      href: '/serie/1399',
      imageUrl: 'https://image.tmdb.org/t/p/w500/got.jpg',
    });
  });

  it('con una serie estrenada, usa el año como meta', () => {
    expect(toTvPosterCardData(show()).meta).toBe('2011');
  });

  it('con una serie sin estrenar pero con fecha válida, igual muestra el año', () => {
    const result = toTvPosterCardData(
      show({ releaseStatus: { kind: 'unreleased', releaseDate: new Date('2099-06-15') } }),
    );
    expect(result.meta).toBe('2099');
  });

  it('con una fecha de estreno inválida, cae a "Próximamente"', () => {
    const result = toTvPosterCardData(
      show({ releaseStatus: { kind: 'unreleased', releaseDate: new Date('no-es-una-fecha') } }),
    );
    expect(result.meta).toBe('Próximamente');
  });

  it('con fecha desconocida, la meta queda vacía', () => {
    expect(toTvPosterCardData(show({ releaseStatus: { kind: 'unknown-date' } })).meta).toBe('');
  });

  it('sin votos, no expone `rating`', () => {
    expect(toTvPosterCardData(show({ rating: { kind: 'no-votes' } })).rating).toBeUndefined();
  });
});
