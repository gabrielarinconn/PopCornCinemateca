import {
  SectionHeader,
  RankedFeatureCard,
  PosterCard,
  EmptyPosterCard,
  SidebarUserProfile,
} from '@/presentation/components/ui';
import { mockTop10, mockMasterpieces, mockEmptyPoster } from '@/presentation/data';
import type { RankedFeatureData } from '@/presentation/data';

export function MoviesPage() {
  const getRankedFeature = (index: number): RankedFeatureData => mockTop10[index] as unknown as RankedFeatureData;

  return (
    <div className="space-y-10 lg:pt-8 pb-20">
      <SectionHeader title="Top 10 Esta Semana" accentBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RankedFeatureCard {...getRankedFeature(0)} />
        </div>
        <div className="space-y-4">
          {mockTop10.slice(1).map((item) => (
            <RankedFeatureCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      <SectionHeader title="Obras Maestras del Cine" href="/peliculas/clasicas" />
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0">
        {mockMasterpieces.map((item) => (
          <PosterCard key={item.id} {...item} />
        ))}
        <EmptyPosterCard {...mockEmptyPoster} />
      </div>

      <SidebarUserProfile />
    </div>
  );
}