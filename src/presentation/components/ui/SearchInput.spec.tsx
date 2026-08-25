import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('usa el `placeholder` recibido', () => {
    render(<SearchInput placeholder="Buscar películas..." />);
    expect(screen.getByPlaceholderText('Buscar películas...')).toBeInTheDocument();
  });

  it('reenvía props nativas como `onChange`', () => {
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'batman' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
