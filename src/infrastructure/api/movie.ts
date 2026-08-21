import { z } from 'zod';
import { tmdbClient } from '../http/tmdb-client';
import { DomainValidationError } from '../../domain/shared/errors/api-errors';

// Esquemas secundarios para Créditos (Elenco) y Videos (Tráilers)
const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string().optional(),
  profile_path: z.string().nullable().optional(),
});

const VideoItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
});

const TranslationItemSchema = z.object({
  iso_639_1: z.string(),
  data: z.object({
    overview: z.string(),
  }),
});

// Esquema principal del detalle de la película con 'append_to_response'
export const MovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().optional(),
  vote_average: z.number(),
  vote_count: z.number(),
  budget: z.number(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  credits: z
    .object({
      cast: z.array(CastMemberSchema),
    })
    .optional(),
  videos: z
    .object({
      results: z.array(VideoItemSchema),
    })
    .optional(),
  translations: z
    .object({
      translations: z.array(TranslationItemSchema),
    })
    .optional(),
});

export type MovieDetailResponse = z.infer<typeof MovieDetailSchema>;

export const getMovieDetails = async (
  movieId: number,
  language = 'es-ES',
  signal?: AbortSignal,
): Promise<MovieDetailResponse> => {
  // Petición ÚNICA usando append_to_response: elenco, tráilers y las
  // traducciones (para la sinopsis en inglés si falta la del idioma
  // pedido) llegan todos juntos, sin peticiones adicionales.
  const { data } = await tmdbClient.get<unknown>(`/movie/${String(movieId)}`, {
    params: { append_to_response: 'credits,videos,translations', language },
    ...(signal ? { signal } : {}),
  });

  const parsed = MovieDetailSchema.safeParse(data);

  if (!parsed.success) {
    throw new DomainValidationError(`Error de validación en movie detail: ${parsed.error.message}`);
  }

  return parsed.data;
};
