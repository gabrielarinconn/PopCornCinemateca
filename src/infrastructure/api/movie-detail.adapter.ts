import { releaseStatusOf } from '@/domain/shared/release-status';
import { ratingReliabilityFromVotes } from '@/domain/shared/rating-reliability';
import { moneyFromTmdbAmount } from '@/domain/shared/money';
import { resolveMovieOverview } from '@/domain/shared/movie-overview';
import type { MovieDetail, MovieDetailPort } from '@/application/ports/movie-detail.port';
import { getMovieDetails } from './movie';

function findEnglishOverview(
  translations: { iso_639_1: string; data: { overview: string } }[],
): string {
  return translations.find((translation) => translation.iso_639_1 === 'en')?.data.overview ?? '';
}

export function createMovieDetailPort(today: () => Date = () => new Date()): MovieDetailPort {
  return {
    async getMovieDetail(movieId, signal): Promise<MovieDetail> {
      const raw = await getMovieDetails(movieId, 'es-ES', signal);
      const englishOverview = findEnglishOverview(raw.translations?.translations ?? []);

      return {
        id: raw.id,
        title: raw.title,
        overview: resolveMovieOverview(raw.overview, englishOverview),
        posterPath: raw.poster_path,
        backdropPath: raw.backdrop_path,
        releaseStatus: releaseStatusOf(raw.release_date ?? '', today()),
        rating: ratingReliabilityFromVotes(raw.vote_average, raw.vote_count),
        budget: moneyFromTmdbAmount(raw.budget, 'USD'),
        genres: raw.genres.map((genre) => genre.name),
        cast: (raw.credits?.cast ?? []).map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character ?? null,
          profilePath: member.profile_path ?? null,
        })),
        trailers: (raw.videos?.results ?? []).map((video) => ({
          id: video.id,
          key: video.key,
          name: video.name,
          site: video.site,
        })),
      };
    },
  };
}

export const movieDetailPort: MovieDetailPort = createMovieDetailPort();
