import { describe, expect, it } from 'vitest';
import {
  DomainApiError,
  DomainBadRequestError,
  DomainNotFoundError,
} from '@/domain/shared/errors/api-errors';
import { shouldRetryQuery } from './should-retry-query';

describe('shouldRetryQuery', () => {
  it('no reintenta un 404', () => {
    expect(shouldRetryQuery(0, new DomainNotFoundError())).toBe(false);
  });

  it('no reintenta un 400', () => {
    expect(shouldRetryQuery(0, new DomainBadRequestError())).toBe(false);
  });

  it('reintenta un error genérico hasta el tope', () => {
    const error = new DomainApiError('falla transitoria', 500);
    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });
});
