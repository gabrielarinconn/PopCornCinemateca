import { render, screen, fireEvent } from '@testing-library/react';
import { Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('dispara `onClick` al hacer clic', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('con `isLoading`, se deshabilita y no dispara `onClick`', () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Guardar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('con `icon`, lo muestra junto al texto', () => {
    render(
      <Button icon={Plus} iconPosition="right">
        Agregar
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Agregar' }).querySelector('svg')).toBeVisible();
  });

  it('respeta `disabled` explícito', () => {
    render(<Button disabled>Guardar</Button>);
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });
});
