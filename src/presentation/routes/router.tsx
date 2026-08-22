import { lazy, Suspense } from 'react';
import { createBrowserRouter, redirect } from 'react-router';
import { AppShell } from '@/presentation/components/layout/AppShell';

const NotFoundPage = lazy(() =>
  import('./not-found-page').then((module) => ({ default: module.NotFoundPage })),
);

const ExplorePage = lazy(() => import('@/presentation/components/features/explore-page').then((module) => ({ default: module.ExplorePage })));
const SeriesPage = lazy(() => import('@/presentation/components/features/series-page').then((module) => ({ default: module.SeriesPage })));
const MoviesPage = lazy(() => import('@/presentation/components/features/movies-page').then((module) => ({ default: module.MoviesPage })));
const MyListPage = lazy(() => import('@/presentation/components/features/my-list-page').then((module) => ({ default: module.MyListPage })));

function RouteFallback() {
  return <div aria-busy="true" className="p-8"></div>;
}

export const router = createBrowserRouter([
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
        path: '*',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
