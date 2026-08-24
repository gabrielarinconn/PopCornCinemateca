import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { TrendingUp } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('con `href`, muestra un enlace con la etiqueta por defecto', () => {
    render(
      <MemoryRouter>
        <SectionHeader title="Tendencias" href="/tendencias" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Ver Todo' })).toHaveAttribute('href', '/tendencias');
  });

  it('sin `href`, no muestra ningún enlace', () => {
    render(
      <MemoryRouter>
        <SectionHeader title="Tendencias" />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('con `linkLabel` propio, lo usa en vez del texto por defecto', () => {
    render(
      <MemoryRouter>
        <SectionHeader title="Tendencias" href="/tendencias" linkLabel="Ver más" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Ver más' })).toBeInTheDocument();
  });

  it('con `icon`, lo renderiza junto al título', () => {
    render(
      <MemoryRouter>
        <SectionHeader title="Trending Now" icon={TrendingUp} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Trending Now' }).parentElement?.querySelector('svg'),
    ).toBeVisible();
  });
});
