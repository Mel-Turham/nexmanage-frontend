import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from '@/types/api.types';
import { useAuthStore } from '@/stores/auth-store';

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
  (error: AxiosError) => Promise.reject(error)
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
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      try {
        const refreshApi = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL!,
          withCredentials: true,
        });

        const response = await refreshApi.post('/auth/refresh-token');

        const newToken = response.data.token;
        console.log('🔄 Nouveau token reçu:', newToken);

        // ✅ Mise à jour du store Zustand
        useAuthStore.getState().setAccessToken(newToken);

        // ✅ Ajout du nouveau token dans la requête d’origine
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return api(originalRequest); // 🔁 relance la requête automatiquement
      } catch (refreshError) {
        console.error('⛔ Refresh token invalide ou expiré:', refreshError);

        // ✅ Redirige vers login si refresh échoue
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // ✅ Extraction propre des messages d'erreur du backend
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
