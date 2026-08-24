import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { PosterCard } from './PosterCard';

const baseProps = { title: 'Batman', meta: '1989 · Acción', imageUrl: 'https://img/batman.jpg' };

describe('PosterCard', () => {
  it('con `href`, se renderiza como enlace a esa ruta', () => {
    render(
      <MemoryRouter>
        <PosterCard {...baseProps} href="/pelicula/268" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Batman/ })).toHaveAttribute('href', '/pelicula/268');
  });

  it('sin `href`, no se renderiza como enlace', () => {
    render(
      <MemoryRouter>
        <PosterCard {...baseProps} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Batman')).toBeInTheDocument();
  });

  it('con `rating`, lo muestra con un decimal', () => {
    render(
      <MemoryRouter>
        <PosterCard {...baseProps} rating={7.2} />
      </MemoryRouter>,
    );
    expect(screen.getByText('7.2')).toBeInTheDocument();
  });

  it('sin `rating`, no muestra la insignia de valoración', () => {
    render(
      <MemoryRouter>
        <PosterCard {...baseProps} />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/^\d\.\d$/)).not.toBeInTheDocument();
  });

  it('con `badge`, lo muestra', () => {
    render(
      <MemoryRouter>
        <PosterCard {...baseProps} badge="Top 10" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Top 10')).toBeInTheDocument();
  });
});
