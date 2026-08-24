import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { MoviesPage } from './movies-page';

describe('MoviesPage', () => {
  it('muestra el Top 10, las obras maestras y el perfil de usuario', () => {
    render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Top 10 Esta Semana' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Obras Maestras del Cine' })).toBeInTheDocument();

    // La tarjeta vacía (`EmptyPosterCard`) se intercala junto a las reales.
    expect(screen.getByText('Ecos del Pasado')).toBeInTheDocument();

    // Sin `name`, `SidebarUserProfile` cae al marcador de posición.
    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });
});
