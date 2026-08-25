import { useNavigate } from 'react-router';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { ListForm } from '@/presentation/components/features/list-form';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useLists } from '@/presentation/hooks/use-lists';
import { useCreateList } from '@/presentation/hooks/use-create-list';

export function NewListPage() {
  const headingRef = usePageMeta('Crear lista — popCorn');
  const navigate = useNavigate();
  const { data: lists, isLoading: listsLoading } = useLists();
  const createList = useCreateList();

  return (
    <PageContainer className="space-y-8 lg:pt-8">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-4xl font-extrabold tracking-tight text-text-primary"
      >
        Crear lista
      </h1>

      <ListForm
        existingNames={(lists ?? []).map((list) => list.name)}
        // Bloqueado también mientras cargan las listas existentes — enviar
        // antes de tenerlas dejaría pasar un nombre duplicado sin detectarlo.
        isSubmitting={createList.isPending || listsLoading}
        submitLabel="Crear lista"
        onSubmit={(values) => {
          createList.mutate(values, {
            onSuccess: (newList) => {
              void navigate(`/listas/${newList.id}`);
            },
          });
        }}
      />
    </PageContainer>
  );
}
