import { DomainBadRequestError, DomainNotFoundError } from '@/domain/shared/errors/api-errors';

const MAX_RETRIES = 2;

/**
 * Un 404 o un 400 no se reintenta — reintentar no va a hacer que la
 * película exista o que la petición inválida se vuelva válida. Un error de
 * red transitorio sí, hasta un par de veces.
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof DomainNotFoundError || error instanceof DomainBadRequestError) {
    return false;
  }
  return failureCount < MAX_RETRIES;
}
