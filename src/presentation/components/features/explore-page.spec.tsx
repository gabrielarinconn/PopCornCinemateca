import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ExplorePage } from './explore-page';

describe('ExplorePage', () => {
  it('muestra las secciones de tendencias y continuar viendo con su contenido', () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Tendencias Actuales' })).toBeInTheDocument();
    expect(screen.getByText('Nexus Protocol')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Continuar Viendo' })).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar', { hidden: true }).length).toBeGreaterThan(0);
  });
});
