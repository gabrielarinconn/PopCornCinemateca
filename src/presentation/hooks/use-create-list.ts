import { useMutation, useQueryClient } from '@tanstack/react-query';
import { listStoragePort } from '@/infrastructure/storage/list-storage.adapter';
import type { ListFormValues, MovieList } from '@/application/ports/list-storage.port';
import { listsQueryKey } from './use-lists';

interface MutationContext {
  previous: MovieList[];
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation<MovieList, Error, ListFormValues, MutationContext>({
    mutationFn: (input) => Promise.resolve(listStoragePort.createList(input)),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: listsQueryKey });

      const previous = queryClient.getQueryData<MovieList[]>(listsQueryKey) ?? [];
      const optimisticList: MovieList = {
        ...input,
        id: `optimistic-${String(Date.now())}`,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<MovieList[]>(listsQueryKey, [...previous, optimisticList]);

      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context) queryClient.setQueryData(listsQueryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listsQueryKey });
    },
  });
}
