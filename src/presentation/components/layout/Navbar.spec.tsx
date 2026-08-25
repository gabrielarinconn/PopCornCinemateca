import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from './Navbar';

function renderWithRouter(
  onMenuClick: () => void,
  searchPlaceholder = 'Search...',
  initialPath = '/inicio',
) {
  const router = createMemoryRouter(
    [
      {
        path: '/inicio',
        element: <Navbar onMenuClick={onMenuClick} searchPlaceholder={searchPlaceholder} />,
      },
      { path: '/buscar', element: <div>Página de búsqueda</div> },
    ],
    { initialEntries: [initialPath] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('Navbar', () => {
  it('el botón de menú dispara `onMenuClick`', () => {
    const onMenuClick = vi.fn();
    renderWithRouter(onMenuClick);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú lateral' }));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('usa el placeholder de búsqueda recibido', () => {
    renderWithRouter(vi.fn(), 'Buscar películas...');
    expect(screen.getByPlaceholderText('Buscar películas...')).toBeInTheDocument();
  });

  it('muestra los accesos de notificaciones y ajustes', () => {
    renderWithRouter(vi.fn());
    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajustes' })).toBeInTheDocument();
  });

  it('el foco del buscador agrega el anillo visual y un clic afuera lo retira', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/inicio',
          element: (
            <div>
              <Navbar onMenuClick={vi.fn()} />
              <button type="button">afuera</button>
            </div>
          ),
        },
      ],
      { initialEntries: ['/inicio'] },
    );
    render(<RouterProvider router={router} />);

    const input = screen.getByRole('searchbox');
    fireEvent.focus(input);
    expect(input).toHaveClass('ring-2');

    fireEvent.mouseDown(screen.getByRole('button', { name: 'afuera' }));
    expect(input).not.toHaveClass('ring-2');
  });

  it('enviar el formulario de búsqueda navega a /buscar con el término escrito', async () => {
    const router = renderWithRouter(vi.fn());

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'minion' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(await screen.findByText('Página de búsqueda')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/buscar');
    expect(router.state.location.search).toBe('?q=minion');
  });

  it('enviar una búsqueda vacía no navega', () => {
    const router = renderWithRouter(vi.fn());

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(router.state.location.pathname).toBe('/inicio');
  });
});
