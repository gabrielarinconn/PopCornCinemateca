import { describe, expect, it } from 'vitest';
import { createMoney, formatMoney, moneyFromTmdbAmount } from './money';

describe('moneyFromTmdbAmount', () => {
  it('convierte un monto real de TMDB a Money en centavos', () => {
    expect(moneyFromTmdbAmount(63_000_000, 'USD')).toEqual({
      amountInMinorUnits: 6_300_000_000,
      currency: 'USD',
    });
  });

  it('devuelve undefined cuando TMDB manda 0 — es "sin dato", no "cero dólares"', () => {
    expect(moneyFromTmdbAmount(0, 'USD')).toBeUndefined();
  });

  it('devuelve undefined con un monto negativo', () => {
    expect(moneyFromTmdbAmount(-5, 'USD')).toBeUndefined();
  });
});

describe('formatMoney', () => {
  it('formatea en dólares con locale es', () => {
    const money = createMoney(6_300_000_000, 'USD');
    expect(formatMoney(money, 'es')).toContain('63.000.000');
  });

  it('formatea en dólares con locale en-US', () => {
    const money = createMoney(150_00, 'USD');
    expect(formatMoney(money, 'en-US')).toBe('$150.00');
  });

  it('formatea en dólares con locale de-DE — mismo dato, símbolo y separador distintos', () => {
    const money = createMoney(150_00, 'USD');
    // El espacio antes del símbolo es un espacio de no separación (U+00A0),
    // no uno normal — así es como Intl lo formatea en de-DE.
    expect(formatMoney(money, 'de-DE')).toBe('150,00 $');
  });
});
