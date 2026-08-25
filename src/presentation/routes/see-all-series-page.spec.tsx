import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { server } from '@/test/msw/server';

// Servidor MSW global — ver el comentario en configuration.spec.ts.

function tvResult(id: number) {
  return {
    id,
    name: `Serie ${String(id)}`,
    overview: 'sinopsis',
    poster_path: null,
    backdrop_path: null,
    vote_average: 8,
    vote_count: 100,
  };
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

describe('SeeAllSeriesPage', () => {
  it('trae la primera página y carga la siguiente con el botón "Cargar más"', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/discover/tv', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page') ?? '1');
        return HttpResponse.json({
          page,
          results: [tvResult(page)],
          total_pages: 2,
          total_results: 2,
        });
      }),
    );

    renderAt('/explore/series');

    expect(await screen.findByText('Serie 1', {}, { timeout: 5000 })).toBeInTheDocument();

    const loadMoreButton = screen.getByRole('button', { name: 'Cargar más series' });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Serie 2')).toBeInTheDocument();
    });
    expect(screen.getByText('Has visto todas las series disponibles')).toBeInTheDocument();
  });
});
