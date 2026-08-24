import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Compass } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('en la ruta activa, marca `aria-current="page"`', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <NavItem icon={Compass} label="Explorar" to="/explore" isActive />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Explorar' })).toHaveAttribute('aria-current', 'page');
  });

  it('fuera de la ruta activa, no marca `aria-current`', () => {
    render(
      <MemoryRouter initialEntries={['/movies']}>
        <NavItem icon={Compass} label="Explorar" to="/explore" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Explorar' })).not.toHaveAttribute('aria-current');
  });
});
