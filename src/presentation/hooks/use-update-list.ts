import { useMutation, useQueryClient } from '@tanstack/react-query';
import { listStoragePort } from '@/infrastructure/storage/list-storage.adapter';
import type { ListFormValues, MovieList } from '@/application/ports/list-storage.port';
import { listsQueryKey } from './use-lists';

interface UpdateListInput {
  id: string;
  values: ListFormValues;
}

interface MutationContext {
  previous: MovieList[];
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation<undefined, Error, UpdateListInput, MutationContext>({
    mutationFn: ({ id, values }) => {
      listStoragePort.updateList(id, values);
      return Promise.resolve(undefined);
    },
    onMutate: async ({ id, values }) => {
      await queryClient.cancelQueries({ queryKey: listsQueryKey });

      const previous = queryClient.getQueryData<MovieList[]>(listsQueryKey) ?? [];
      queryClient.setQueryData<MovieList[]>(
        listsQueryKey,
        previous.map((list) => (list.id === id ? { ...list, ...values } : list)),
      );

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
