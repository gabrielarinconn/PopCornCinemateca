import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('combina clases simples', () => {
    expect(cn('p-4', 'text-ink')).toBe('p-4 text-ink');
  });

  it('resuelve el conflicto entre dos paddings, se queda con el último', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('ignora valores falsy', () => {
    expect(cn('p-4', false, undefined, null)).toBe('p-4');
  });
});
