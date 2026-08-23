import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  SectionHeader,
  FeaturedBanner,
  PosterCard,
  FilterPillGroup,
  SidebarUserProfile,
  MiniPlayerBar,
} from '@/presentation/components/ui';
import {
  mockSeriesFilters,
  mockSeriesFeatured,
  mockSeriesSecondary,
  mockSeriesTrending,
} from '@/presentation/data';

export function SeriesPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="space-y-10 lg:pt-8 pb-32">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary">Series</h1>
        <p className="text-text-secondary max-w-2xl">
          Narrativas inmersivas que te atrapan desde el primer episodio.
        </p>
      </header>

      <FilterPillGroup
        options={mockSeriesFilters.map((f) => f.label)}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeaturedBanner {...mockSeriesFeatured} />
        </div>
        <div className="space-y-4">
          {mockSeriesSecondary.map((item) => (
            <div
              key={item.id}
              className="relative aspect-video rounded-xl overflow-hidden bg-background-surface group"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="font-medium text-text-primary line-clamp-1">{item.title}</h3>
                <p className="text-xs text-text-secondary">{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader title="Trending Now" icon={TrendingUp} />
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0">
        {mockSeriesTrending.map((item) => (
          <PosterCard key={item.id} {...item} />
        ))}
      </div>

      <MiniPlayerBar
        title="Ascension (T3:E1)"
        thumbnailUrl="https://picsum.photos/seed/ascension-thumb/200/200"
        isPlaying={false}
        progress={35}
      />

      <SidebarUserProfile name="Alex M." isPremium={true} />
    </div>
  );
}