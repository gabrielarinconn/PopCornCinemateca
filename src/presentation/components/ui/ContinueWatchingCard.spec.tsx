import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ContinueWatchingCard } from './ContinueWatchingCard';

const baseProps = {
  title: 'Ascension',
  subtitle: 'Temporada 3',
  progress: 40,
  timeRemaining: '20 min restantes',
  imageUrl: 'https://img/ascension.jpg',
};

describe('ContinueWatchingCard', () => {
  it('calcula los atributos aria de progreso a partir de `progress`', () => {
    // Nota: el contenedor de la barra tiene `aria-hidden="true"`, así que
    // este progreso no llega al árbol de accesibilidad pese a sus atributos
    // aria correctos — se consulta con `hidden: true` para verificar los
    // valores, no para afirmar que es accesible.
    render(<ContinueWatchingCard {...baseProps} />);
    const progressbar = screen.getByRole('progressbar', { name: /Ascension/, hidden: true });
    expect(progressbar).toHaveAttribute('aria-valuenow', '40');
  });

  it('en tamaño `lg`, muestra el tiempo restante', () => {
    render(<ContinueWatchingCard {...baseProps} size="lg" />);
    expect(screen.getByText('20 min restantes')).toBeInTheDocument();
  });

  it('en tamaño `sm`, no muestra el tiempo restante', () => {
    render(<ContinueWatchingCard {...baseProps} size="sm" />);
    expect(screen.queryByText('20 min restantes')).not.toBeInTheDocument();
  });

  it('con `href`, se renderiza como enlace', () => {
    render(
      <MemoryRouter>
        <ContinueWatchingCard {...baseProps} href="/pelicula/1" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pelicula/1');
  });
});
