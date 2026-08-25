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

describe('NewListPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  async function fillNameAndWaitEnabled(name: string) {
    const nameInput = await screen.findByLabelText('Nombre', {}, { timeout: 5000 });
    fireEvent.change(nameInput, { target: { value: name } });

    const submitButton = screen.getByRole('button', { name: 'Crear lista' });
    // El botón arranca deshabilitado mientras cargan las listas existentes
    // (necesarias para detectar duplicados) — se espera a que habilite.
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    return submitButton;
  }

  it('crear una lista con datos válidos la guarda y navega a su ficha', async () => {
    renderAt('/listas/nueva');

    const submitButton = await fillNameAndWaitEnabled('Ciencia ficción');
    fireEvent.click(submitButton);

    expect(await screen.findByRole('heading', { name: 'Ciencia ficción' })).toBeInTheDocument();
    expect(listStoragePort.getLists()).toHaveLength(1);
  });

  it('crear una lista con un nombre ya usado muestra el mensaje de duplicado', async () => {
    listStoragePort.createList({ name: 'Terror', description: '' });
    renderAt('/listas/nueva');

    const submitButton = await fillNameAndWaitEnabled('Terror');
    fireEvent.click(submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe una lista con este nombre.',
    );
    expect(listStoragePort.getLists()).toHaveLength(1);
  });

  // La prevención de doble envío en sí (botón deshabilitado mientras
  // `isSubmitting` es true) ya se prueba de forma directa y determinista en
  // list-form.spec.tsx — ahí no depende de ganarle una carrera a una
  // escritura que resuelve en un solo microtask.
});
