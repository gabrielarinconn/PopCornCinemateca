import { describe, expect, it } from 'vitest';
import { resolveMovieOverview } from './movie-overview';

describe('resolveMovieOverview', () => {
  it('usa la sinopsis principal cuando existe', () => {
    expect(resolveMovieOverview('Un capo en decadencia...', 'An aging patriarch...')).toEqual({
      text: 'Un capo en decadencia...',
      isFallbackToEnglish: false,
    });
  });

  it('cae al inglés y avisa cuando la sinopsis principal viene vacía', () => {
    expect(resolveMovieOverview('', 'An aging patriarch...')).toEqual({
      text: 'An aging patriarch...',
      isFallbackToEnglish: true,
    });
  });
});
