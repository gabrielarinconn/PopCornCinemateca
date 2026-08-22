import type { PosterCardData, RankedFeatureData } from './types';
import type { EmptyPosterCardProps } from '@/presentation/components/ui/EmptyPosterCard';

export const mockTop10: readonly RankedFeatureData[] = [
  {
    id: 'movie-top-1',
    rank: 1,
    title: 'Eclipse Eterno',
    description:
      'Una historia de amor que trasciende el tiempo y el espacio, donde dos almas se reencuentran a través de múltiples vidas.',
    meta: 'Romance / Ciencia Ficción • 2024 • 2h 18m',
    imageUrl: 'https://picsum.photos/seed/eclipse-eterno/1200/675',
    badge: 'NUEVO',
    rating: 9.4,
    watermark: 'ECLIPSE',
  },
  {
    id: 'movie-top-2',
    rank: 2,
    title: 'The Last Algorithm',
    meta: 'Thriller • 2023 • 1h 55m',
    imageUrl: 'https://picsum.photos/seed/last-algorithm/400/600',
    rating: 8.9,
    simple: true,
  },
  {
    id: 'movie-top-3',
    rank: 3,
    title: 'Neon Shadows',
    meta: 'Noir Cyberpunk • 2024 • 2h 05m',
    imageUrl: 'https://picsum.photos/seed/neon-shadows/400/600',
    rating: 8.7,
    simple: true,
  },
] as const;

export const mockMasterpieces: readonly PosterCardData[] = [
  {
    id: 'movie-master-1',
    title: 'El Eco de la Noche',
    meta: 'Drama • 2021',
    imageUrl: 'https://picsum.photos/seed/eco-noche/400/600',
    rating: 9.6,
    href: '/title/eco-noche',
  },
  {
    id: 'movie-master-2',
    title: 'Memorias del Futuro',
    meta: 'Ciencia Ficción • 2019',
    imageUrl: 'https://picsum.photos/seed/memorias-futuro/400/600',
    rating: 9.3,
    href: '/title/memorias-futuro',
  },
  {
    id: 'movie-master-3',
    title: 'La Última Frontera',
    meta: 'Aventura • 2020',
    imageUrl: 'https://picsum.photos/seed/ultima-frontera/400/600',
    rating: 9.1,
    href: '/title/ultima-frontera',
  },
] as const;

export const mockEmptyPoster: EmptyPosterCardProps = {
  title: 'Ecos del Pasado',
  meta: 'Misterio • 2023',
  href: '/title/ecos-pasado',
};