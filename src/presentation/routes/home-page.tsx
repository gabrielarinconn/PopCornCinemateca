import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTrendingMovies } from '../../infrastructure/api/trending';
import { MovieCard } from '../components/movie-card';

export function HomePage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trending-movies-week'],
    queryFn: () => getTrendingMovies('week'),
  });

  if (isLoading) {
    return (
      <main className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Tendencias de la semana</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
              data-testid="home-skeleton"
            />
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-semibold">No se pudieron cargar las tendencias</h2>
        <p className="mt-2 text-gray-600">Comprueba tu conexión e inténtalo de nuevo.</p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tendencias de la semana</h1>
        <Link
          to="/explore"
          className="font-medium text-indigo-600 hover:text-indigo-800"
        >
          Explorar todo el catálogo &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {data?.results.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseYear={movie.release_date ? movie.release_date.split('-')[0] : null}
            voteAverage={movie.vote_average}
          />
        ))}
      </div>
    </main>
  );
}