import { z } from 'zod';

const envSchema = z.object({
  VITE_TMDB_TOKEN: z.string().min(1, 'Falta el API Read Access Token de TMDB'),
  VITE_TMDB_API_BASE: z.url().default('https://api.themoviedb.org'),
  VITE_TMDB_IMAGE_BASE: z.url().default('https://image.tmdb.org/t/p'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Configuración inválida de variables de entorno:\n${issues}`);
}

export const env = parsed.data;
