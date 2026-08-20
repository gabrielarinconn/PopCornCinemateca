import { describe, expect, it } from 'vitest';
import { releaseStatusOf, releaseStatusVariant } from './release-status';

describe('releaseStatusOf', () => {
  it('es "unknown-date" cuando TMDB manda fecha vacía', () => {
    expect(releaseStatusOf('', new Date('2026-01-01'))).toEqual({ kind: 'unknown-date' });
  });

  it('es "released" cuando la fecha de estreno ya pasó', () => {
    const result = releaseStatusOf('2020-01-01', new Date('2026-01-01'));
    expect(result.kind).toBe('released');
  });

  it('es "unreleased" cuando la fecha de estreno todavía no llega', () => {
    const result = releaseStatusOf('2030-01-01', new Date('2026-01-01'));
    expect(result.kind).toBe('unreleased');
  });

  it('es "released" el mismo día del estreno (frontera exacta)', () => {
    const result = releaseStatusOf('2026-01-01', new Date('2026-01-01'));
    expect(result.kind).toBe('released');
  });

  it('conserva la fecha de estreno como Date en el resultado', () => {
    const result = releaseStatusOf('2020-06-15', new Date('2026-01-01'));
    if (result.kind !== 'released') throw new Error('esperaba released');
    expect(result.releaseDate.getUTCFullYear()).toBe(2020);
  });
});

describe('releaseStatusVariant', () => {
  it('mapea "released" a la variante "released"', () => {
    expect(releaseStatusVariant({ kind: 'released', releaseDate: new Date() })).toBe('released');
  });

  it('mapea "unreleased" a la variante "unreleased"', () => {
    expect(releaseStatusVariant({ kind: 'unreleased', releaseDate: new Date() })).toBe(
      'unreleased',
    );
  });

  it('mapea "unknown-date" a la variante "unknown"', () => {
    expect(releaseStatusVariant({ kind: 'unknown-date' })).toBe('unknown');
  });
});
