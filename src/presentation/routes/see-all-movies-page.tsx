import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PosterCard } from '@/presentation/components/ui';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { useDiscoverMovies } from '@/presentation/hooks/use-discover-movies';
import { toPosterCardData } from '@/presentation/lib/movie-mapper';

export function SeeAllMoviesPage() {
  const navigate = useNavigate();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDiscoverMovies({
    sortBy: 'popularity.desc',
  });

  const movies = (data?.pages ?? []).flatMap((page) => page.movies).map(toPosterCardData);

  return (
    <PageContainer className="space-y-6 lg:pt-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Todas las Películas
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" aria-busy="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`skeleton-all-movies-${String(i)}`}
              className="aspect-[2/3] rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {movies.map((movie) => (
            <PosterCard key={movie.id} {...movie} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 text-sm font-medium text-text-primary bg-background-surface rounded-lg hover:bg-background-elevated transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Cargando...' : 'Cargar más películas'}
          </button>
        </div>
      )}

      {!hasNextPage && movies.length > 0 && (
        <p className="text-center text-text-muted text-sm py-4">
          Has visto todas las películas disponibles
        </p>
      )}
    </PageContainer>
  );
}
