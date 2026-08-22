import type { ContinueWatchingData, PosterCardData } from './types';

export const mockMyListContinueWatching: readonly ContinueWatchingData[] = [
  {
    id: 'mylist-cw-1',
    title: 'Crónicas de Acero',
    subtitle: 'Temp 1 · Ep 4',
    progress: 55,
    timeRemaining: '42 min restantes',
    imageUrl: 'https://picsum.photos/seed/cronicas-acero/800/450',
    href: '/title/cronicas-acero',
  },
  {
    id: 'mylist-cw-2',
    title: 'Interestelar: El Viaje',
    subtitle: 'Película',
    progress: 72,
    timeRemaining: '1h 18m restantes',
    imageUrl: 'https://picsum.photos/seed/interestelar-viaje/800/450',
    href: '/title/interestelar-viaje',
  },
] as const;

export const mockMyListSaved: readonly PosterCardData[] = [
  {
    id: 'mylist-saved-1',
    title: 'Verdades Ocultas',
    meta: 'Thriller • 2024',
    imageUrl: 'https://picsum.photos/seed/verdades-ocultas/400/600',
    rating: 8.8,
    badge: 'NUEVA TEMP',
    href: '/title/verdades-ocultas',
  },
  {
    id: 'mylist-saved-2',
    title: 'Fracture Point',
    meta: 'Acción • 2023',
    imageUrl: 'https://picsum.photos/seed/fracture-point/400/600',
    rating: 8.2,
    href: '/title/fracture-point',
  },
  {
    id: 'mylist-saved-3',
    title: 'Ecos del Silencio',
    meta: 'Drama • 2024',
    imageUrl: 'https://picsum.photos/seed/ecos-silencio/400/600',
    rating: 9.0,
    href: '/title/ecos-silencio',
  },
  {
    id: 'mylist-saved-4',
    title: 'Horizonte Artificial',
    meta: 'Ciencia Ficción • 2022',
    imageUrl: 'https://picsum.photos/seed/horizonte-artificial/400/600',
    rating: 8.5,
    href: '/title/horizonte-artificial',
  },
] as const;