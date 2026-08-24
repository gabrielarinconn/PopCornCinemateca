import type { MovieSummary } from './movie-discovery.port';

/** "Algo que trae películas recomendadas a partir de una película" */
export interface MovieRecommendationsPort {
  getRecommendations(movieId: number, signal?: AbortSignal): Promise<MovieSummary[]>;
}
