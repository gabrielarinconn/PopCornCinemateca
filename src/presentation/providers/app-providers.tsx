import type { ReactNode } from 'react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { siteCopy } from '@/presentation/copy/site';

function ErrorFallback(): ReactNode {
  return (
    <div role="alert">
      <p>{siteCopy.genericError.title}</p>
    </div>
  );
}

export function AppProviders({ children }: { children: ReactNode }): ReactNode {
  // Se crea por instancia del componente, no como singleton del módulo — si
  // no, cada montaje (cada prueba, o un futuro SSR) compartiría la misma
  // caché con cualquier otro montaje anterior.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {children}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
