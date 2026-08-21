import { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { RootLayout } from '@/presentation/routes/root-layout';

const HomePage = lazy(() => import('./home-page').then((module) => ({ default: module.HomePage })));

const NotFoundPage = lazy(() =>
  import('./not-found-page').then((module) => ({ default: module.NotFoundPage })),
);

const MovieDetailPage = lazy(() =>
  import('./movie-detail-page').then((module) => ({ default: module.MovieDetailPage })),
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
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <HomePage />
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
