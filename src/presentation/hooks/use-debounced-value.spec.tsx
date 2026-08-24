import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './use-debounced-value';

const DELAY_MS = 400;

function TestComponent({ value }: { value: string }) {
  const debounced = useDebouncedValue(value, DELAY_MS);
  return <p>valor: {debounced}</p>;
}

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('solo adopta el último valor tras una ráfaga de cambios, cuando pasa la espera completa', () => {
    const { rerender } = render(<TestComponent value="a" />);
    expect(screen.getByText('valor: a')).toBeInTheDocument();

    rerender(<TestComponent value="ab" />);
    rerender(<TestComponent value="abc" />);
    rerender(<TestComponent value="abcd" />);

    act(() => {
      vi.advanceTimersByTime(DELAY_MS - 1);
    });
    expect(screen.getByText('valor: a')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText('valor: abcd')).toBeInTheDocument();
  });
});
