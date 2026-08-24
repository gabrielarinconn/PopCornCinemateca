import { releaseStatusOf } from '@/domain/shared/release-status';
import { ratingReliabilityFromVotes } from '@/domain/shared/rating-reliability';
import type { TvShowSummary } from '@/application/ports/tv-discovery.port';
import type { TvShowSummarySchema } from './discover-tv';
import type { z } from 'zod';

type RawTvShowSummary = z.infer<typeof TvShowSummarySchema>;

export function toTvShowSummary(raw: RawTvShowSummary, today: Date): TvShowSummary {
  return {
    id: raw.id,
    name: raw.name,
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseStatus: releaseStatusOf(raw.first_air_date ?? '', today),
    rating: ratingReliabilityFromVotes(raw.vote_average, raw.vote_count),
  };
}
