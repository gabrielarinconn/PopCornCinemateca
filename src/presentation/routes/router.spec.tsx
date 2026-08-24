import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/presentation/components/layout/AppShell';
import { ExplorePage } from '@/presentation/components/features/explore-page';

function NotFoundPage() {
  return <h1>Página no encontrada</h1>;
}

const testRouter = createMemoryRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, loader: () => ({}) },
        { path: 'explore', element: <ExplorePage /> },
        { path: 'series', element: <div>Series</div> },
        { path: 'movies', element: <div>Movies</div> },
        { path: 'my-list', element: <div>MyList</div> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { initialEntries: ['/'] },
);

describe('router', () => {
  it('muestra la sidebar con el nombre del sitio en la ruta raíz', () => {
    render(<RouterProvider router={testRouter} />);
    expect(screen.getByRole('link', { name: 'popCorn - Inicio' })).toBeInTheDocument();
  });

  it('muestra la página de "no encontrado" en una ruta inexistente', () => {
    const notFoundRouter = createMemoryRouter(
      [
        {
          path: '/',
          element: <AppShell />,
          children: [{ path: '*', element: <NotFoundPage /> }],
        },
      ],
      { initialEntries: ['/esto-no-existe'] },
    );
    render(<RouterProvider router={notFoundRouter} />);
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });
});
