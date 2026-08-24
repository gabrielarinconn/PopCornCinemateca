import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('el botón de menú dispara `onMenuClick`', () => {
    const onMenuClick = vi.fn();
    render(<Navbar onMenuClick={onMenuClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú lateral' }));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('usa el placeholder de búsqueda recibido', () => {
    render(<Navbar onMenuClick={vi.fn()} searchPlaceholder="Buscar películas..." />);
    expect(screen.getByPlaceholderText('Buscar películas...')).toBeInTheDocument();
  });

  it('muestra los accesos de notificaciones y ajustes', () => {
    render(<Navbar onMenuClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajustes' })).toBeInTheDocument();
  });

  it('el foco del buscador agrega el anillo visual y un clic afuera lo retira', () => {
    render(
      <div>
        <Navbar onMenuClick={vi.fn()} />
        <button type="button">afuera</button>
      </div>,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.focus(input);
    expect(input).toHaveClass('ring-2');

    fireEvent.mouseDown(screen.getByRole('button', { name: 'afuera' }));
    expect(input).not.toHaveClass('ring-2');
  });
});
