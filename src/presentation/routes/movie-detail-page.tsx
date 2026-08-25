import { useParams } from 'react-router';
import { z } from 'zod';
import { Star, Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { siteCopy } from '@/presentation/copy/site';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useMovieDetail } from '@/presentation/hooks/use-movie-detail';
import { useMovieRecommendations } from '@/presentation/hooks/use-movie-recommendations';
import { useSaveMovie } from '@/presentation/hooks/use-save-movie';
import { useIsMovieSaved } from '@/presentation/hooks/use-library-movies';
import { formatMoney } from '@/domain/shared/money';
import { voteCountLabel } from '@/domain/shared/vote-count';
import { DomainNotFoundError } from '@/domain/shared/errors/api-errors';
import { tmdbBackdropUrl, tmdbPosterUrl, tmdbProfileUrl } from '@/presentation/lib/tmdb-image';
import { TrailerEmbed } from '@/presentation/components/ui/TrailerEmbed';
import { PosterCard } from '@/presentation/components/ui/PosterCard';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { NotFoundPage } from './not-found-page';
import { toPosterCardData } from '@/presentation/lib/movie-mapper';

const MovieIdParamSchema = z.coerce.number().int().positive();

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
  const navigate = useNavigate();
  const { data: movie, isPending, isError, error, refetch } = useMovieDetail(movieId);
  const { data: recommendations } = useMovieRecommendations(movieId);
  const saveMovie = useSaveMovie();
  const isSaved = useIsMovieSaved(movieId);

  const headingRef = usePageMeta(movie ? `${movie.title} — ${siteCopy.appName}` : siteCopy.appName);

  if (isPending) {
    return (
      <div className="px-6 lg:px-10 pb-32" aria-busy="true">
        <div className="space-y-6">
          <div className="aspect-video w-full rounded-xl bg-background-surface animate-pulse" />
          <div className="h-8 w-64 rounded bg-background-surface animate-pulse" />
          <div className="h-4 w-96 rounded bg-background-surface animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    if (error instanceof DomainNotFoundError) {
      return <NotFoundPage />;
    }
    return (
      <div className="px-6 lg:px-10 pb-32">
        <div className="text-center py-20">
          <p className="text-text-secondary mb-4">{siteCopy.movieDetail.error}</p>
          <Button variant="primary" onClick={() => void refetch()}>
            {siteCopy.movieDetail.retry}
          </Button>
        </div>
      </div>
    );
  }

  const youtubeTrailer = movie.trailers.find((t) => t.site === 'YouTube');

  return (
    <div className="pb-32">
      {/* Backdrop a todo el ancho */}
      <div className="relative w-full h-[50vh] min-h-[320px] max-h-[520px] overflow-hidden bg-background-surface">
        <img
          src={tmdbBackdropUrl(movie.backdropPath ?? movie.posterPath)}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <button
          type="button"
          onClick={() => {
            void navigate('/');
          }}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm text-text-primary text-sm font-medium hover:bg-brand hover:text-white transition-colors"
          aria-label="Volver al inicio"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver a inicio
        </button>

        {youtubeTrailer && (
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeTrailer.key}`}
              target="_blank"
              rel="noreferrer"
              className="w-20 h-20 rounded-full bg-brand/90 text-white flex items-center justify-center shadow-elevated hover:bg-brand transition-colors"
              aria-label={`Reproducir tráiler de ${movie.title}`}
            >
              <Play className="w-8 h-8 ml-1" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Contenido superpuesto al backdrop */}
      <div className="relative -mt-24 z-10 px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="relative aspect-poster rounded-xl overflow-hidden bg-background-surface max-w-[280px] shadow-elevated">
              <img
                src={tmdbPosterUrl(movie.posterPath, 'w500')}
                alt={`Póster de ${movie.title}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary mb-3"
              >
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {movie.rating.kind === 'no-votes' && (
                  <span className="text-sm text-text-muted">{siteCopy.movieDetail.noRatings}</span>
                )}
                {movie.rating.kind !== 'no-votes' && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    <span className="text-sm font-medium text-text-primary">
                      {new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
                        movie.rating.average,
                      )}
                    </span>
                    <span className="text-xs text-text-muted">
                      ({voteCountLabel(movie.rating.voteCount, locale)})
                    </span>
                  </div>
                )}

                {movie.releaseStatus.kind === 'released' && (
                  <span className="text-sm text-text-secondary">
                    {movie.releaseStatus.releaseDate.getFullYear()}
                  </span>
                )}

                {movie.rating.kind === 'few-votes' && (
                  <Badge variant="outline" className="text-xs">
                    {siteCopy.movieDetail.fewVotesNotice}
                  </Badge>
                )}
              </div>

              {movie.overview.isFallbackToEnglish && (
                <p role="note" className="text-text-muted text-sm mb-3 italic">
                  {siteCopy.movieDetail.overviewFallbackNotice}
                </p>
              )}

              <p className="text-text-secondary leading-relaxed">{movie.overview.text}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {youtubeTrailer && (
                <Button
                  variant="primary"
                  icon={Play}
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${youtubeTrailer.key}`, '_blank');
                  }}
                >
                  Reproducir Tráiler
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => {
                  if (!isSaved) {
                    saveMovie.mutate({
                      id: movie.id,
                      title: movie.title,
                      posterPath: movie.posterPath,
                      savedAt: new Date().toISOString(),
                    });
                  }
                }}
              >
                {isSaved ? '✓ En Mi Lista' : '+ Mi Lista'}
              </Button>
            </div>

            <dl className="text-sm">
              <dt className="text-text-muted font-medium">{siteCopy.movieDetail.budgetLabel}</dt>
              <dd className="text-text-secondary">
                {movie.budget ? formatMoney(movie.budget, locale) : siteCopy.movieDetail.noData}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Secciones debajo del hero */}
      <div className="px-6 lg:px-10 space-y-8 mt-10">
        {movie.trailers.filter((t) => t.site === 'YouTube').length > 0 && (
          <section aria-labelledby="trailers-heading">
            <h2 id="trailers-heading" className="text-xl font-bold text-text-primary mb-4">
              {siteCopy.movieDetail.trailersLabel}
            </h2>
            <div className="space-y-4">
              {movie.trailers
                .filter((trailer) => trailer.site === 'YouTube')
                .map((trailer) => (
                  <TrailerEmbed key={trailer.id} videoKey={trailer.key} title={trailer.name} />
                ))}
            </div>
          </section>
        )}

        {movie.cast.length > 0 && (
          <section aria-labelledby="cast-heading">
            <h2 id="cast-heading" className="text-xl font-bold text-text-primary mb-4">
              {siteCopy.movieDetail.castLabel}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
              {movie.cast.slice(0, 12).map((member) => {
                const profileUrl = tmdbProfileUrl(member.profilePath);
                return (
                  <div key={member.id} className="flex-shrink-0 w-24 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-background-surface mb-2">
                      {profileUrl ? (
                        <img
                          src={profileUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-lg font-bold">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-text-primary truncate">{member.name}</p>
                    {member.character && (
                      <p className="text-xs text-text-muted truncate">{member.character}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {recommendations !== undefined && recommendations.length > 0 && (
          <section aria-labelledby="recommendations-heading">
            <h2 id="recommendations-heading" className="text-xl font-bold text-text-primary mb-4">
              {siteCopy.movieDetail.recommendationsLabel}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0">
              {recommendations.slice(0, 8).map((rec) => (
                <PosterCard key={rec.id} {...toPosterCardData(rec)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
