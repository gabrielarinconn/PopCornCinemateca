    export class DomainApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly tmdbCode?: number
    ) {
        super(message);
        this.name = 'DomainApiError';
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
    constructor(
        public readonly retryAfterSeconds: number | null = null,
        message = 'Límite de peticiones alcanzado (429)'
    ) {
        super(message, 429);
        this.name = 'DomainRateLimitError';
    }
    }

    export class DomainValidationError extends DomainApiError {
    constructor(message = 'La respuesta de la API no coincide con el esquema esperado') {
        super(message);
        this.name = 'DomainValidationError';
    }
    }