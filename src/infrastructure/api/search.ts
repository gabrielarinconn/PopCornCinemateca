import { z } from 'zod';
import { tmdbClient } from '../http/tmdb-client';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { MovieSummarySchema } from './discover';

export const SearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSummarySchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const searchMovies = async (
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<SearchResponse> => {
  const { data } = await tmdbClient.get<unknown>('/search/movie', {
    params: { query, page },
    ...(signal ? { signal } : {}),
  });
  const parsed = SearchResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new DomainValidationError(`Error de validación en search: ${parsed.error.message}`);
  }

  return parsed.data;
};
