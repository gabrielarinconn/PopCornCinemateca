/** Código de moneda ISO 4217, ej. "USD". TMDB siempre reporta en dólares. */
export type CurrencyCode = string;

/**
 * Dinero como entero en la unidad menor de la moneda (centavos para USD),
 * nunca como decimal flotante — la aritmética de punto flotante pierde
 * céntimos con dinero real.
 */
export interface Money {
  amountInMinorUnits: number;
  currency: CurrencyCode;
}

export function createMoney(amountInMinorUnits: number, currency: CurrencyCode): Money {
  return { amountInMinorUnits, currency };
}

/**
 * TMDB reporta presupuesto/recaudación como un número en la unidad MAYOR
 * (dólares enteros) y usa 0 para "no lo sé" — nunca "cero dólares" de
 * verdad. Esta es la línea exacta donde ese 0 deja de significar cero.
 */
export function moneyFromTmdbAmount(rawAmount: number, currency: CurrencyCode): Money | undefined {
  if (rawAmount <= 0) return undefined;
  return createMoney(Math.round(rawAmount * 100), currency);
}

export function formatMoney(money: Money, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(money.amountInMinorUnits / 100);
}
