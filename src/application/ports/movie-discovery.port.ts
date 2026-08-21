import type { RatingReliability } from '@/domain/shared/rating-reliability';
import type { ReleaseStatus } from '@/domain/shared/release-status';

/**
 * Forma que consume la presentación — el dominio ya está aplicado (estado de
 * estreno y fiabilidad de la valoración), no queda ni un `0` ni una cadena
 * vacía cruda de TMDB.
 */
export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseStatus: ReleaseStatus;
  rating: RatingReliability;
}

export interface DiscoverMoviesFilters {
  genreId?: number | undefined;
  year?: number | undefined;
  minVoteAverage?: number | undefined;
  minVoteCount?: number | undefined;
  sortBy?: string | undefined;
}

export interface DiscoverMoviesPage {
  movies: MovieSummary[];
  page: number;
  totalPages: number;
}

/**
 * "Algo que descubre películas con filtros y paginación" — no sabe que
 * existe `discover/movie` de TMDB, ni Axios, ni React. Lo implementa
 * `infrastructure/api/movie-discovery.adapter.ts`.
 */
export interface MovieDiscoveryPort {
  discoverMovies(
    filters: DiscoverMoviesFilters,
    page: number,
    signal?: AbortSignal,
  ): Promise<DiscoverMoviesPage>;
}
