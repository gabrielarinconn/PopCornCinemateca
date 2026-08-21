import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SavedMovie } from '@/application/ports/library-storage.port';
import { libraryStoragePort } from '@/infrastructure/storage/library-storage.adapter';
import { libraryQueryKey, useLibraryMovies } from './use-library-movies';
import { useSaveMovie } from './use-save-movie';

const movie: SavedMovie = {
  id: 1,
  title: 'El padrino',
  posterPath: '/poster.jpg',
  savedAt: '2026-01-01T00:00:00.000Z',
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, Wrapper };
}

describe('useSaveMovie', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('aplica el cambio en la caché antes de que se complete la escritura real en localStorage', async () => {
    const { queryClient, Wrapper } = createWrapper();
    let cacheAtWriteTime: SavedMovie[] | undefined;

    vi.spyOn(libraryStoragePort, 'saveMovie').mockImplementation(() => {
      cacheAtWriteTime = queryClient.getQueryData<SavedMovie[]>(libraryQueryKey);
    });

    const { result } = renderHook(() => useSaveMovie(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync(movie);
    });

    expect(cacheAtWriteTime).toEqual([movie]);
  });

  it('revierte sola al estado anterior cuando la escritura real falla', async () => {
    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData<SavedMovie[]>(libraryQueryKey, []);

    vi.spyOn(libraryStoragePort, 'saveMovie').mockImplementation(() => {
      throw new Error('localStorage lleno');
    });

    const { result } = renderHook(() => useSaveMovie(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate(movie);
    });

    // Al fallar la escritura real, vuelve sola al estado anterior — nadie
    // tuvo que revertirlo a mano.
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(queryClient.getQueryData<SavedMovie[]>(libraryQueryKey)).toEqual([]);
  });

  it('se refleja en cualquier otro consumidor de useLibraryMovies suscrito al mismo cliente de caché', async () => {
    const { Wrapper } = createWrapper();

    // Dos hooks independientes bajo el mismo QueryClient — como Explorar y
    // Mi Cineteca montados a la vez, sin recargar la página.
    const explorar = renderHook(() => useLibraryMovies(), { wrapper: Wrapper });
    const miCineteca = renderHook(() => useSaveMovie(), { wrapper: Wrapper });

    await act(async () => {
      await miCineteca.result.current.mutateAsync(movie);
    });

    await waitFor(() => {
      expect(explorar.result.current.data).toEqual([movie]);
    });
  });
});
