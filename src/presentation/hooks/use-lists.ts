import { useQuery } from '@tanstack/react-query';
import { listStoragePort } from '@/infrastructure/storage/list-storage.adapter';

export const listsQueryKey = ['lists'] as const;

export function useLists() {
  return useQuery({
    queryKey: listsQueryKey,
    queryFn: () => listStoragePort.getLists(),
    // localStorage no cambia por su cuenta — solo por nuestras propias
    // mutaciones, que ya invalidan esta clave a mano.
    staleTime: Infinity,
  });
}

export function useList(listId: string | undefined) {
  const query = useLists();
  const lists = query.data ?? [];
  const list = listId ? lists.find((candidate) => candidate.id === listId) : undefined;
  return {
    data: list,
    lists,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
