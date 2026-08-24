import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('el botón de menú dispara `onMenuClick`', () => {
    const onMenuClick = vi.fn();
    render(
      <MemoryRouter>
        <Navbar onMenuClick={onMenuClick} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú lateral' }));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('usa el placeholder de búsqueda recibido', () => {
    render(
      <MemoryRouter>
        <Navbar onMenuClick={vi.fn()} searchPlaceholder="Buscar películas..." />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Buscar películas...')).toBeInTheDocument();
  });

  it('muestra los accesos de notificaciones y ajustes', () => {
    render(
      <MemoryRouter>
        <Navbar onMenuClick={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajustes' })).toBeInTheDocument();
  });

  it('el foco del buscador agrega el anillo visual y un clic afuera lo retira', () => {
    render(
      <MemoryRouter>
        <div>
          <Navbar onMenuClick={vi.fn()} />
          <button type="button">afuera</button>
        </div>
      </MemoryRouter>,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.focus(input);
    expect(input).toHaveClass('ring-2');

    fireEvent.mouseDown(screen.getByRole('button', { name: 'afuera' }));
    expect(input).not.toHaveClass('ring-2');
  });

  it('Enter con texto navega a /buscar con el término como query', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Navbar onMenuClick={vi.fn()} />} />
          <Route path="/buscar" element={<p>Resultados de búsqueda</p>} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'batman' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Resultados de búsqueda')).toBeInTheDocument();
  });

  it('Enter con texto vacío no navega', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Navbar onMenuClick={vi.fn()} />} />
          <Route path="/buscar" element={<p>Resultados de búsqueda</p>} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.queryByText('Resultados de búsqueda')).not.toBeInTheDocument();
  });
});
