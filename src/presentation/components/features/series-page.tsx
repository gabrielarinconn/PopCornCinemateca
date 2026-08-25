import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { SectionHeader, PosterCard, FilterPillGroup } from '@/presentation/components/ui';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { useTrendingTv } from '@/presentation/hooks/use-trending-tv';
import { useDiscoverTv } from '@/presentation/hooks/use-discover-tv';
import { useGenres } from '@/presentation/hooks/use-genres';
import { toTvPosterCardData } from '@/presentation/lib/tv-mapper';

const ALL_GENRES_LABEL = 'Todos';

export function SeriesPage() {
  const { data: trendingTv, isLoading } = useTrendingTv('week', 20);
  const { data: genres } = useGenres('tv');
  const [activeGenre, setActiveGenre] = useState(ALL_GENRES_LABEL);

  const selectedGenreId = genres?.find((genre) => genre.name === activeGenre)?.id;

  const {
    data: popularTv,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverTv({ sortBy: 'popularity.desc', genreId: selectedGenreId });

  const popularShows = (popularTv?.pages ?? [])
    .flatMap((page) => page.shows)
    .map(toTvPosterCardData);
  const genreFilterOptions = [ALL_GENRES_LABEL, ...(genres ?? []).map((genre) => genre.name)];

  return (
    <PageContainer className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-lavender">Series</h1>
        <p className="text-text-secondary max-w-2xl">
          Narrativas inmersivas que te atrapan desde el primer episodio.
        </p>
      </header>

      <FilterPillGroup
        options={genreFilterOptions}
        active={activeGenre}
        onChange={setActiveGenre}
      />

      {popularShows.length > 0 && (
        <>
          <SectionHeader
            title={activeGenre === ALL_GENRES_LABEL ? 'Series Populares' : `Género: ${activeGenre}`}
          />
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {popularShows.map((show) => (
              <PosterCard key={show.id} {...show} />
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

      <SectionHeader title="Tendencias de la Semana" icon={TrendingUp} />

      {isLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" aria-busy="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`skeleton-trending-${String(i)}`}
              className="aspect-poster rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {(trendingTv ?? []).map((show) => (
            <PosterCard key={show.id} {...show} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
