import type { RatingReliability } from '@/domain/shared/rating-reliability';
import type { ReleaseStatus } from '@/domain/shared/release-status';

export interface TvShowSummary {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  releaseStatus: ReleaseStatus;
  rating: RatingReliability;
}

export interface DiscoverTvFilters {
  genreId?: number | undefined;
  minVoteAverage?: number | undefined;
  minVoteCount?: number | undefined;
  sortBy?: string | undefined;
}

export interface DiscoverTvPage {
  shows: TvShowSummary[];
  page: number;
  totalPages: number;
}

export interface TvDiscoveryPort {
  discoverTv(
    filters: DiscoverTvFilters,
    page: number,
    signal?: AbortSignal,
  ): Promise<DiscoverTvPage>;
}
