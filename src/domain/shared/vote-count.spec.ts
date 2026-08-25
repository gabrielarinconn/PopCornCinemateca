import { describe, expect, it } from 'vitest';
import { voteCountLabel } from './vote-count';

describe('voteCountLabel', () => {
  it('en español, usa el separador de miles y el plural "votos"', () => {
    expect(voteCountLabel(26000, 'es')).toBe('26.000 votos');
  });

  it('en español, un solo voto usa el singular "voto"', () => {
    expect(voteCountLabel(1, 'es')).toBe('1 voto');
  });

  it('en inglés (en-US), usa el separador de miles propio del locale', () => {
    expect(voteCountLabel(26000, 'en-US')).toBe('26,000 votos');
  });

  it('en alemán (de-DE), usa el separador de miles propio del locale', () => {
    expect(voteCountLabel(26000, 'de-DE')).toBe('26.000 votos');
  });

  it('cero votos usa el plural', () => {
    expect(voteCountLabel(0, 'es')).toBe('0 votos');
  });
});
