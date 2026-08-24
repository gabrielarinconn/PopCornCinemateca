import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MiniPlayerBar } from './MiniPlayerBar';

const baseProps = { title: 'Ascension (T3:E1)', thumbnailUrl: 'https://img/thumb.jpg' };

describe('MiniPlayerBar', () => {
  it('en pausa, el botón principal dice "Reproducir"', () => {
    render(<MiniPlayerBar {...baseProps} isPlaying={false} />);
    expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument();
  });

  it('reproduciendo, el botón principal dice "Pausar"', () => {
    render(<MiniPlayerBar {...baseProps} isPlaying />);
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
  });

  it('dispara `onPlayPause`, `onPrevious` y `onNext`', () => {
    const onPlayPause = vi.fn();
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(
      <MiniPlayerBar
        {...baseProps}
        onPlayPause={onPlayPause}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reproducir' }));
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(onPlayPause).toHaveBeenCalledTimes(1);
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
