import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/presentation/routes/root-layout';
import { HomePage } from '@/presentation/routes/home-page';
import { NotFoundPage } from '@/presentation/routes/not-found-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
