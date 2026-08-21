import { describe, expect, it } from 'vitest';
import {
  DomainApiError,
  DomainBadRequestError,
  DomainNotFoundError,
  DomainRateLimitError,
  DomainValidationError,
} from './api-errors';

describe('DomainApiError', () => {
  it('guarda el código HTTP y el código propio de TMDB', () => {
    const error = new DomainApiError('algo falló', 500, 99);
    expect(error.statusCode).toBe(500);
    expect(error.tmdbCode).toBe(99);
  });
});

describe('DomainNotFoundError', () => {
  it('mapea al HTTP 404 y al código 34 de TMDB', () => {
    const error = new DomainNotFoundError();
    expect(error).toBeInstanceOf(DomainApiError);
    expect(error.statusCode).toBe(404);
    expect(error.tmdbCode).toBe(34);
  });
});

describe('DomainBadRequestError', () => {
  it('mapea al HTTP 400 y al código 22 de TMDB', () => {
    const error = new DomainBadRequestError();
    expect(error.statusCode).toBe(400);
    expect(error.tmdbCode).toBe(22);
  });

  it('acepta un mensaje propio', () => {
    const error = new DomainBadRequestError('página inválida');
    expect(error.message).toBe('página inválida');
  });
});

describe('DomainRateLimitError', () => {
  it('guarda los segundos de espera que indica el servidor', () => {
    const error = new DomainRateLimitError(12);
    expect(error.retryAfterSeconds).toBe(12);
    expect(error.statusCode).toBe(429);
  });

  it('acepta no tener segundos de espera', () => {
    const error = new DomainRateLimitError();
    expect(error.retryAfterSeconds).toBeNull();
  });
});

describe('DomainValidationError', () => {
  it('tiene un mensaje por defecto', () => {
    const error = new DomainValidationError();
    expect(error.message).toContain('esquema esperado');
  });
});
