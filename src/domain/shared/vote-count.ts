/** Recuento de votos con separador de miles y plural correcto, vía Intl — nunca a mano. */
export function voteCountLabel(voteCount: number, locale: string): string {
  const pluralRules = new Intl.PluralRules(locale);
  const formattedCount = new Intl.NumberFormat(locale).format(voteCount);
  const word = pluralRules.select(voteCount) === 'one' ? 'voto' : 'votos';
  return `${formattedCount} ${word}`;
}
