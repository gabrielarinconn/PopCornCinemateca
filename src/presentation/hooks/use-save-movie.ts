import { useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryStoragePort } from '@/infrastructure/storage/library-storage.adapter';
import type { SavedMovie } from '@/application/ports/library-storage.port';
import { libraryQueryKey } from './use-library-movies';

interface MutationContext {
  previous: SavedMovie[];
}

export function useSaveMovie() {
  const queryClient = useQueryClient();

  return useMutation<undefined, Error, SavedMovie, MutationContext>({
    mutationFn: (movie) => {
      libraryStoragePort.saveMovie(movie);
      return Promise.resolve(undefined);
    },
    onMutate: async (movie) => {
      await queryClient.cancelQueries({ queryKey: libraryQueryKey });

      const previous = queryClient.getQueryData<SavedMovie[]>(libraryQueryKey) ?? [];
      queryClient.setQueryData<SavedMovie[]>(libraryQueryKey, [...previous, movie]);

      return { previous };
    },
    onError: (_error, _movie, context) => {
      if (context) queryClient.setQueryData(libraryQueryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: libraryQueryKey });
    },
  });
}
