import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { EmptyPosterCard } from './EmptyPosterCard';

describe('EmptyPosterCard', () => {
  it('con `href`, se renderiza como enlace', () => {
    render(
      <MemoryRouter>
        <EmptyPosterCard title="Próximamente" meta="Sin fecha" href="/proximamente" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Próximamente/ })).toHaveAttribute(
      'href',
      '/proximamente',
    );
  });

  it('sin `href`, no se renderiza como enlace', () => {
    render(
      <MemoryRouter>
        <EmptyPosterCard title="Próximamente" meta="Sin fecha" />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
  });
});
