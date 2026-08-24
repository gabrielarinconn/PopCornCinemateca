import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RankedFeatureCard } from './RankedFeatureCard';

const baseProps = { rank: 1, title: 'Ascension', imageUrl: 'https://img/ascension.jpg' };

describe('RankedFeatureCard', () => {
  it('muestra el número de ranking', () => {
    render(<RankedFeatureCard {...baseProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('sin `simple`, muestra descripción y botones de acción', () => {
    render(<RankedFeatureCard {...baseProps} description="Una nueva era comienza." />);
    expect(screen.getByText('Una nueva era comienza.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reproducir Ascension' })).toBeInTheDocument();
  });

  it('con `simple`, oculta descripción y botones de acción', () => {
    render(<RankedFeatureCard {...baseProps} simple description="Una nueva era comienza." />);
    expect(screen.queryByText('Una nueva era comienza.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reproducir Ascension' })).not.toBeInTheDocument();
  });

  it('con `meta`, la muestra incluso en modo simple', () => {
    render(<RankedFeatureCard {...baseProps} simple meta="8 episodios" />);
    expect(screen.getByText('8 episodios')).toBeInTheDocument();
  });
});
