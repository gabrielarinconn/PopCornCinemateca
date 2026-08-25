import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListForm } from './list-form';

function fillAndSubmit(name: string, description = '') {
  const nameInput = screen.getByLabelText('Nombre');
  const descriptionInput = screen.getByLabelText(/Descripción/);
  fireEvent.change(nameInput, { target: { value: name } });
  fireEvent.change(descriptionInput, { target: { value: description } });
  fireEvent.click(screen.getByRole('button', { name: /Crear lista|Guardar/ }));
}

describe('ListForm', () => {
  it('nombre vacío: muestra su mensaje específico y mueve el foco al campo', async () => {
    const onSubmit = vi.fn();
    render(
      <ListForm
        existingNames={[]}
        isSubmitting={false}
        submitLabel="Crear lista"
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Crear lista' }));

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent('El nombre no puede estar vacío.');
    expect(screen.getByLabelText('Nombre')).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('nombre ya usado: muestra el mensaje de duplicado, distinto del de vacío, y mueve el foco', async () => {
    const onSubmit = vi.fn();
    render(
      <ListForm
        existingNames={['Clásicos', 'Terror']}
        isSubmitting={false}
        submitLabel="Crear lista"
        onSubmit={onSubmit}
      />,
    );

    fillAndSubmit('clásicos');

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent('Ya existe una lista con este nombre.');
    expect(error).not.toHaveTextContent('El nombre no puede estar vacío.');
    expect(screen.getByLabelText('Nombre')).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('un nombre válido y no duplicado dispara `onSubmit` con los valores', async () => {
    const onSubmit = vi.fn();
    render(
      <ListForm
        existingNames={['Terror']}
        isSubmitting={false}
        submitLabel="Crear lista"
        onSubmit={onSubmit}
      />,
    );

    fillAndSubmit('Clásicos', 'Para volver a ver');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Clásicos', description: 'Para volver a ver' });
    });
  });

  it('un nombre demasiado largo se bloquea con su propio mensaje', async () => {
    const onSubmit = vi.fn();
    render(
      <ListForm
        existingNames={[]}
        isSubmitting={false}
        submitLabel="Crear lista"
        onSubmit={onSubmit}
      />,
    );

    fillAndSubmit('x'.repeat(61));

    expect(await screen.findByText(/demasiado largo/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('con `isSubmitting`, el botón queda deshabilitado — sin envío doble', () => {
    render(
      <ListForm existingNames={[]} isSubmitting submitLabel="Crear lista" onSubmit={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Crear lista' })).toBeDisabled();
  });

  it('con `defaultValues`, precarga el formulario (modo edición)', () => {
    render(
      <ListForm
        defaultValues={{ name: 'Clásicos', description: 'Ya existente' }}
        existingNames={[]}
        isSubmitting={false}
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Nombre')).toHaveValue('Clásicos');
    expect(screen.getByLabelText(/Descripción/)).toHaveValue('Ya existente');
  });
});
