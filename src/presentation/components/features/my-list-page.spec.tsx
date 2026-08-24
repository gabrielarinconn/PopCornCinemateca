import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { MyListPage } from './my-list-page';

describe('MyListPage', () => {
  it('muestra "Continuar Viendo" y "Guardados Recientemente" con contenido', () => {
    render(
      <MemoryRouter>
        <MyListPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Mi Lista' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Continuar Viendo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Guardados Recientemente' })).toBeInTheDocument();
    expect(screen.getByText('Crónicas de Acero')).toBeInTheDocument();
  });

  it('el botón "Editar Lista" alterna su propio texto a "Cancelar"', () => {
    render(
      <MemoryRouter>
        <MyListPage />
      </MemoryRouter>,
    );

    const editButton = screen.getByRole('button', { name: 'Editar Lista' });
    fireEvent.click(editButton);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });
});
