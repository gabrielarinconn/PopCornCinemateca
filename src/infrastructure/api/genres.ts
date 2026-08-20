    import { z } from 'zod';
    import { tmdbClient } from '../http/tmdb-client';
    import { DomainValidationError } from '../../domain/shared/errors/api-errors';

    export const GenreSchema = z.object({
    id: z.number(),
    name: z.string(),
    });

    export const GenresResponseSchema = z.object({
    genres: z.array(GenreSchema),
    });

    export type GenresResponse = z.infer<typeof GenresResponseSchema>;

    export const getGenres = async (): Promise<GenresResponse> => {
    const { data } = await tmdbClient.get('/genre/movie/list');
    const parsed = GenresResponseSchema.safeParse(data);

    if (!parsed.success) {
        throw new DomainValidationError(`Error de validación en genres: ${parsed.error.message}`);
    }

    return parsed.data;
    };