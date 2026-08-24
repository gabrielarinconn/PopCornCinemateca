import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { server } from '../../test/msw/server';
import { useDiscoverMovies } from './use-discover-movies';

// Servidor MSW global — ver el comentario en configuration.spec.ts.
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

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

describe('useDiscoverMovies', () => {
  it('trae la primera página y avanza a la siguiente con fetchNextPage', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/discover/movie', ({ request }) => {
        const page = new URL(request.url).searchParams.get('page') ?? '1';
        return HttpResponse.json({
          page: Number(page),
          results: [movieResult(Number(page))],
          total_pages: 2,
          total_results: 2,
        });
      }),
    );

    const { result } = renderHook(() => useDiscoverMovies({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);

    await result.current.fetchNextPage();
    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });
    expect(result.current.hasNextPage).toBe(false);
  });

  it('se detiene con un estado explícito al llegar al tope de 500 páginas, aunque TMDB reporte más', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/discover/movie', () =>
        HttpResponse.json({
          page: 500,
          results: [movieResult(1)],
          total_pages: 900,
          total_results: 9000,
        }),
      ),
    );

    const { result } = renderHook(() => useDiscoverMovies({}), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.hasNextPage).toBe(false);
  });

  it('cancela la petición en vuelo y no deja ver datos viejos cuando los filtros cambian antes de responder', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/discover/movie', async ({ request }) => {
        const genre = new URL(request.url).searchParams.get('with_genres');
        if (genre === '1') {
          await delay(200);
          return HttpResponse.json({
            page: 1,
            results: [movieResult(1)],
            total_pages: 1,
            total_results: 1,
          });
        }
        return HttpResponse.json({
          page: 1,
          results: [movieResult(2)],
          total_pages: 1,
          total_results: 1,
        });
      }),
    );

    const wrapper = createWrapper();
    const { result, rerender } = renderHook(({ genreId }) => useDiscoverMovies({ genreId }), {
      wrapper,
      initialProps: { genreId: 1 },
    });

    rerender({ genreId: 2 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    const titles = result.current.data?.pages.flatMap((page) =>
      page.movies.map((movie) => movie.title),
    );
    expect(titles).toEqual(['Película 2']);
  });
});
