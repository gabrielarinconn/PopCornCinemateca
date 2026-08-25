import { Link, useNavigate } from 'react-router';
import { ListPlus } from 'lucide-react';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { Button } from '@/presentation/components/ui/Button';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useLists } from '@/presentation/hooks/use-lists';

export function ListsPage() {
  const { data: lists, isLoading } = useLists();
  const headingRef = usePageMeta('Mis listas — popCorn');
  const navigate = useNavigate();

  return (
    <PageContainer className="space-y-8 lg:pt-8">
      <header className="flex items-center justify-between gap-4">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-4xl font-extrabold tracking-tight text-text-primary"
        >
          Mis listas
        </h1>
        <Button
          variant="primary"
          icon={ListPlus}
          onClick={() => {
            void navigate('/listas/nueva');
          }}
        >
          Crear lista
        </Button>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-list-${String(i)}`}
              className="h-28 rounded-lg bg-background-surface animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && (lists?.length ?? 0) === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-text-secondary text-lg mb-2">Todavía no tienes listas</p>
          <p className="text-text-muted text-sm max-w-md">
            Crea una lista temática para organizar tus películas y compartirla por enlace.
          </p>
        </div>
      )}

      {!isLoading && (lists?.length ?? 0) > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists?.map((list) => (
            <li key={list.id}>
              <Link
                to={`/listas/${list.id}`}
                className="block rounded-lg border border-border-subtle bg-background-surface p-5 hover:border-border-default transition-colors"
              >
                <h2 className="font-semibold text-text-primary line-clamp-1">{list.name}</h2>
                {list.description && (
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {list.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
