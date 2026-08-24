import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SavedMovie } from '@/application/ports/library-storage.port';
import { libraryStoragePort } from '@/infrastructure/storage/library-storage.adapter';
import { libraryQueryKey, useIsMovieSaved } from './use-library-movies';
import { useRemoveMovie } from './use-remove-movie';

const movie: SavedMovie = {
  id: 1,
  title: 'El padrino',
  posterPath: '/poster.jpg',
  savedAt: '2026-01-01T00:00:00.000Z',
};

function createWrapper(initialLibrary: SavedMovie[]) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(libraryQueryKey, initialLibrary);
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, Wrapper };
}

describe('useRemoveMovie', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('quita la película de la caché al instante, antes de que la escritura real resuelva', async () => {
    const { queryClient, Wrapper } = createWrapper([movie]);
    let cacheAtWriteTime: SavedMovie[] | undefined;

    vi.spyOn(libraryStoragePort, 'removeMovie').mockImplementation(() => {
      cacheAtWriteTime = queryClient.getQueryData<SavedMovie[]>(libraryQueryKey);
    });

    const { result } = renderHook(() => useRemoveMovie(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync(movie.id);
    });

    expect(cacheAtWriteTime).toEqual([]);
  });

  it('revierte sola al estado anterior cuando la escritura real falla', async () => {
    const { queryClient, Wrapper } = createWrapper([movie]);

    vi.spyOn(libraryStoragePort, 'removeMovie').mockImplementation(() => {
      throw new Error('localStorage no disponible');
    });

    const { result } = renderHook(() => useRemoveMovie(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate(movie.id);
    });

    // Al fallar la escritura real, vuelve sola al estado anterior — nadie
    // tuvo que revertirlo a mano.
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(queryClient.getQueryData<SavedMovie[]>(libraryQueryKey)).toEqual([movie]);
  });

  it('quitar desde un consumidor se refleja en otro consumidor (ficha → Explorar), sin recargar', async () => {
    const { Wrapper } = createWrapper([movie]);

    const fichaConsumer = renderHook(() => useRemoveMovie(), { wrapper: Wrapper });
    const explorarConsumer = renderHook(() => useIsMovieSaved(movie.id), { wrapper: Wrapper });

    expect(explorarConsumer.result.current).toBe(true);

    await act(async () => {
      await fichaConsumer.result.current.mutateAsync(movie.id);
    });

    await waitFor(() => {
      expect(explorarConsumer.result.current).toBe(false);
    });
  });
});
