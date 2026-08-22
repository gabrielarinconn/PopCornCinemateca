import type { MovieSummary } from './movie-discovery.port';

export interface MovieSearchPage {
  movies: MovieSummary[];
  page: number;
  totalPages: number;
}

/**
 * "Algo que busca películas por texto libre, paginado" — no sabe que existe
 * `search/movie` de TMDB, ni Axios, ni React. Lo implementa
 * `infrastructure/api/movie-search.adapter.ts`.
 */
export interface MovieSearchPort {
  searchMovies(query: string, page: number, signal?: AbortSignal): Promise<MovieSearchPage>;
}
