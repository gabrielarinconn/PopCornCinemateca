import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { server } from '@/test/msw/server';
import { expectNoA11yViolations } from '@/test/axe';

// Servidor MSW global — ver el comentario en configuration.spec.ts.

function movieResult(id: number, title: string) {
  return {
    id,
    title,
    overview: 'sinopsis',
    poster_path: null,
    backdrop_path: null,
    vote_average: 7.5,
    vote_count: 100,
  };
}

function tvResult(id: number, name: string) {
  return {
    id,
    name,
    overview: 'sinopsis',
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.1,
    vote_count: 200,
  };
}

function mockTrendingEndpoints() {
  server.use(
    http.get('https://api.themoviedb.org/3/trending/movie/week', () =>
      HttpResponse.json({
        page: 1,
        results: [movieResult(1, 'Nexus Protocol'), movieResult(2, 'Crimson Tide')],
        total_pages: 1,
        total_results: 2,
      }),
    ),
    http.get('https://api.themoviedb.org/3/trending/tv/week', () =>
      HttpResponse.json({
        page: 1,
        results: [tvResult(10, 'Dark Matter'), tvResult(11, 'The Crowned')],
        total_pages: 1,
        total_results: 2,
      }),
    ),
  );
}

function renderAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  const { container } = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { router, container };
}

describe('ExplorePage', () => {
  it('muestra las tendencias de películas y series', async () => {
    mockTrendingEndpoints();
    renderAt('/explore');

    // Primer chunk perezoso de ExplorePage en el archivo — el timeout por
    // defecto (1s) a veces no alcanza cuando corre junto al resto de la
    // suite. Las demás pruebas del archivo, con el chunk ya resuelto, no
    // necesitan este margen extra.
    expect(await screen.findByText('Nexus Protocol', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText('Dark Matter')).toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad críticas o serias (también cubre Inicio, que redirige aquí)', async () => {
    mockTrendingEndpoints();
    const { container } = renderAt('/explore');

    await screen.findByText('Nexus Protocol');
    await expectNoA11yViolations(container);
  });
});
