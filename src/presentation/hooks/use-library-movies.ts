import { useQuery } from '@tanstack/react-query';
import { libraryStoragePort } from '@/infrastructure/storage/library-storage.adapter';

/**
 * Es la misma clave que consumen tanto la cuadrícula de Explorar (para
 * pintar el corazón de "guardada") como Mi Cineteca — por eso una mutación
 * que la actualiza se ve reflejada en las dos pantallas a la vez, sin
 * recargar: ambas están suscritas a esta misma entrada de caché.
 */
export const libraryQueryKey = ['library'] as const;

export function useLibraryMovies() {
  return useQuery({
    queryKey: libraryQueryKey,
    queryFn: () => libraryStoragePort.getSavedMovies(),
    // localStorage no cambia por su cuenta — solo por nuestras propias
    // mutaciones, que ya invalidan esta clave a mano.
    staleTime: Infinity,
  });
}

export function useIsMovieSaved(movieId: number): boolean {
  const { data } = useLibraryMovies();
  return data?.some((movie) => movie.id === movieId) ?? false;
}
