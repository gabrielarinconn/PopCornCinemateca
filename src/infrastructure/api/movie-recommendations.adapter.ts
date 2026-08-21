import type { MovieRecommendationsPort } from '@/application/ports/movie-recommendations.port';
import { getMovieRecommendations } from './recommendations';
import { toMovieSummary } from './movie-summary.mapper';

export function createMovieRecommendationsPort(
  today: () => Date = () => new Date(),
): MovieRecommendationsPort {
  return {
    async getRecommendations(movieId, signal) {
      const response = await getMovieRecommendations(movieId, signal);
      const now = today();
      return response.results.map((raw) => toMovieSummary(raw, now));
    },
  };
}

export const movieRecommendationsPort: MovieRecommendationsPort = createMovieRecommendationsPort();
