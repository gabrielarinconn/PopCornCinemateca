import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppShell } from './AppShell';

function renderAt(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { path: 'explore', element: <div>Contenido de Explorar</div> },
          { path: 'series', element: <div>Contenido de Series</div> },
          { path: 'movies', element: <div>Contenido de Películas</div> },
          { path: 'my-list', element: <div>Contenido de Mi Lista</div> },
          { path: 'pelicula/:movieId', element: <div>Ficha de película</div> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );
  render(<RouterProvider router={router} />);
}

describe('AppShell', () => {
  it('renderiza el contenido de la ruta anidada dentro del layout', () => {
    renderAt('/explore');
    expect(screen.getByText('Contenido de Explorar')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
  });

  it('en rutas normales, muestra la barra de navegación superior', () => {
    renderAt('/explore');
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('en la ficha de película, oculta la barra de navegación superior', () => {
    renderAt('/pelicula/550');
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('el botón de menú móvil abre la barra lateral', () => {
    renderAt('/explore');
    expect(screen.queryByRole('button', { name: 'Cerrar menú lateral' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú lateral' }));
    expect(screen.getByRole('button', { name: 'Cerrar menú lateral' })).toBeInTheDocument();
  });

  it.each([
    ['/series', 'Buscar series, géneros o directores...'],
    ['/movies', 'Buscar películas...'],
    ['/my-list', 'Buscar en Mi Lista...'],
    ['/explore', 'Buscar...'],
  ])('en %s usa el placeholder de búsqueda correspondiente', (path, placeholder) => {
    renderAt(path);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });
});
