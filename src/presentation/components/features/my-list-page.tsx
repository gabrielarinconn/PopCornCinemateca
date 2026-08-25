import { Bookmark } from 'lucide-react';
import { Link } from 'react-router';
import { PosterCard } from '@/presentation/components/ui';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { useLibraryMovies } from '@/presentation/hooks/use-library-movies';
import { useRemoveMovie } from '@/presentation/hooks/use-remove-movie';
import { tmdbPosterUrl } from '@/presentation/lib/tmdb-image';

export function MyListPage() {
  const { data: savedMovies, isLoading } = useLibraryMovies();
  const removeMovie = useRemoveMovie();

  const movies = savedMovies ?? [];

  return (
    <PageContainer className="space-y-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-lavender">Mi Lista</h1>
          <p className="text-text-secondary mt-1">
            {movies.length > 0
              ? `${String(movies.length)} ${movies.length === 1 ? 'película guardada' : 'películas guardadas'}.`
              : 'Tus películas y series guardadas para ver después.'}
          </p>
        </div>
        <Link
          to="/listas"
          className="text-sm font-medium text-brand hover:text-brand-hover transition-colors whitespace-nowrap"
        >
          Mis listas temáticas
        </Link>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-list-${String(i)}`}
              className="aspect-[2/3] rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group">
              <PosterCard
                title={movie.title}
                meta={new Date(movie.savedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                imageUrl={tmdbPosterUrl(movie.posterPath)}
                href={`/pelicula/${String(movie.id)}`}
              />
              <button
                type="button"
                onClick={() => {
                  removeMovie.mutate(movie.id);
                }}
                className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-danger/80 text-white flex items-center justify-center text-sm font-bold hover:bg-danger transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Eliminar ${movie.title}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Bookmark className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-text-secondary text-lg mb-2">Tu lista está vacía</p>
          <p className="text-text-muted text-sm text-center max-w-md">
            Explora películas y series, y guárdalas aquí haciendo clic en el botón de "Mi Lista".
          </p>
        </div>
      )}
    </PageContainer>
  );
}
