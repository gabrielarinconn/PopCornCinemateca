import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { routes } from '@/presentation/routes/router';
import { listStoragePort } from '@/infrastructure/storage/list-storage.adapter';

function renderAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

describe('ListDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('abrir la URL de una lista directamente (recarga dura) reproduce esa lista exacta', async () => {
    const list = listStoragePort.createList({
      name: 'Clásicos del cine',
      description: 'Para volver a ver cada tanto',
    });

    // `renderAt` arma un router de memoria con initialEntries apuntando
    // directo a la ruta — no hay navegación previa, exactamente como pegar
    // el enlace en una pestaña nueva.
    renderAt(`/listas/${list.id}`);

    expect(
      await screen.findByRole('heading', { name: 'Clásicos del cine' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Para volver a ver cada tanto')).toBeInTheDocument();
  });

  it('un id que no corresponde a ninguna lista muestra "no encontrado"', async () => {
    renderAt('/listas/no-existe');

    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
  });

  it('el botón "Editar" enlaza a la ruta de edición de esa lista', async () => {
    const list = listStoragePort.createList({ name: 'Terror', description: '' });
    renderAt(`/listas/${list.id}`);

    await screen.findByRole('heading', { name: 'Terror' });
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });
});
