import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('renderiza el contenido recibido', () => {
    render(
      <PageContainer>
        <p>Contenido de la página</p>
      </PageContainer>,
    );
    expect(screen.getByText('Contenido de la página')).toBeInTheDocument();
  });
});
