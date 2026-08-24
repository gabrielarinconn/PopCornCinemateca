import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterPillGroup } from './FilterPillGroup';

describe('FilterPillGroup', () => {
  it('marca `aria-pressed` en la opción activa y no en las demás', () => {
    render(
      <FilterPillGroup options={['Todas', 'Drama', 'Acción']} active="Drama" onChange={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Drama' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('al hacer clic en una opción, dispara `onChange` con ese valor', () => {
    const onChange = vi.fn();
    render(
      <FilterPillGroup options={['Todas', 'Drama', 'Acción']} active="Todas" onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Acción' }));
    expect(onChange).toHaveBeenCalledWith('Acción');
  });
});
