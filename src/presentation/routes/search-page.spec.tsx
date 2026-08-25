import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { siteCopy } from '@/presentation/copy/site';
import { server } from '@/test/msw/server';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

function movieSummary(overrides: Record<string, unknown> = {}) {
  return {
    id: 268,
    title: 'Batman',
    overview: '...',
    poster_path: null,
    backdrop_path: null,
    release_date: '1989-06-23',
    vote_average: 7.2,
    vote_count: 500,
    ...overrides,
  };
}

function mockSearchEndpoint(
  results: Record<string, unknown>[],
  onRequest?: (query: string | null) => void,
) {
  server.use(
    http.get(SEARCH_URL, ({ request }) => {
      onRequest?.(new URL(request.url).searchParams.get('query'));
      return HttpResponse.json({ page: 1, results, total_pages: 1, total_results: results.length });
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

describe('Búsqueda', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('teclear diez letras dispara una sola petición, no diez', async () => {
    const networkSpy = vi.fn();
    mockSearchEndpoint([], networkSpy);

    renderAt('/buscar');
    // Primer chunk perezoso de SearchPage en el archivo — el timeout por
    // defecto (1s) a veces no alcanza cuando corre junto al resto de la
    // suite. Las demás pruebas, con el chunk ya resuelto, no lo necesitan.
    const input = await screen.findByLabelText(siteCopy.search.inputLabel, {}, { timeout: 5000 });

    vi.useFakeTimers();
    const term = 'inceptionx';
    for (let i = 1; i <= term.length; i += 1) {
      fireEvent.change(input, { target: { value: term.slice(0, i) } });
    }
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(networkSpy).toHaveBeenCalledTimes(1);
    });
    expect(networkSpy).toHaveBeenCalledWith('inceptionx');
  });

  it('un término vacío no dispara ninguna petición a la red', async () => {
    const networkSpy = vi.fn();
    mockSearchEndpoint([], networkSpy);

    renderAt('/buscar');
    await screen.findByLabelText(siteCopy.search.inputLabel);

    expect(screen.getByText(siteCopy.search.emptyInitialTitle)).toBeInTheDocument();
    expect(networkSpy).not.toHaveBeenCalled();
  });

  it('estado vacío inicial: sin término, invita a buscar algo', async () => {
    mockSearchEndpoint([]);
    renderAt('/buscar');

    expect(await screen.findByText(siteCopy.search.emptyInitialTitle)).toBeInTheDocument();
  });

  it('estado de carga: mientras espera la respuesta, muestra el aviso de carga', async () => {
    mockSearchEndpoint([]);
    renderAt('/buscar?q=batman');

    expect(screen.getByText(siteCopy.search.loading)).toBeInTheDocument();
    await screen.findByText(siteCopy.search.noResultsTitle);
  });

  it('estado de error: muestra un mensaje llano con botón de reintento', async () => {
    server.use(
      http.get(SEARCH_URL, () =>
        HttpResponse.json({ status_code: 22, status_message: 'boom' }, { status: 400 }),
      ),
    );
    renderAt('/buscar?q=batman');

    expect(await screen.findByText(siteCopy.search.error)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: siteCopy.search.retry })).toBeInTheDocument();
  });

  it('estado vacío por resultado: término sin coincidencias, con salida clara', async () => {
    mockSearchEndpoint([]);
    renderAt('/buscar?q=zzzznoexiste');

    expect(await screen.findByText(siteCopy.search.noResultsTitle)).toBeInTheDocument();
    expect(screen.getByText(siteCopy.search.noResultsDescription)).toBeInTheDocument();
  });

  it('estado con resultados: muestra las películas encontradas', async () => {
    mockSearchEndpoint([movieSummary()]);
    renderAt('/buscar?q=batman');

    expect(await screen.findByRole('link', { name: /Batman/ })).toHaveAttribute(
      'href',
      '/pelicula/268',
    );
  });

  it('dos búsquedas equivalentes con espacios/mayúsculas distintas comparten la misma entrada de caché', async () => {
    const networkSpy = vi.fn();
    mockSearchEndpoint([movieSummary({ title: 'Batman' })], networkSpy);

    renderAt('/buscar?q=Batman%20');
    await screen.findByRole('link', { name: /Batman/ });
    expect(networkSpy).toHaveBeenCalledTimes(1);

    const input = screen.getByLabelText(siteCopy.search.inputLabel);
    vi.useFakeTimers();
    fireEvent.change(input, { target: { value: 'batman' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    vi.useRealTimers();

    await screen.findByRole('link', { name: /Batman/ });
    // Misma clave de caché ("Batman " y "batman" normalizan igual) — TanStack
    // Query sirve el resultado ya cacheado, no dispara una segunda petición.
    expect(networkSpy).toHaveBeenCalledTimes(1);
  });

  it('abrir la URL con el término de búsqueda directamente reproduce los mismos resultados', async () => {
    mockSearchEndpoint([movieSummary({ id: 268, title: 'Batman' })]);

    // Un router de memoria apuntando directo a la ruta con `?q=`, sin
    // navegación previa — como pegar el enlace en una pestaña nueva.
    renderAt('/buscar?q=Batman');

    expect(await screen.findByRole('link', { name: /Batman/ })).toBeInTheDocument();
  });
});
