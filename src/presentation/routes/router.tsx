import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/presentation/routes/root-layout';

const HomePage = lazy(() => import('./home-page').then((module) => ({ default: module.HomePage })));

const NotFoundPage = lazy(() =>
  import('./not-found-page').then((module) => ({ default: module.NotFoundPage })),
);

function RouteFallback() {
  return <div aria-busy="true" className="p-8"></div>;
}

export const router = createBrowserRouter([
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
