import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('sin `src`, muestra las iniciales de `fallback`', () => {
    render(<Avatar fallback="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('sin `fallback` ni `src`, muestra un signo de interrogación', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('con `src`, muestra la imagen en vez de las iniciales', () => {
    render(<Avatar src="https://example.com/a.jpg" alt="Jane" fallback="Jane Doe" />);
    expect(screen.getByRole('img', { name: 'Jane' })).toHaveAttribute(
      'src',
      'https://example.com/a.jpg',
    );
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });
});
