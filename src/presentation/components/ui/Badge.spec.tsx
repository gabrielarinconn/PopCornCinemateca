import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza el contenido recibido', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('acepta la variante `outline` sin romperse', () => {
    render(<Badge variant="outline">Destacado</Badge>);
    expect(screen.getByText('Destacado')).toBeInTheDocument();
  });
});
