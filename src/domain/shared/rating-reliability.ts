import { assertUnreachable } from './exhaustive-check';

const CONSOLIDATED_VOTE_THRESHOLD = 20;

export type RatingReliability =
  | { kind: 'no-votes' }
  | { kind: 'few-votes'; average: number; voteCount: number }
  | { kind: 'consolidated'; average: number; voteCount: number };

/** El texto de "Sin valoraciones" vive en presentation/copy — aquí solo se decide si aplica. */
export function hasRating(reliability: RatingReliability): boolean {
  switch (reliability.kind) {
    case 'no-votes':
      return false;
    case 'few-votes':
    case 'consolidated':
      return true;
    /* v8 ignore next 2 -- TypeScript ya garantiza que es inalcanzable con datos válidos */
    default:
      return assertUnreachable(reliability);
  }
}

/**
 * TMDB manda voteAverage=0 y voteCount=0 tanto para "nadie ha votado" como
 * valor por defecto — aquí es donde ese 0 deja de significar "0,0 de nota"
 * y pasa a significar "sin valoraciones".
 */
export function ratingReliabilityFromVotes(
  voteAverage: number,
  voteCount: number,
): RatingReliability {
  if (voteCount <= 0) return { kind: 'no-votes' };
  if (voteCount < CONSOLIDATED_VOTE_THRESHOLD) {
    return { kind: 'few-votes', average: voteAverage, voteCount };
  }
  return { kind: 'consolidated', average: voteAverage, voteCount };
}
