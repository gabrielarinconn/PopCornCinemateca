import type { MovieSearchPort } from '@/application/ports/movie-search.port';
import { searchMovies } from './search';
import { toMovieSummary } from './movie-summary.mapper';

/** TMDB no sirve más allá de esto, aunque `total_pages` diga otra cosa. */
export const MAX_SEARCH_PAGE = 500;

export function createMovieSearchPort(today: () => Date = () => new Date()): MovieSearchPort {
  return {
    async searchMovies(query, page, signal) {
      if (page > MAX_SEARCH_PAGE) {
        return { movies: [], page, totalPages: MAX_SEARCH_PAGE };
      }

      const response = await searchMovies(query, page, signal);
      const now = today();

      return {
        movies: response.results.map((raw) => toMovieSummary(raw, now)),
        page: response.page,
        totalPages: Math.min(response.total_pages, MAX_SEARCH_PAGE),
      };
    },
  };
}

export const movieSearchPort: MovieSearchPort = createMovieSearchPort();
