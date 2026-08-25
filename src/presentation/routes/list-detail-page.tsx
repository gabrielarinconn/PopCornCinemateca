import { useParams, useNavigate } from 'react-router';
import { Pencil } from 'lucide-react';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { Button } from '@/presentation/components/ui/Button';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useList } from '@/presentation/hooks/use-lists';
import { NotFoundPage } from './not-found-page';

export function ListDetailPage() {
  const params = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { data: list, isLoading } = useList(params.listId);

  const headingRef = usePageMeta(list ? `${list.name} — popCorn` : 'Mis listas — popCorn');

  if (isLoading) {
    return (
      <PageContainer className="space-y-6 lg:pt-8" aria-busy="true">
        <div className="h-10 w-64 rounded bg-background-surface animate-pulse" />
        <div className="h-4 w-96 rounded bg-background-surface animate-pulse" />
      </PageContainer>
    );
  }

  if (!list) {
    return <NotFoundPage />;
  }

  return (
    <PageContainer className="space-y-6 lg:pt-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl font-extrabold tracking-tight text-text-primary"
          >
            {list.name}
          </h1>
          {list.description && (
            <p className="text-text-secondary mt-2 max-w-2xl">{list.description}</p>
          )}
        </div>
        <Button
          variant="secondary"
          icon={Pencil}
          onClick={() => {
            void navigate(`/listas/${list.id}/editar`);
          }}
        >
          Editar
        </Button>
      </div>

      <p className="text-text-muted text-sm">Todavía no hay películas en esta lista.</p>
    </PageContainer>
  );
}
