import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Search } from 'lucide-react';
import { siteCopy } from '@/presentation/copy/site';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useDebouncedValue } from '@/presentation/hooks/use-debounced-value';
import { useSearchMovies } from '@/presentation/hooks/use-search-movies';
import { PosterCard } from '@/presentation/components/ui/PosterCard';
import { PageContainer } from '@/presentation/components/layout/PageContainer';
import { toPosterCardData } from '@/presentation/lib/movie-mapper';

const SEARCH_DEBOUNCE_MS = 400;
const QUERY_PARAM = 'q';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rawQuery, setRawQuery] = useState(() => searchParams.get(QUERY_PARAM) ?? '');
  const debouncedQuery = useDebouncedValue(rawQuery, SEARCH_DEBOUNCE_MS);
  const trimmedQuery = debouncedQuery.trim();
  const hasQuery = trimmedQuery.length > 0;

  const { data, isPending, isError, refetch } = useSearchMovies(debouncedQuery);
  const headingRef = usePageMeta(`${siteCopy.search.title} — ${siteCopy.appName}`);

  useEffect(() => {
    setSearchParams(hasQuery ? { [QUERY_PARAM]: debouncedQuery } : {}, { replace: true });
  }, [debouncedQuery, hasQuery, setSearchParams]);

  return (
    <PageContainer className="space-y-8 pb-32">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl font-extrabold tracking-tight text-text-primary"
      >
        {siteCopy.search.heading}
      </h1>

      <div className="relative max-w-xl">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
          aria-hidden="true"
        />
        <label htmlFor="search-query" className="sr-only">
          {siteCopy.search.inputLabel}
        </label>
        <input
          id="search-query"
          type="search"
          value={rawQuery}
          placeholder={siteCopy.search.placeholder}
          onChange={(event) => {
            setRawQuery(event.target.value);
          }}
          className="w-full rounded-lg border border-border-subtle bg-background-surface pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
        />
      </div>

      {!hasQuery && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 mx-auto text-text-muted mb-4" aria-hidden="true" />
          <p className="font-semibold text-text-primary">{siteCopy.search.emptyInitialTitle}</p>
          <p className="text-text-muted text-sm mt-1">{siteCopy.search.emptyInitialDescription}</p>
        </div>
      )}

      {hasQuery && isPending && (
        <div aria-busy="true">
          <p className="text-text-secondary mb-4">{siteCopy.search.loading}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-search-${String(i)}`}
                className="aspect-poster rounded-lg bg-background-surface animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {hasQuery && !isPending && isError && (
        <div className="text-center py-16">
          <p className="text-text-secondary mb-3">{siteCopy.search.error}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-brand hover:text-brand-hover text-sm font-medium transition-colors"
          >
            {siteCopy.search.retry}
          </button>
        </div>
      )}

      {hasQuery && !isPending && !isError && data.movies.length === 0 && (
        <div className="text-center py-16">
          <p className="font-semibold text-text-primary">{siteCopy.search.noResultsTitle}</p>
          <p className="text-text-muted text-sm mt-1">{siteCopy.search.noResultsDescription}</p>
        </div>
      )}

      {hasQuery && !isPending && !isError && data.movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.movies.map((movie) => (
            <PosterCard key={movie.id} {...toPosterCardData(movie)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
