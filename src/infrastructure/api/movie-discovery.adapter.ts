import { releaseStatusOf } from '@/domain/shared/release-status';
import { ratingReliabilityFromVotes } from '@/domain/shared/rating-reliability';
import type {
  DiscoverMoviesFilters,
  MovieDiscoveryPort,
  MovieSummary,
} from '@/application/ports/movie-discovery.port';
import { getDiscoverMovies, type DiscoverResponse } from './discover';

/** TMDB no sirve más allá de esto, aunque `total_pages` diga otra cosa. */
export const MAX_DISCOVER_PAGE = 500;

function buildTmdbParams(
  filters: DiscoverMoviesFilters,
  page: number,
): Record<string, string | number> {
  const params: Record<string, string | number> = { page };

  if (filters.genreId !== undefined) params.with_genres = filters.genreId;
  if (filters.year !== undefined) params.primary_release_year = filters.year;
  if (filters.minVoteAverage !== undefined) params['vote_average.gte'] = filters.minVoteAverage;
  if (filters.minVoteCount !== undefined) params['vote_count.gte'] = filters.minVoteCount;
  if (filters.sortBy !== undefined) params.sort_by = filters.sortBy;

  return params;
}

function toMovieSummary(raw: DiscoverResponse['results'][number], today: Date): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseStatus: releaseStatusOf(raw.release_date ?? '', today),
    rating: ratingReliabilityFromVotes(raw.vote_average, raw.vote_count),
  };
}

export function createMovieDiscoveryPort(today: () => Date = () => new Date()): MovieDiscoveryPort {
  return {
    async discoverMovies(filters, page, signal) {
      if (page > MAX_DISCOVER_PAGE) {
        return { movies: [], page, totalPages: MAX_DISCOVER_PAGE };
      }

      const response = await getDiscoverMovies(buildTmdbParams(filters, page), signal);
      const now = today();

      return {
        movies: response.results.map((raw) => toMovieSummary(raw, now)),
        page: response.page,
        totalPages: Math.min(response.total_pages, MAX_DISCOVER_PAGE),
      };
    },
  };
}

export const movieDiscoveryPort: MovieDiscoveryPort = createMovieDiscoveryPort();
