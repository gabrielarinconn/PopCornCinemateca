/** Duración en formato humano (ej. "2 h 15 min") vía Intl, nunca a mano. */
export function formatDuration(totalMinutes: number, locale: string): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(
      new Intl.NumberFormat(locale, { style: 'unit', unit: 'hour', unitDisplay: 'short' }).format(
        hours,
      ),
    );
  }
  parts.push(
    new Intl.NumberFormat(locale, { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format(
      minutes,
    ),
  );

  return parts.join(' ');
}
