    import { z } from 'zod';
    import { tmdbClient } from '../http/tmdb-client';
    import { DomainValidationError } from '../../domain/shared/errors/api-errors';
    import { MovieSummarySchema } from './discover';

    export const TrendingResponseSchema = z.object({
    page: z.number(),
    results: z.array(MovieSummarySchema),
    total_pages: z.number(),
    total_results: z.number(),
    });

    export type TrendingResponse = z.infer<typeof TrendingResponseSchema>;

    export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'day'): Promise<TrendingResponse> => {
    const { data } = await tmdbClient.get(`/trending/movie/${timeWindow}`);
    const parsed = TrendingResponseSchema.safeParse(data);

    if (!parsed.success) {
        throw new DomainValidationError(`Error de validación en trending: ${parsed.error.message}`);
    }

    return parsed.data;
    };