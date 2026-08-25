import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

function mockEndpoints(onDiscoverRequest?: (genreId: string | null) => void) {
  server.use(
    http.get('https://api.themoviedb.org/3/trending/tv/week', () =>
      HttpResponse.json({
        page: 1,
        results: [tvResult(1, 'Dark Matter')],
        total_pages: 1,
        total_results: 1,
      }),
    ),
    http.get('https://api.themoviedb.org/3/genre/tv/list', () =>
      HttpResponse.json({
        genres: [
          { id: 18, name: 'Drama' },
          { id: 10765, name: 'Sci-Fi' },
        ],
      }),
    ),
    http.get('https://api.themoviedb.org/3/discover/tv', ({ request }) => {
      const genreId = new URL(request.url).searchParams.get('with_genres');
      onDiscoverRequest?.(genreId);
      return HttpResponse.json({
        page: 1,
        results: [tvResult(genreId ? 3 : 2, genreId ? 'Estación Perdida' : 'The Last Frontier')],
        total_pages: 1,
        total_results: 1,
      });
    }),
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

  it('al elegir un género real, filtra las series por ese género', async () => {
    mockEndpoints();
    renderAt('/series');

    const genreFilter = await screen.findByRole('button', { name: 'Drama' }, { timeout: 5000 });
    fireEvent.click(genreFilter);

    expect(await screen.findByText('Estación Perdida')).toBeInTheDocument();
    expect(genreFilter).toHaveAttribute('aria-pressed', 'true');
  });

  it('envía el id real del género elegido como filtro `with_genres`', async () => {
    let capturedGenreId: string | null = null;
    mockEndpoints((genreId) => {
      capturedGenreId = genreId;
    });
    renderAt('/series');

    const genreFilter = await screen.findByRole('button', { name: 'Sci-Fi' }, { timeout: 5000 });
    fireEvent.click(genreFilter);

    await waitFor(() => {
      expect(capturedGenreId).toBe('10765');
    });
  });
});
