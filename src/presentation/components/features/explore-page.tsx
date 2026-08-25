import { SectionHeader, PosterCard, ContinueWatchingCard } from '@/presentation/components/ui';
import { mockTrending, mockContinueWatching } from '@/presentation/data';
import type { ContinueWatchingData } from '@/presentation/data';

export function ExplorePage() {
  const getContinueWatching = (index: number): ContinueWatchingData =>
    mockContinueWatching[index] as unknown as ContinueWatchingData;

  return (
    <div className="space-y-10 lg:pt-8 pb-32">
      <SectionHeader title="Tendencias Actuales" href="/tendencias" />
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0">
        {mockTrending.map((item) => (
          <PosterCard key={item.id} {...item} />
        ))}
      </div>

      <SectionHeader title="Continuar Viendo" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <ContinueWatchingCard size="lg" {...getContinueWatching(0)} />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <ContinueWatchingCard size="sm" {...getContinueWatching(1)} />
          <ContinueWatchingCard size="sm" {...getContinueWatching(2)} />
        </div>
      </div>
    </div>
  );
}
