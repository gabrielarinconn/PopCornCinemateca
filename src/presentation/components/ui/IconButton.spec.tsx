import { render, screen, fireEvent } from '@testing-library/react';
import { Bell } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('expone el `aria-label` como nombre accesible y dispara `onClick`', () => {
    const onClick = vi.fn();
    render(<IconButton icon={Bell} aria-label="Notificaciones" onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Notificaciones' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('acepta la variante `ghost` sin romperse', () => {
    render(<IconButton icon={Bell} aria-label="Notificaciones" variant="ghost" size="lg" />);
    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
  });
});
