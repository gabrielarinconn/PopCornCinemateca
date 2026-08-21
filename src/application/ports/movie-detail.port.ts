import type { Money } from '@/domain/shared/money';
import type { MovieOverview } from '@/domain/shared/movie-overview';
import type { RatingReliability } from '@/domain/shared/rating-reliability';
import type { ReleaseStatus } from '@/domain/shared/release-status';

export interface CastMember {
  id: number;
  name: string;
  character: string | null;
  profilePath: string | null;
}

export interface TrailerVideo {
  id: string;
  key: string;
  name: string;
  site: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: MovieOverview;
  posterPath: string | null;
  backdropPath: string | null;
  releaseStatus: ReleaseStatus;
  rating: RatingReliability;
  budget: Money | undefined;
  genres: string[];
  cast: CastMember[];
  trailers: TrailerVideo[];
}

/**
 * "Algo que trae la ficha completa de una película" — no sabe que existe
 * `movie/{id}` de TMDB ni su parámetro de expansión.
 */
export interface MovieDetailPort {
  getMovieDetail(movieId: number, signal?: AbortSignal): Promise<MovieDetail>;
}
