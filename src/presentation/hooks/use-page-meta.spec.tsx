import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePageMeta } from './use-page-meta';

function TestPage({ title }: { title: string }) {
  const headingRef = usePageMeta(title);
  return (
    <h1 ref={headingRef} tabIndex={-1}>
      Encabezado
    </h1>
  );
}

describe('usePageMeta', () => {
  it('actualiza document.title y mueve el foco al encabezado', () => {
    render(<TestPage title="Ficha — Cineteca" />);

    expect(document.title).toBe('Ficha — Cineteca');
    expect(screen.getByRole('heading', { name: 'Encabezado' })).toHaveFocus();
  });
});
