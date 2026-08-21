export class DomainApiError extends Error {
  readonly statusCode?: number | undefined;
  readonly tmdbCode?: number | undefined;

  constructor(message: string, statusCode?: number, tmdbCode?: number) {
    super(message);
    this.name = 'DomainApiError';
    this.statusCode = statusCode;
    this.tmdbCode = tmdbCode;
  }
}

export class DomainNotFoundError extends DomainApiError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 34);
    this.name = 'DomainNotFoundError';
  }
}

export class DomainBadRequestError extends DomainApiError {
  constructor(message = 'Petición inválida o parámetros incorrectos') {
    super(message, 400, 22);
    this.name = 'DomainBadRequestError';
  }
}

export class DomainRateLimitError extends DomainApiError {
  readonly retryAfterSeconds: number | null;

  constructor(
    retryAfterSeconds: number | null = null,
    message = 'Límite de peticiones alcanzado (429)',
  ) {
    super(message, 429);
    this.name = 'DomainRateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class DomainValidationError extends DomainApiError {
  constructor(message = 'La respuesta de la API no coincide con el esquema esperado') {
    super(message);
    this.name = 'DomainValidationError';
  }
}
