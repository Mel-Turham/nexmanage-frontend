import { useAuthStore } from '@/stores/auth-store';
import { ApiError } from '@/types/api.types';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Récupérer le token à chaque requête depuis le store
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🚀 ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'Une erreur est survenue',
      status: error.response?.status || 500,
    };

    if (error.response?.data) {
      const data = error.response?.data as Record<string, unknown>;
      apiError.message =
        (data as { message?: string; error?: string }).message ||
        (data as { error?: string }).error ||
        apiError.message;
      const errors = (data as { errors?: unknown }).errors;
      apiError.errors =
        errors && typeof errors === 'object' && !Array.isArray(errors)
          ? (errors as Record<string, string[]>)
          : undefined;
    }

    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      // Nettoyer le store en cas d'erreur 401
      useAuthStore.getState().logout?.();

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(
        `❌ ${error.response?.status} ${error.config?.url}`,
        apiError
      );
    }

    return Promise.reject(apiError);
  }
);
