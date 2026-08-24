import { useNavigate } from 'react-router';
import { Play, Star } from 'lucide-react';
import {
  SectionHeader,
  PosterCard,
} from '@/presentation/components/ui';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { useTrendingMovies } from '@/presentation/hooks/use-trending-movies';
import { useTrendingTv } from '@/presentation/hooks/use-trending-tv';

function FeaturedCard({ title, subtitle, rating, imageUrl, onClick }: {
  title: string;
  subtitle: string;
  rating?: number;
  imageUrl: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex-shrink-0 w-[280px] lg:w-full aspect-[16/7] rounded-xl overflow-hidden bg-background-surface group cursor-pointer text-left"
    >
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center gap-2 mb-1">
          {rating !== undefined && rating > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-yellow-400">
              <Star className="w-3 h-3 fill-yellow-400" />
              {rating.toFixed(1)}
            </span>
          )}
          <span className="text-xs text-text-muted">{subtitle}</span>
        </div>
        <h3 className="text-sm font-bold text-text-primary line-clamp-1">{title}</h3>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-brand/90 text-white flex items-center justify-center shadow-elevated">
          <Play className="w-4 h-4 ml-0.5" />
        </div>
      </div>
    </button>
  );
}

export function ExplorePage() {
  const navigate = useNavigate();
  const { data: trendingMovies, isLoading: trendingMoviesLoading } = useTrendingMovies('week', 20);
  const { data: trendingTv, isLoading: trendingTvLoading } = useTrendingTv('week', 20);

  const featuredMovies = trendingMovies?.slice(0, 3) ?? [];
  const restMovies = trendingMovies?.slice(3, 20) ?? [];

  const featuredShows = trendingTv?.slice(0, 3) ?? [];
  const restShows = trendingTv?.slice(3, 20) ?? [];

  return (
    <PageContainer className="space-y-10">
      {/* Destacadas: Películas */}
      {featuredMovies.length > 0 && (
        <>
          <h2 className="text-3xl font-extrabold text-text-lavender tracking-tight">Top 3</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {featuredMovies.map((movie) => (
              <FeaturedCard
                key={movie.id}
                title={movie.title}
                subtitle={movie.meta}
                rating={movie.rating}
                imageUrl={movie.imageUrl}
                onClick={() => navigate(`/pelicula/${movie.id}`)}
              />
            ))}
          </div>
        </>
      )}

      <SectionHeader
        title="Películas Populares"
        href="/movies"
      />

      {trendingMoviesLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" aria-busy="true">
          {Array.from({ length: 17 }).map((_, i) => (
            <div
              key={`skeleton-movies-${String(i)}`}
              className="aspect-[2/3] rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {restMovies.map((movie) => (
            <PosterCard key={movie.id} {...movie} />
          ))}
        </div>
      )}

      {/* Destacadas: Series */}
      {featuredShows.length > 0 && (
        <>
          <h2 className="text-3xl font-extrabold text-text-lavender tracking-tight">Top 3</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {featuredShows.map((show) => (
              <FeaturedCard
                key={show.id}
                title={show.title}
                subtitle={show.meta}
                rating={show.rating}
                imageUrl={show.imageUrl}
                onClick={() => navigate(`/serie/${show.id}`)}
              />
            ))}
          </div>
        </>
      )}

      <SectionHeader
        title="Series Populares"
        href="/series"
      />

      {trendingTvLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" aria-busy="true">
          {Array.from({ length: 17 }).map((_, i) => (
            <div
              key={`skeleton-series-${String(i)}`}
              className="aspect-[2/3] rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {restShows.map((show) => (
            <PosterCard key={show.id} {...show} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
