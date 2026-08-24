import { assertUnreachable } from './exhaustive-check';

export type ReleaseStatus =
  | { kind: 'unknown-date' }
  | { kind: 'unreleased'; releaseDate: Date }
  | { kind: 'released'; releaseDate: Date };

/**
 * La categoría semántica que la UI usa para elegir el token de color
 * (`--color-status-*`) — el dominio decide QUÉ significa el estado, la UI
 * decide con qué color se ve.
 */
export function releaseStatusVariant(status: ReleaseStatus): 'released' | 'unreleased' | 'unknown' {
  switch (status.kind) {
    case 'released':
      return 'released';
    case 'unreleased':
      return 'unreleased';
    case 'unknown-date':
      return 'unknown';
    /* v8 ignore next 2 -- TypeScript ya garantiza que es inalcanzable con datos válidos */
    default:
      return assertUnreachable(status);
  }
}

/**
 * `today` entra por parámetro a propósito: si la función consultara
 * `new Date()` por dentro, la misma prueba podría dar resultados distintos
 * según el día en que se corra — no sería determinista.
 */
export function releaseStatusOf(rawReleaseDate: string, today: Date): ReleaseStatus {
  if (rawReleaseDate === '') return { kind: 'unknown-date' };

  const releaseDate = new Date(rawReleaseDate);
  return releaseDate.getTime() <= today.getTime()
    ? { kind: 'released', releaseDate }
    : { kind: 'unreleased', releaseDate };
}
