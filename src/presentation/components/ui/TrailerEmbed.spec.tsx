import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TrailerEmbed } from './TrailerEmbed';

describe('TrailerEmbed', () => {
  it('arma la URL de incrustación de YouTube a partir de `videoKey`', () => {
    render(<TrailerEmbed videoKey="abc123" title="Tráiler Oficial" />);

    const iframe = screen.getByTitle('Tráiler de Tráiler Oficial');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/abc123');
  });

  it('muestra el título recibido', () => {
    render(<TrailerEmbed videoKey="abc123" title="Tráiler Oficial" />);
    expect(screen.getByText('Tráiler Oficial')).toBeInTheDocument();
  });
});
