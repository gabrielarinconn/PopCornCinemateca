import { useParams, useNavigate } from 'react-router';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { ListForm } from '@/presentation/components/features/list-form';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useList } from '@/presentation/hooks/use-lists';
import { useUpdateList } from '@/presentation/hooks/use-update-list';
import { NotFoundPage } from './not-found-page';

export function EditListPage() {
  const params = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { data: list, lists, isLoading } = useList(params.listId);
  const updateList = useUpdateList();

  const headingRef = usePageMeta(list ? `Editar ${list.name} — popCorn` : 'Mis listas — popCorn');

  if (isLoading) {
    return (
      <PageContainer className="space-y-6 lg:pt-8" aria-busy="true">
        <div className="h-10 w-64 rounded bg-background-surface animate-pulse" />
      </PageContainer>
    );
  }

  if (!list) {
    return <NotFoundPage />;
  }

  const otherListNames = lists.filter((candidate) => candidate.id !== list.id).map((l) => l.name);

  return (
    <PageContainer className="space-y-8 lg:pt-8">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-4xl font-extrabold tracking-tight text-text-primary"
      >
        Editar {list.name}
      </h1>

      <ListForm
        defaultValues={{ name: list.name, description: list.description }}
        existingNames={otherListNames}
        isSubmitting={updateList.isPending}
        submitLabel="Guardar cambios"
        onSubmit={(values) => {
          updateList.mutate(
            { id: list.id, values },
            {
              onSuccess: () => {
                void navigate(`/listas/${list.id}`);
              },
            },
          );
        }}
      />
    </PageContainer>
  );
}
