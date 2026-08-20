    import { z } from 'zod';
    import { tmdbClient } from '../http/tmdb-client';
    import { DomainValidationError } from '../../domain/shared/errors/api-errors';

    export const MovieSummarySchema = z.object({
    id: z.number(),
    title: z.string(),
    overview: z.string(),
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable(),
    release_date: z.string().optional(),
    vote_average: z.number(),
    genre_ids: z.array(z.number()).optional(),
    });

    export const DiscoverResponseSchema = z.object({
    page: z.number(),
    results: z.array(MovieSummarySchema),
    total_pages: z.number(),
    total_results: z.number(),
    });

    export type DiscoverResponse = z.infer<typeof DiscoverResponseSchema>;

    export const getDiscoverMovies = async (params?: Record<string, string | number>): Promise<DiscoverResponse> => {
    const { data } = await tmdbClient.get('/discover/movie', { params });
    const parsed = DiscoverResponseSchema.safeParse(data);

    if (!parsed.success) {
        throw new DomainValidationError(`Error de validación en discover: ${parsed.error.message}`);
    }

    return parsed.data;
    };