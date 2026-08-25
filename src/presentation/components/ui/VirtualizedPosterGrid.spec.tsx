import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockElementSize } from '@/test/mock-element-size';
import { VirtualizedPosterGrid, type VirtualizedPosterGridItem } from './VirtualizedPosterGrid';

function items(count: number): VirtualizedPosterGridItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    title: `Película ${String(i)}`,
    meta: '2024',
    imageUrl: `https://img/${String(i)}.jpg`,
    href: `/pelicula/${String(i)}`,
  }));
}

describe('VirtualizedPosterGrid', () => {
  let restoreElementSize: () => void;
  beforeEach(() => {
    restoreElementSize = mockElementSize(1024, 800);
  });
  afterEach(() => {
    restoreElementSize();
  });

  it('con 2.000 elementos, solo monta un puñado de tarjetas en el DOM — el resto no existe hasta hacer scroll', () => {
    render(
      <MemoryRouter>
        <VirtualizedPosterGrid items={items(2000)} />
      </MemoryRouter>,
    );

    const renderedLinks = screen.getAllByRole('link');
    expect(renderedLinks.length).toBeGreaterThan(0);
    // Con overscan + la ventana visible, se renderiza un pequeño múltiplo de
    // las filas visibles — muy lejos de las 2.000 tarjetas totales.
    expect(renderedLinks.length).toBeLessThan(60);
  });

  it('muestra el título de la primera tarjeta, no solo un contenedor vacío', () => {
    render(
      <MemoryRouter>
        <VirtualizedPosterGrid items={items(2000)} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Película 0')).toBeInTheDocument();
  });
});
