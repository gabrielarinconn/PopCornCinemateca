import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeaturedBanner } from './FeaturedBanner';

const baseProps = {
  title: 'Ascension',
  description: 'Una nueva era comienza.',
  imageUrl: 'https://img/ascension.jpg',
};

describe('FeaturedBanner', () => {
  it('dispara `onPlay` y `onAddToList` desde sus botones', () => {
    const onPlay = vi.fn();
    const onAddToList = vi.fn();
    render(<FeaturedBanner {...baseProps} onPlay={onPlay} onAddToList={onAddToList} />);

    fireEvent.click(screen.getByRole('button', { name: 'Reproducir Ascension' }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Ascension a Mi Lista' }));

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onAddToList).toHaveBeenCalledTimes(1);
  });

  it('con `badge` y `rating`, los muestra', () => {
    render(<FeaturedBanner {...baseProps} badge="Original" rating={8.5} />);
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('sin `badge` ni `rating`, no los muestra', () => {
    render(<FeaturedBanner {...baseProps} />);
    expect(screen.queryByText('Original')).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d\.\d$/)).not.toBeInTheDocument();
  });

  it('con `watermark`, lo muestra', () => {
    render(<FeaturedBanner {...baseProps} watermark="ASCENSION" />);
    expect(screen.getByText('ASCENSION')).toBeInTheDocument();
  });
});
