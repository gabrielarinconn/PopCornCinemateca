import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SavedMovie } from '@/application/ports/library-storage.port';
import { libraryStoragePort } from '@/infrastructure/storage/library-storage.adapter';
import { libraryQueryKey } from '@/presentation/hooks/use-library-movies';
import { expectNoA11yViolations } from '@/test/axe';
import { MyListPage } from './my-list-page';

const movie: SavedMovie = {
  id: 550,
  title: 'Fight Club',
  posterPath: '/poster.jpg',
  savedAt: '2026-01-01T00:00:00.000Z',
};

function renderWithLibrary(initialLibrary: SavedMovie[]) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(libraryQueryKey, initialLibrary);
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  const { container } = render(<MyListPage />, { wrapper: Wrapper });
  return { queryClient, container };
}

describe('MyListPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('con la lista vacía, muestra el estado vacío', () => {
    renderWithLibrary([]);
    expect(screen.getByText('Tu lista está vacía')).toBeInTheDocument();
  });

  it('con películas guardadas, las muestra y cuenta cuántas hay', () => {
    renderWithLibrary([movie]);
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('1 película guardada.')).toBeInTheDocument();
  });

  it('el botón de eliminar quita la película de la lista', async () => {
    vi.spyOn(libraryStoragePort, 'removeMovie').mockImplementation(() => undefined);
    renderWithLibrary([movie]);

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Fight Club' }));

    await waitFor(() => {
      expect(screen.getByText('Tu lista está vacía')).toBeInTheDocument();
    });
  });

  it('no tiene violaciones de accesibilidad críticas o serias', async () => {
    const { container } = renderWithLibrary([movie]);
    await expectNoA11yViolations(container);
  });
});
