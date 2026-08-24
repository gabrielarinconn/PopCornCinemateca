import { z } from 'zod';
import { tmdbClient } from '../http/tmdb-client';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';

export const TvTrendingItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  first_air_date: z.string().optional(),
  vote_average: z.number(),
  vote_count: z.number(),
  genre_ids: z.array(z.number()).optional(),
});

export const TrendingTvResponseSchema = z.object({
  page: z.number(),
  results: z.array(TvTrendingItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TrendingTvResponse = z.infer<typeof TrendingTvResponseSchema>;

export const getTrendingTv = async (
  timeWindow: 'day' | 'week' = 'week',
  signal?: AbortSignal,
): Promise<TrendingTvResponse> => {
  const { data } = await tmdbClient.get<unknown>(`/trending/tv/${timeWindow}`, {
    ...(signal ? { signal } : {}),
  });
  const parsed = TrendingTvResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new DomainValidationError(`Error de validación en trending TV: ${parsed.error.message}`);
  }

  return parsed.data;
};
