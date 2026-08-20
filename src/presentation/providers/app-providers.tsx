import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { siteCopy } from '@/presentation/copy/site';

const queryClient = new QueryClient();

function ErrorFallback(): ReactNode {
  return (
    <div role="alert">
      <p>{siteCopy.genericError.title}</p>
    </div>
  );
}

export function AppProviders({ children }: { children: ReactNode }): ReactNode {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {children}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
