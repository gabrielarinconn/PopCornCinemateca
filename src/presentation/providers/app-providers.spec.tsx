import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from './app-providers';

function Bomb(): never {
  throw new Error('boom');
}

describe('AppProviders', () => {
  it('renderiza a los hijos normalmente', () => {
    render(
      <AppProviders>
        <p>contenido</p>
      </AppProviders>,
    );
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });

  it('atrapa un error de render y muestra el mensaje genérico, sin dejar la pantalla en blanco', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <AppProviders>
        <Bomb />
      </AppProviders>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal');
    consoleError.mockRestore();
  });
});
