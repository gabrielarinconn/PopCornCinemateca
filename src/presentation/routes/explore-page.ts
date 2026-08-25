import { z } from 'zod';

export const exploreParamsSchema = z.object({
  genre: z.string().optional(),
  year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  minRating: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(0).max(10))
    .optional(),
  minVotes: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(0))
    .optional(),
  sortBy: z
    .enum(['popularity.desc', 'vote_average.desc', 'primary_release_date.desc'])
    .optional()
    .default('popularity.desc'),
  page: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1))
    .optional()
    .default(1),
});

export type ExploreParams = z.infer<typeof exploreParamsSchema>;

export function parseExploreParams(searchParams: URLSearchParams): ExploreParams {
  const rawParams = Object.fromEntries(searchParams.entries());
  const parsed = exploreParamsSchema.safeParse(rawParams);

  if (!parsed.success) {
    return { sortBy: 'popularity.desc', page: 1 };
  }

  return parsed.data;
}
