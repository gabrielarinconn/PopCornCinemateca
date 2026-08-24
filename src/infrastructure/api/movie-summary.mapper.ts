import { releaseStatusOf } from '@/domain/shared/release-status';
import { ratingReliabilityFromVotes } from '@/domain/shared/rating-reliability';
import type { MovieSummary } from '@/application/ports/movie-discovery.port';
import type { MovieSummarySchema } from './discover';
import type { z } from 'zod';

type RawMovieSummary = z.infer<typeof MovieSummarySchema>;

/** Aplica el dominio (estado de estreno, fiabilidad de la valoración) en el borde. */
export function toMovieSummary(raw: RawMovieSummary, today: Date): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseStatus: releaseStatusOf(raw.release_date ?? '', today),
    rating: ratingReliabilityFromVotes(raw.vote_average, raw.vote_count),
  };
}
