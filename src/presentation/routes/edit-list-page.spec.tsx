import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('EditListPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('precarga el formulario con los datos actuales de la lista', async () => {
    const list = listStoragePort.createList({ name: 'Clásicos', description: 'Viejas glorias' });
    renderAt(`/listas/${list.id}/editar`);

    expect(await screen.findByLabelText('Nombre', {}, { timeout: 5000 })).toHaveValue('Clásicos');
    expect(screen.getByLabelText(/Descripción/)).toHaveValue('Viejas glorias');
  });

  it('guardar cambios actualiza la lista y vuelve a su ficha', async () => {
    const list = listStoragePort.createList({ name: 'Clásicos', description: '' });
    renderAt(`/listas/${list.id}/editar`);

    const nameInput = await screen.findByLabelText('Nombre', {}, { timeout: 5000 });
    fireEvent.change(nameInput, { target: { value: 'Clásicos del cine' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('heading', { name: 'Clásicos del cine' })).toBeInTheDocument();
    expect(listStoragePort.getList(list.id)?.name).toBe('Clásicos del cine');
  });

  it('conservar el nombre propio de la lista no dispara el error de duplicado', async () => {
    const list = listStoragePort.createList({ name: 'Clásicos', description: '' });
    renderAt(`/listas/${list.id}/editar`);

    await screen.findByLabelText('Nombre', {}, { timeout: 5000 });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('cambiar el nombre al de otra lista existente muestra el error de duplicado', async () => {
    listStoragePort.createList({ name: 'Terror', description: '' });
    const list = listStoragePort.createList({ name: 'Clásicos', description: '' });
    renderAt(`/listas/${list.id}/editar`);

    const nameInput = await screen.findByLabelText('Nombre', {}, { timeout: 5000 });
    fireEvent.change(nameInput, { target: { value: 'Terror' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe una lista con este nombre.',
    );
    expect(listStoragePort.getList(list.id)?.name).toBe('Clásicos');
  });
});
