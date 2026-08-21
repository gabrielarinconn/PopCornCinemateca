import { act, render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { router } from '@/presentation/routes/router';

describe('router', () => {
  it('muestra el nombre del sitio en la ruta raíz', async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { name: 'Cineteca' })).toBeInTheDocument();
  });

  it('muestra la página de "no encontrado" en una ruta inexistente', async () => {
    render(<RouterProvider router={router} />);
    await act(async () => {
      await router.navigate('/esto-no-existe');
    });
    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument();
  });
});
