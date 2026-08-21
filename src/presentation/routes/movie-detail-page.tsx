import { useParams } from 'react-router';
import { z } from 'zod';
import { siteCopy } from '@/presentation/copy/site';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useMovieDetail } from '@/presentation/hooks/use-movie-detail';
import { useMovieRecommendations } from '@/presentation/hooks/use-movie-recommendations';
import { formatMoney } from '@/domain/shared/money';
import { DomainNotFoundError } from '@/domain/shared/errors/api-errors';
import { NotFoundPage } from './not-found-page';

const MovieIdParamSchema = z.coerce.number().int().positive();

function voteCountLabel(voteCount: number, locale: string): string {
  const pluralRules = new Intl.PluralRules(locale);
  const formattedCount = new Intl.NumberFormat(locale).format(voteCount);
  const word = pluralRules.select(voteCount) === 'one' ? 'voto' : 'votos';
  return `${formattedCount} ${word}`;
}

export function MovieDetailPage() {
  const params = useParams<{ movieId: string }>();
  const parsedId = MovieIdParamSchema.safeParse(params.movieId);

  if (!parsedId.success) {
    return <NotFoundPage />;
  }

  return <MovieDetailContent movieId={parsedId.data} />;
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'es';
  const { data: movie, isPending, isError, error, refetch } = useMovieDetail(movieId);
  const { data: recommendations } = useMovieRecommendations(movieId);

  const headingRef = usePageMeta(movie ? `${movie.title} — ${siteCopy.appName}` : siteCopy.appName);

  if (isPending) {
    return (
      <div className="p-8" aria-busy="true">
        {siteCopy.movieDetail.loading}
      </div>
    );
  }

  if (isError) {
    if (error instanceof DomainNotFoundError) {
      return <NotFoundPage />;
    }
    return (
      <div className="p-8">
        <p>{siteCopy.movieDetail.error}</p>
        <button type="button" onClick={() => void refetch()}>
          {siteCopy.movieDetail.retry}
        </button>
      </div>
    );
  }

  return (
    <article className="p-8">
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold">
        {movie.title}
      </h1>

      {movie.overview.isFallbackToEnglish && (
        <p role="note" className="text-ink-muted text-sm">
          {siteCopy.movieDetail.overviewFallbackNotice}
        </p>
      )}
      <p>{movie.overview.text}</p>

      <dl>
        <dt>{siteCopy.movieDetail.budgetLabel}</dt>
        <dd>{movie.budget ? formatMoney(movie.budget, locale) : siteCopy.movieDetail.noData}</dd>
      </dl>

      <p>
        {movie.rating.kind === 'no-votes' && siteCopy.movieDetail.noRatings}
        {movie.rating.kind !== 'no-votes' && (
          <>
            {new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
              movie.rating.average,
            )}
            {' · '}
            {voteCountLabel(movie.rating.voteCount, locale)}
            {movie.rating.kind === 'few-votes' && ` (${siteCopy.movieDetail.fewVotesNotice})`}
          </>
        )}
      </p>

      {movie.cast.length > 0 && (
        <section aria-labelledby="cast-heading">
          <h2 id="cast-heading">{siteCopy.movieDetail.castLabel}</h2>
          <ul>
            {movie.cast.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        </section>
      )}

      {movie.trailers.length > 0 && (
        <section aria-labelledby="trailers-heading">
          <h2 id="trailers-heading">{siteCopy.movieDetail.trailersLabel}</h2>
          <ul>
            {movie.trailers
              .filter((trailer) => trailer.site === 'YouTube')
              .map((trailer) => (
                <li key={trailer.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {trailer.name} ({siteCopy.movieDetail.watchOnYouTube})
                  </a>
                </li>
              ))}
          </ul>
        </section>
      )}

      {recommendations !== undefined && recommendations.length > 0 && (
        <section aria-labelledby="recommendations-heading">
          <h2 id="recommendations-heading">{siteCopy.movieDetail.recommendationsLabel}</h2>
          <ul>
            {recommendations.map((recommendation) => (
              <li key={recommendation.id}>{recommendation.title}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
