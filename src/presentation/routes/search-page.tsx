import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { siteCopy } from '@/presentation/copy/site';
import { usePageMeta } from '@/presentation/hooks/use-page-meta';
import { useDebouncedValue } from '@/presentation/hooks/use-debounced-value';
import { useSearchMovies } from '@/presentation/hooks/use-search-movies';

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
    <div className="p-8">
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold">
        {siteCopy.search.heading}
      </h1>

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
        className="w-full max-w-md rounded border px-3 py-2"
      />

      {!hasQuery && (
        <div className="mt-6">
          <p className="font-semibold">{siteCopy.search.emptyInitialTitle}</p>
          <p className="text-ink-muted text-sm">{siteCopy.search.emptyInitialDescription}</p>
        </div>
      )}

      {hasQuery && isPending && (
        <p className="mt-6" aria-busy="true">
          {siteCopy.search.loading}
        </p>
      )}

      {hasQuery && !isPending && isError && (
        <div className="mt-6">
          <p>{siteCopy.search.error}</p>
          <button type="button" onClick={() => void refetch()}>
            {siteCopy.search.retry}
          </button>
        </div>
      )}

      {hasQuery && !isPending && !isError && data.movies.length === 0 && (
        <div className="mt-6">
          <p className="font-semibold">{siteCopy.search.noResultsTitle}</p>
          <p className="text-ink-muted text-sm">{siteCopy.search.noResultsDescription}</p>
        </div>
      )}

      {hasQuery && !isPending && !isError && data.movies.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {data.movies.map((movie) => (
            <li key={movie.id}>
              <Link to={`/pelicula/${String(movie.id)}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
