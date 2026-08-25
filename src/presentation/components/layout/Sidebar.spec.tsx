import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('cerrado, no muestra el botón de cerrar ni el overlay móvil', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Sidebar isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Cerrar menú lateral' })).not.toBeInTheDocument();
  });

  it('abierto, el botón de cerrar dispara `onClose`', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Sidebar isOpen onClose={onClose} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar menú lateral' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('marca como activo el ítem de navegación de la ruta actual', () => {
    render(
      <MemoryRouter initialEntries={['/movies']}>
        <Sidebar isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Películas' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Explorar' })).not.toHaveAttribute('aria-current');
  });

  it('renderiza los cuatro accesos de navegación principal', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Sidebar isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Explorar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Series' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Películas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mi Lista' })).toBeInTheDocument();
  });
});
