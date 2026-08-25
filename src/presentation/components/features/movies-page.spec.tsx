import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { server } from '@/test/msw/server';

// Servidor MSW global — ver el comentario en configuration.spec.ts.

function movieResult(id: number, title: string) {
  return {
    id,
    title,
    overview: 'sinopsis',
    poster_path: null,
    backdrop_path: null,
    vote_average: 9.4,
    vote_count: 500,
  };
}

function mockEndpoints() {
  server.use(
    http.get('https://api.themoviedb.org/3/trending/movie/week', () =>
      HttpResponse.json({
        page: 1,
        results: [movieResult(1, 'Nexus Protocol')],
        total_pages: 1,
        total_results: 1,
      }),
    ),
    http.get('https://api.themoviedb.org/3/discover/movie', () =>
      HttpResponse.json({
        page: 1,
        results: [movieResult(2, 'Eclipse Eterno')],
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

describe('MoviesPage', () => {
  it('muestra las tendencias y las obras maestras (mejor valoradas)', async () => {
    mockEndpoints();
    renderAt('/movies');

    expect(await screen.findByText('Nexus Protocol', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText('Eclipse Eterno')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Películas' })).toBeInTheDocument();
  });
});
