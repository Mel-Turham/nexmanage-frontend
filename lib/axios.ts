import { ApiError } from '@/types/api.types';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/auth-store';

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor asynchrone
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const apiError: ApiError = {
      message: 'Une erreur est survenue',
      status: error.response?.status || 500,
    };

    // 👉 Gestion automatique du refresh token
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post(
          `/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;
        console.log('Nouveau token:', newToken);

        // Stocker le nouveau token dans Zustand
        useAuthStore.getState().setAccessToken(newToken);

        // Relancer la requête avec le nouveau token
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return api(originalRequest); // relance automatique
      } catch (refreshError) {
        // Échec du refresh : rediriger vers login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // Gestion personnalisée des erreurs
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
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

    if (process.env.NODE_ENV === 'development') {
      console.error(
        `❌ ${error.response?.status} ${error.config?.url}`,
        apiError
      );
    }

    return Promise.reject(apiError);
  }
);
