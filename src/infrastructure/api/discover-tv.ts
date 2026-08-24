import { z } from 'zod';
import { tmdbClient } from '../http/tmdb-client';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';

export const TvShowSummarySchema = z.object({
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

export const DiscoverTvResponseSchema = z.object({
  page: z.number(),
  results: z.array(TvShowSummarySchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type DiscoverTvResponse = z.infer<typeof DiscoverTvResponseSchema>;

export const getDiscoverTv = async (
  params?: Record<string, string | number>,
  signal?: AbortSignal,
): Promise<DiscoverTvResponse> => {
  const { data } = await tmdbClient.get<unknown>('/discover/tv', {
    params,
    ...(signal ? { signal } : {}),
  });
  const parsed = DiscoverTvResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new DomainValidationError(`Error de validación en discover TV: ${parsed.error.message}`);
  }

  return parsed.data;
};
