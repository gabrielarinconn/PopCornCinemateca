import { render, screen, fireEvent } from '@testing-library/react';
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

describe('ListsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('sin listas, invita a crear la primera', async () => {
    renderAt('/listas');
    expect(
      await screen.findByText('Todavía no tienes listas', {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it('con listas guardadas, las muestra con enlace a su ficha', async () => {
    const list = listStoragePort.createList({ name: 'Clásicos', description: 'Viejas glorias' });
    renderAt('/listas');

    const link = await screen.findByRole('link', { name: /Clásicos/ }, { timeout: 5000 });
    expect(link).toHaveAttribute('href', `/listas/${list.id}`);
    expect(screen.getByText('Viejas glorias')).toBeInTheDocument();
  });

  it('el botón "Crear lista" navega al formulario de creación', async () => {
    renderAt('/listas');

    await screen.findByRole('heading', { name: 'Mis listas' }, { timeout: 5000 });
    fireEvent.click(screen.getByRole('button', { name: 'Crear lista' }));

    expect(await screen.findByRole('heading', { name: 'Crear lista' })).toBeInTheDocument();
  });
});
