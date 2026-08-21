import { useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryStoragePort } from '@/infrastructure/storage/library-storage.adapter';
import type { SavedMovie } from '@/application/ports/library-storage.port';
import { libraryQueryKey } from './use-library-movies';

interface MutationContext {
  previous: SavedMovie[];
}

export function useRemoveMovie() {
  const queryClient = useQueryClient();

  return useMutation<undefined, Error, number, MutationContext>({
    mutationFn: (movieId) => {
      libraryStoragePort.removeMovie(movieId);
      return Promise.resolve(undefined);
    },
    onMutate: async (movieId) => {
      await queryClient.cancelQueries({ queryKey: libraryQueryKey });

      const previous = queryClient.getQueryData<SavedMovie[]>(libraryQueryKey) ?? [];
      queryClient.setQueryData<SavedMovie[]>(
        libraryQueryKey,
        previous.filter((movie) => movie.id !== movieId),
      );

      return { previous };
    },
    onError: (_error, _movieId, context) => {
      if (context) queryClient.setQueryData(libraryQueryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: libraryQueryKey });
    },
  });
}
