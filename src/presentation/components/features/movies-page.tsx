import { SectionHeader, PosterCard } from '@/presentation/components/ui';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { useTrendingMovies } from '@/presentation/hooks/use-trending-movies';
import { useDiscoverMovies } from '@/presentation/hooks/use-discover-movies';
import { toPosterCardData } from '@/presentation/lib/movie-mapper';

export function MoviesPage() {
  const { data: trending, isLoading: trendingLoading } = useTrendingMovies('week', 20);
  const {
    data: topRated,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverMovies({
    sortBy: 'vote_average.desc',
    minVoteCount: 500,
  });

  const masterpieces = (topRated?.pages ?? []).flatMap((page) => page.movies).map(toPosterCardData);

  return (
    <PageContainer className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-lavender">Películas</h1>
        <p className="text-text-secondary max-w-2xl">
          Las mejores películas para disfrutar en casa.
        </p>
      </header>

      <SectionHeader title="Tendencias de la Semana" accentBar />

      {trendingLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" aria-busy="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`skeleton-trending-${String(i)}`}
              className="aspect-[2/3] rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {(trending ?? []).map((movie) => (
            <PosterCard key={movie.id} {...movie} />
          ))}
        </div>
      )}

      {masterpieces.length > 0 && (
        <>
          <SectionHeader title="Obras Maestras del Cine" />
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {masterpieces.map((item) => (
              <PosterCard key={item.id} {...item} />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 text-sm font-medium text-text-primary bg-background-surface rounded-lg hover:bg-background-elevated transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Cargando...' : 'Ver más'}
              </button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
