import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { server } from '@/test/msw/server';
import { mockElementSize } from '@/test/mock-element-size';

// Servidor MSW global — ver el comentario en configuration.spec.ts.

function movieResult(id: number) {
  return {
    id,
    title: `Película ${String(id)}`,
    overview: 'sinopsis',
    poster_path: null,
    backdrop_path: null,
    vote_average: 7,
    vote_count: 50,
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

describe('SeeAllMoviesPage', () => {
  let restoreElementSize: () => void;
  beforeEach(() => {
    // La cuadrícula virtualizada necesita un contenedor con altura real
    // para renderizar filas — jsdom no calcula layout, así que se simula.
    restoreElementSize = mockElementSize(1024, 800);
  });
  afterEach(() => {
    restoreElementSize();
  });

  it('trae la primera página y carga la siguiente con el botón "Cargar más"', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/discover/movie', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page') ?? '1');
        return HttpResponse.json({
          page,
          results: [movieResult(page)],
          total_pages: 2,
          total_results: 2,
        });
      }),
    );

    renderAt('/explore/movies');

    expect(await screen.findByText('Película 1', {}, { timeout: 5000 })).toBeInTheDocument();

    const loadMoreButton = screen.getByRole('button', { name: 'Cargar más películas' });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Película 2')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'Cargar más películas' })).not.toBeInTheDocument();
    expect(screen.getByText('Has visto todas las películas disponibles')).toBeInTheDocument();
  });
});
