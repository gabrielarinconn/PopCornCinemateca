import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { SeriesPage } from './series-page';

describe('SeriesPage', () => {
  it('muestra el destacado, el filtro de géneros y el reproductor mini', () => {
    render(
      <MemoryRouter>
        <SeriesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Series' })).toBeInTheDocument();
    expect(screen.getByText('Ascension')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Mini reproductor' })).toBeInTheDocument();
  });

  it('al elegir un filtro, se marca como activo', () => {
    render(
      <MemoryRouter>
        <SeriesPage />
      </MemoryRouter>,
    );

    const dramaFilter = screen.getByRole('button', { name: 'Drama' });
    expect(dramaFilter).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(dramaFilter);
    expect(dramaFilter).toHaveAttribute('aria-pressed', 'true');
  });
});
