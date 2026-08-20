    import { z } from 'zod';
    import { tmdbClient } from '../http/tmdb-client';
    import { DomainValidationError } from '../../domain/shared/errors/api-errors';

    export const ConfigurationSchema = z.object({
    images: z.object({
        base_url: z.string(),
        secure_base_url: z.string(),
        backdrop_sizes: z.array(z.string()),
        logo_sizes: z.array(z.string()),
        poster_sizes: z.array(z.string()),
        profile_sizes: z.array(z.string()),
        still_sizes: z.array(z.string()),
    }),
    change_keys: z.array(z.string()),
    });

    export type ConfigurationResponse = z.infer<typeof ConfigurationSchema>;

    export const getConfiguration = async (): Promise<ConfigurationResponse> => {
    const { data } = await tmdbClient.get('/configuration');
    const parsed = ConfigurationSchema.safeParse(data);
    
    if (!parsed.success) {
        throw new DomainValidationError(`Error de validación en configuration: ${parsed.error.message}`);
    }
    
    return parsed.data;
    };