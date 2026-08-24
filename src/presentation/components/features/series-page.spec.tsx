import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { server } from '@/test/msw/server';

// Servidor MSW global — ver el comentario en configuration.spec.ts.

function tvResult(id: number, name: string) {
  return {
    id,
    name,
    overview: 'sinopsis',
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.4,
    vote_count: 20000,
  };
}

function mockEndpoints() {
  server.use(
    http.get('https://api.themoviedb.org/3/trending/tv/week', () =>
      HttpResponse.json({
        page: 1,
        results: [tvResult(1, 'Dark Matter')],
        total_pages: 1,
        total_results: 1,
      }),
    ),
    http.get('https://api.themoviedb.org/3/discover/tv', () =>
      HttpResponse.json({
        page: 1,
        results: [tvResult(2, 'The Last Frontier')],
        total_pages: 1,
        total_results: 1,
      }),
    ),
  );
}

function renderAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

describe('SeriesPage', () => {
  it('muestra las tendencias y las series populares', async () => {
    mockEndpoints();
    renderAt('/series');

    expect(await screen.findByText('Dark Matter', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText('The Last Frontier')).toBeInTheDocument();
  });

  it('al elegir un filtro, se marca como activo', async () => {
    mockEndpoints();
    renderAt('/series');
    await screen.findByText('Dark Matter', {}, { timeout: 5000 });

    const dramaFilter = screen.getByRole('button', { name: 'Drama' });
    expect(dramaFilter).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(dramaFilter);
    expect(dramaFilter).toHaveAttribute('aria-pressed', 'true');
  });
});
