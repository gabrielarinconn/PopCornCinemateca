import { render, screen, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScrollDirection } from './use-scroll-direction';

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
}

function TestComponent() {
  const direction = useScrollDirection();
  return <p>dirección: {direction ?? 'ninguna'}</p>;
}

describe('useScrollDirection', () => {
  it('empieza sin dirección', () => {
    setScrollY(0);
    render(<TestComponent />);
    expect(screen.getByText('dirección: ninguna')).toBeInTheDocument();
  });

  it('al bajar, detecta scroll hacia abajo', () => {
    setScrollY(0);
    render(<TestComponent />);

    setScrollY(100);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByText('dirección: down')).toBeInTheDocument();
  });

  it('al subir desde una posición avanzada, detecta scroll hacia arriba', () => {
    setScrollY(200);
    render(<TestComponent />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByText('dirección: down')).toBeInTheDocument();

    setScrollY(100);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByText('dirección: up')).toBeInTheDocument();
  });

  it('al volver al tope (scrollY <= 0), limpia la dirección', () => {
    setScrollY(100);
    render(<TestComponent />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByText('dirección: down')).toBeInTheDocument();

    setScrollY(0);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByText('dirección: ninguna')).toBeInTheDocument();
  });
});
