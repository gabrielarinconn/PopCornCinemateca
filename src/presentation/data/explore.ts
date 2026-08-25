import type { PosterCardData, ContinueWatchingData } from './types';

export const mockTrending: readonly PosterCardData[] = [
  {
    id: '1',
    title: 'Nexus Protocol',
    meta: 'Ciencia Ficción • 2024',
    imageUrl: 'https://picsum.photos/seed/nexus-protocol/400/600',
    rating: 8.7,
    badge: 'TENDENCIA',
    href: '/title/nexus-protocol',
  },
  {
    id: '2',
    title: 'Crimson Tide',
    meta: 'Drama • 2023',
    imageUrl: 'https://picsum.photos/seed/crimson-tide/400/600',
    rating: 9.1,
    href: '/title/crimson-tide',
  },
  {
    id: '3',
    title: 'Shadow Strike',
    meta: 'Acción • 2024',
    imageUrl: 'https://picsum.photos/seed/shadow-strike/400/600',
    rating: 7.8,
    badge: 'NUEVO',
    href: '/title/shadow-strike',
  },
  {
    id: '4',
    title: 'Whispering Pines',
    meta: 'Terror • 2022',
    imageUrl: 'https://picsum.photos/seed/whispering-pines/400/600',
    rating: 8.3,
    href: '/title/whispering-pines',
  },
] as const;

export const mockContinueWatching: readonly ContinueWatchingData[] = [
  {
    id: 'cw-1',
    title: 'Reinos de Cristal',
    subtitle: 'T2:E4 "La Caída"',
    progress: 65,
    timeRemaining: '36 min restantes',
    imageUrl: 'https://picsum.photos/seed/reinos-cristal/800/450',
    href: '/title/reinos-cristal',
  },
  {
    id: 'cw-2',
    title: 'Stand-Up: Sin Filtro',
    subtitle: 'Temp 1 · Ep 3',
    progress: 42,
    timeRemaining: '28 min restantes',
    imageUrl: 'https://picsum.photos/seed/standup-sin-filtro/800/450',
    href: '/title/standup-sin-filtro',
  },
  {
    id: 'cw-3',
    title: 'Planeta Verde',
    subtitle: 'Documental • Ep 2',
    progress: 78,
    timeRemaining: '15 min restantes',
    imageUrl: 'https://picsum.photos/seed/planeta-verde/800/450',
    href: '/title/planeta-verde',
  },
] as const;
