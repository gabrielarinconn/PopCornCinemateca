import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import {
  DomainApiError,
  DomainBadRequestError,
  DomainNotFoundError,
  DomainRateLimitError,
} from '../../domain/shared/errors/api-errors';
import { env } from '../../config/env';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbClient: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición: inyecta el token de lectura de TMDB, ya validado por env.ts.
tmdbClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${env.VITE_TMDB_TOKEN}`;
  return config;
});

// Interceptor de Respuesta: atrapa errores y los traduce a errores de dominio.
tmdbClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ status_code?: number; status_message?: string }>) => {
    if (!error.response) {
      return Promise.reject(new DomainApiError('Error de red o servidor no disponible'));
    }

    const status = error.response.status;
    const tmdbCode = error.response.data.status_code;

    if (status === 429) {
      const retryAfterHeader: unknown = error.response.headers['retry-after'];
      const retryAfterSeconds =
        typeof retryAfterHeader === 'string' ? parseInt(retryAfterHeader, 10) : null;
      return Promise.reject(new DomainRateLimitError(retryAfterSeconds));
    }

    // Traducción de código TMDB 34 o HTTP 404
    if (tmdbCode === 34 || status === 404) {
      return Promise.reject(new DomainNotFoundError(error.response.data.status_message));
    }

    // Traducción de código TMDB 22 o HTTP 400
    if (tmdbCode === 22 || status === 400) {
      return Promise.reject(new DomainBadRequestError(error.response.data.status_message));
    }

    return Promise.reject(
      new DomainApiError(
        error.response.data.status_message ?? 'Error en la petición a la API',
        status,
        tmdbCode,
      ),
    );
  },
);
