import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('env', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('expone las variables cuando el token es válido', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', 'x'.repeat(40));
    const { env } = await import('./env');
    expect(env.VITE_TMDB_TOKEN).toBe('x'.repeat(40));
    expect(env.VITE_TMDB_API_BASE).toBe('https://api.themoviedb.org');
    expect(env.VITE_TMDB_IMAGE_BASE).toBe('https://image.tmdb.org/t/p');
  });

  it('muere al importarse con un mensaje claro si falta el token', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', '');
    await expect(import('./env')).rejects.toThrow('Configuración inválida');
  });
});
