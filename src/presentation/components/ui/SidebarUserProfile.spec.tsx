import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarUserProfile } from './SidebarUserProfile';

describe('SidebarUserProfile', () => {
  it('sin `name`, muestra "Usuario" como marcador de posición', () => {
    render(<SidebarUserProfile />);
    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });

  it('con `name`, lo muestra', () => {
    render(<SidebarUserProfile name="Alex M." />);
    expect(screen.getByText('Alex M.')).toBeInTheDocument();
  });

  it('con `name` e `isPremium`, muestra la insignia Premium', () => {
    render(<SidebarUserProfile name="Alex M." isPremium />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('sin `name`, no muestra la insignia Premium aunque `isPremium` sea true', () => {
    render(<SidebarUserProfile isPremium />);
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });
});
