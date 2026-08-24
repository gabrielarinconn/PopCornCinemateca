import { z } from 'zod';
import { tmdbClient } from '../http/tmdb-client';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';
import { MovieSummarySchema } from './discover';

export const RecommendationsResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSummarySchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

export const getMovieRecommendations = async (
  movieId: number,
  signal?: AbortSignal,
): Promise<RecommendationsResponse> => {
  const { data } = await tmdbClient.get<unknown>(`/movie/${String(movieId)}/recommendations`, {
    ...(signal ? { signal } : {}),
  });
  const parsed = RecommendationsResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new DomainValidationError(
      `Error de validación en recommendations: ${parsed.error.message}`,
    );
  }

  return parsed.data;
};
