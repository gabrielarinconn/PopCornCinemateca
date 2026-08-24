import { lazy, Suspense } from 'react';
import { createBrowserRouter, redirect, type RouteObject } from 'react-router';
import { AppShell } from '@/presentation/components/layout/AppShell';

const ExplorePage = lazy(() =>
  import('@/presentation/components/features/explore-page').then((module) => ({
    default: module.ExplorePage,
  })),
);

const SeriesPage = lazy(() =>
  import('@/presentation/components/features/series-page').then((module) => ({
    default: module.SeriesPage,
  })),
);

const MoviesPage = lazy(() =>
  import('@/presentation/components/features/movies-page').then((module) => ({
    default: module.MoviesPage,
  })),
);

const MyListPage = lazy(() =>
  import('@/presentation/components/features/my-list-page').then((module) => ({
    default: module.MyListPage,
  })),
);

const NotFoundPage = lazy(() =>
  import('./not-found-page').then((module) => ({ default: module.NotFoundPage })),
);

const MovieDetailPage = lazy(() =>
  import('./movie-detail-page').then((module) => ({ default: module.MovieDetailPage })),
);

const SearchPage = lazy(() =>
  import('./search-page').then((module) => ({ default: module.SearchPage })),
);

function RouteFallback() {
  return <div aria-busy="true" className="p-8"></div>;
}

// Se exporta separado de `router` para que las pruebas puedan armar un
// router de memoria con la misma configuración y simular una URL abierta
// directamente (recarga dura), no solo una navegación interna.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        loader: () => redirect('/explore'),
      },
      {
        path: 'explore',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ExplorePage />
          </Suspense>
        ),
      },
      {
        path: 'series',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <SeriesPage />
          </Suspense>
        ),
      },
      {
        path: 'movies',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <MoviesPage />
          </Suspense>
        ),
      },
      {
        path: 'my-list',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <MyListPage />
          </Suspense>
        ),
      },
      {
        path: 'pelicula/:movieId',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <MovieDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'buscar',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
