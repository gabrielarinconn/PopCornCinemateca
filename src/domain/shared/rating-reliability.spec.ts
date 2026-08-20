import { describe, expect, it } from 'vitest';
import { hasRating, ratingReliabilityFromVotes } from './rating-reliability';

describe('ratingReliabilityFromVotes', () => {
  it('es "no-votes" cuando no hay votos — nunca 0,0', () => {
    expect(ratingReliabilityFromVotes(0, 0)).toEqual({ kind: 'no-votes' });
  });

  it('es "few-votes" con pocos votos', () => {
    expect(ratingReliabilityFromVotes(7.5, 5)).toEqual({
      kind: 'few-votes',
      average: 7.5,
      voteCount: 5,
    });
  });

  it('es "consolidated" a partir del umbral de votos', () => {
    expect(ratingReliabilityFromVotes(8.7, 20)).toEqual({
      kind: 'consolidated',
      average: 8.7,
      voteCount: 20,
    });
  });

  it('es "consolidated" con muchos votos', () => {
    expect(ratingReliabilityFromVotes(9.1, 5000)).toEqual({
      kind: 'consolidated',
      average: 9.1,
      voteCount: 5000,
    });
  });
});

describe('hasRating', () => {
  it('es false cuando no hay votos', () => {
    expect(hasRating({ kind: 'no-votes' })).toBe(false);
  });

  it('es true con pocos votos', () => {
    expect(hasRating({ kind: 'few-votes', average: 5, voteCount: 3 })).toBe(true);
  });

  it('es true con votos consolidados', () => {
    expect(hasRating({ kind: 'consolidated', average: 8, voteCount: 500 })).toBe(true);
  });
});
