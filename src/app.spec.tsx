import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { router } from '@/presentation/routes/router';

describe('App', () => {
  it('renders the app shell with the site name in the header', () => {
    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    expect(screen.getByRole('link', { name: 'popCorn - Inicio' })).toBeInTheDocument();
  });
});
