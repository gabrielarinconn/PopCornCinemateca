import { describe, expect, it } from 'vitest';
import { formatDuration } from './duration';

describe('formatDuration', () => {
  it('formatea horas y minutos en español', () => {
    expect(formatDuration(135, 'es')).toBe('2 h 15 min');
  });

  it('formatea solo minutos cuando dura menos de una hora', () => {
    expect(formatDuration(45, 'es')).toBe('45 min');
  });

  it('formatea una duración exacta de horas sin minutos sueltos', () => {
    expect(formatDuration(120, 'es')).toBe('2 h 0 min');
  });
});
