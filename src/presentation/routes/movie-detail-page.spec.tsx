import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { server } from '@/test/msw/server';

// Servidor MSW global — ver el comentario en configuration.spec.ts.

function baseMovieResponse(overrides: Record<string, unknown> = {}) {
  return {
    id: 550,
    title: 'Fight Club',
    overview: 'Un hombre insomne...',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 26000,
    budget: 63000000,
    genres: [{ id: 18, name: 'Drama' }],
    credits: { cast: [] },
    videos: { results: [] },
    translations: {
      translations: [{ iso_639_1: 'en', data: { overview: 'An insomniac office worker...' } }],
    },
    ...overrides,
  };
}

function mockMovieEndpoint(overrides: Record<string, unknown> = {}) {
  server.use(
    http.get('https://api.themoviedb.org/3/movie/550', () =>
      HttpResponse.json(baseMovieResponse(overrides)),
    ),
    http.get('https://api.themoviedb.org/3/movie/550/recommendations', () =>
      HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
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

describe('Ficha de película', () => {
  it('un presupuesto en 0 se ve como "Sin dato", nunca como "$0"', async () => {
    mockMovieEndpoint({ budget: 0 });
    renderAt('/pelicula/550');

    // Este es el primer render del chunk perezoso de MovieDetailPage en el
    // archivo — el timeout por defecto (1s) a veces no alcanza cuando corre
    // junto al resto de la suite. Las demás pruebas del archivo, con el
    // chunk ya resuelto, no necesitan este margen extra.
    expect(await screen.findByText('Sin dato', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });

  it('sin votos se ve como "Sin valoraciones", nunca como 0,0', async () => {
    mockMovieEndpoint({ vote_average: 0, vote_count: 0 });
    renderAt('/pelicula/550');

    expect(await screen.findByText('Sin valoraciones')).toBeInTheDocument();
  });

  it('una sinopsis vacía en español ofrece la versión en inglés con su aviso', async () => {
    mockMovieEndpoint({ overview: '' });
    renderAt('/pelicula/550');

    expect(await screen.findByText('An insomniac office worker...')).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(/no está disponible en español/);
  });

  it('se resuelve con una sola petición a /movie/{id}', async () => {
    const networkSpy = vi.fn();
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () => {
        networkSpy();
        return HttpResponse.json(baseMovieResponse());
      }),
      http.get('https://api.themoviedb.org/3/movie/550/recommendations', () =>
        HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      ),
    );
    renderAt('/pelicula/550');

    await screen.findByRole('heading', { name: 'Fight Club' });
    expect(networkSpy).toHaveBeenCalledTimes(1);
  });

  it('al entrar a la ruta, mueve el foco al encabezado y actualiza el <title>', async () => {
    mockMovieEndpoint();
    renderAt('/pelicula/550');

    const heading = await screen.findByRole('heading', { name: 'Fight Club' });
    await waitFor(() => {
      expect(document.title).toBe('Fight Club — Cineteca');
    });
    expect(heading).toHaveFocus();
  });

  it('abrir la URL de la ficha directamente (recarga dura) reproduce la misma vista', async () => {
    mockMovieEndpoint();
    // `renderAt` arma un router de memoria con initialEntries apuntando
    // directo a la ruta — no hay navegación previa desde otra pantalla,
    // exactamente como al pegar el enlace en una pestaña nueva.
    renderAt('/pelicula/550');

    expect(await screen.findByRole('heading', { name: 'Fight Club' })).toBeInTheDocument();
    expect(screen.getByText('Un hombre insomne...')).toBeInTheDocument();
  });

  it('una ruta con un id que no es un número muestra "no encontrado" en vez de romperse', async () => {
    renderAt('/pelicula/no-es-un-id');

    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
  });

  it('muestra elenco, tráilers de YouTube y recomendadas cuando vienen presentes', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () =>
        HttpResponse.json(
          baseMovieResponse({
            credits: { cast: [{ id: 1, name: 'Edward Norton', character: 'The Narrator' }] },
            videos: {
              results: [
                {
                  id: 'v1',
                  key: 'abc123',
                  name: 'Official Trailer',
                  site: 'YouTube',
                  type: 'Trailer',
                },
                {
                  id: 'v2',
                  key: 'def456',
                  name: 'Clip en otro sitio',
                  site: 'Vimeo',
                  type: 'Clip',
                },
              ],
            },
          }),
        ),
      ),
      http.get('https://api.themoviedb.org/3/movie/550/recommendations', () =>
        HttpResponse.json({
          page: 1,
          results: [
            {
              id: 807,
              title: 'Seven',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              vote_average: 8,
              vote_count: 100,
            },
          ],
          total_pages: 1,
          total_results: 1,
        }),
      ),
    );
    renderAt('/pelicula/550');

    await screen.findByRole('heading', { name: 'Fight Club' });
    expect(screen.getByText('Edward Norton')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Official Trailer/ })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=abc123',
    );
    expect(screen.queryByText(/Clip en otro sitio/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recomendadas' })).toBeInTheDocument();
    expect(screen.getByText('Seven')).toBeInTheDocument();
  });

  it('una película que no existe en TMDB muestra "página no encontrada"', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/999999', () =>
        HttpResponse.json(
          { status_code: 34, status_message: 'The resource you requested could not be found.' },
          { status: 404 },
        ),
      ),
      http.get('https://api.themoviedb.org/3/movie/999999/recommendations', () =>
        HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      ),
    );

    renderAt('/pelicula/999999');

    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
  });

  it('un error de red muestra un mensaje llano con botón de reintento', async () => {
    // 400 (no 500) a propósito: DomainBadRequestError no se reintenta, así
    // la prueba no depende de esperas reales por el backoff de reintentos.
    server.use(
      http.get('https://api.themoviedb.org/3/movie/550', () =>
        HttpResponse.json({ status_code: 22, status_message: 'boom' }, { status: 400 }),
      ),
      http.get('https://api.themoviedb.org/3/movie/550/recommendations', () =>
        HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      ),
    );

    renderAt('/pelicula/550');

    expect(await screen.findByText('No pudimos cargar esta película.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });
});
