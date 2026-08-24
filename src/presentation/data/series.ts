import type { PosterCardData, FeaturedBannerData, SeriesFilterOption } from './types';

export const mockSeriesFilters: readonly SeriesFilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'drama', label: 'Drama' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'documentary', label: 'Documentary' },
] as const;

export const mockSeriesFeatured: FeaturedBannerData = {
  id: 'series-featured-1',
  title: 'Ascension',
  description:
    'Una nave espacial de generación viaja hacia un nuevo mundo. Pero cuando se descubre un asesinato a bordo, la verdad sobre su misión sale a la luz.',
  imageUrl: 'https://picsum.photos/seed/ascension-series/1200/675',
  badge: 'NEW SEASON',
  rating: 8.9,
  watermark: 'ASCENSION',
};

export const mockSeriesSecondary: readonly PosterCardData[] = [
  {
    id: 'series-sec-1',
    title: 'The Last Frontier',
    meta: 'Drama · 3 Temporadas',
    imageUrl: 'https://picsum.photos/seed/last-frontier/400/600',
    rating: 8.5,
    href: '/title/last-frontier',
  },
  {
    id: 'series-sec-2',
    title: 'Quantum Leap',
    meta: 'Sci-Fi · 2 Temporadas',
    imageUrl: 'https://picsum.photos/seed/quantum-leap-series/400/600',
    rating: 8.2,
    href: '/title/quantum-leap-series',
  },
] as const;

export const mockSeriesTrending: readonly PosterCardData[] = [
  {
    id: 'series-trend-1',
    title: 'Dark Matter',
    meta: 'Ciencia Ficción • 2023',
    imageUrl: 'https://picsum.photos/seed/dark-matter-series/400/600',
    rating: 9.2,
    href: '/title/dark-matter-series',
  },
  {
    id: 'series-trend-2',
    title: 'The Crowned',
    meta: 'Drama Histórico • 2024',
    imageUrl: 'https://picsum.photos/seed/the-crowned/400/600',
    rating: 8.8,
    badge: 'NUEVA TEMP',
    href: '/title/the-crowned',
  },
  {
    id: 'series-trend-3',
    title: 'Silent Witness',
    meta: 'Crimen • 2022',
    imageUrl: 'https://picsum.photos/seed/silent-witness/400/600',
    rating: 8.4,
    href: '/title/silent-witness',
  },
  {
    id: 'series-trend-4',
    title: 'Stellar Drift',
    meta: 'Ciencia Ficción • 2023',
    imageUrl: 'https://picsum.photos/seed/stellar-drift/400/600',
    rating: 8.1,
    href: '/title/stellar-drift',
  },
  {
    id: 'series-trend-5',
    title: 'Midnight Protocol',
    meta: 'Thriller • 2024',
    imageUrl: 'https://picsum.photos/seed/midnight-protocol/400/600',
    rating: 7.9,
    href: '/title/midnight-protocol',
  },
] as const;
