import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  SectionHeader,
  PosterCard,
  FilterPillGroup,
} from '@/presentation/components/ui';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { useTrendingTv } from '@/presentation/hooks/use-trending-tv';
import { useDiscoverTv } from '@/presentation/hooks/use-discover-tv';
import { toTvPosterCardData } from '@/presentation/lib/tv-mapper';

const SERIES_FILTERS = ['All', 'Drama', 'Sci-Fi', 'Acción', 'Comedia'];

export function SeriesPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { data: trendingTv, isLoading } = useTrendingTv('week', 20);
  const {
    data: popularTv,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverTv({ sortBy: 'popularity.desc' });

  const popularShows = (popularTv?.pages ?? []).flatMap((page) => page.shows).map(toTvPosterCardData);

  return (
    <PageContainer className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-lavender">Series</h1>
        <p className="text-text-secondary max-w-2xl">
          Narrativas inmersivas que te atrapan desde el primer episodio.
        </p>
      </header>

      <FilterPillGroup
        options={SERIES_FILTERS}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      <SectionHeader title="Tendencias de la Semana" icon={TrendingUp} />

      {isLoading ? (
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
          {(trendingTv ?? []).map((show) => (
            <PosterCard key={show.id} {...show} />
          ))}
        </div>
      )}

      {popularShows.length > 0 && (
        <>
          <SectionHeader title="Series Populares" />
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
    </PageContainer>
  );
}
