    import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
    import {
    DomainApiError,
    DomainBadRequestError,
    DomainNotFoundError,
    DomainRateLimitError,
    } from '../../domain/shared/errors/api-errors';

    // 1. Instancia única de Axios
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    export const tmdbClient: AxiosInstance = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    // Interceptor de Petición (Request): Inyecta el Token de Lectura de la API de TMDB si existe en el entorno
    tmdbClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = import.meta.env.VITE_TMDB_READ_TOKEN || import.meta.env.VITE_TMDB_API_KEY;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });

    // Interceptor de Respuesta (Response): Atrapa errores y los traduce a Errores de Dominio
    tmdbClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ status_code?: number; status_message?: string }>) => {
        if (!error.response) {
        return Promise.reject(new DomainApiError('Error de red o servidor no disponible'));
        }

        const status = error.response.status;
        const tmdbCode = error.response.data?.status_code;

        // Manejo de 429: Rate Limit
        if (status === 429) {
        const retryAfterHeader = error.response.headers['retry-after'];
        const retryAfterSeconds = retryAfterHeader ? parseInt(String(retryAfterHeader), 10) : null;
        return Promise.reject(new DomainRateLimitError(retryAfterSeconds));
        }

        // Traducción de código TMDB 34 o HTTP 404
        if (tmdbCode === 34 || status === 404) {
        return Promise.reject(new DomainNotFoundError(error.response.data?.status_message));
        }

        // Traducción de código TMDB 22 o HTTP 400
        if (tmdbCode === 22 || status === 400) {
        return Promise.reject(new DomainBadRequestError(error.response.data?.status_message));
        }

        // Errores genéricos
        return Promise.reject(
        new DomainApiError(
            error.response.data?.status_message || 'Error en la petición a la API',
            status,
            tmdbCode
        )
        );
    }
    );