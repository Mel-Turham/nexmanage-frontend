import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api.types';
import { useAuthStore } from '@/stores/auth-store';
import { checkTokenExpiration } from '@/helpers';

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
    let token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      const tokenStatus = checkTokenExpiration(token);

      if (tokenStatus.isExpired) {
        console.error('❌ Token expiré détecté avant la requête');

        try {
          const refreshApi = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL!,
            withCredentials: true,
          });

          console.log('🔄 Tentative de refresh du token expiré...');
          const response = await refreshApi.post('/auth/refresh-token');
          const newToken = response.data.token;

          console.log('✅ Nouveau token obtenu avec succès');

          const newTokenStatus = checkTokenExpiration(newToken);
          if (newTokenStatus.isExpired) {
            console.error('❌ Le nouveau token est déjà expiré!');
            throw new Error('Token refresh invalide');
          }
          useAuthStore.getState().setAccessToken(newToken);
          token = newToken;
        } catch (refreshError) {
          console.error('⛔ Impossible de refresh le token:', refreshError);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(new Error('Token expiré et refresh impossible'));
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data,
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
        const newTokenStatus = checkTokenExpiration(newToken);

        if (newTokenStatus.isExpired) {
          console.error('❌ Le nouveau token est déjà expiré!');
          throw new Error('Token refresh invalide');
        }
        useAuthStore.getState().setAccessToken(newToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error('⛔ Refresh token invalide ou expiré:', refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
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
      console.error(`❌ ${error.response?.status} ${error.config?.url}`, apiError);
    }

    return Promise.reject(apiError);
  },
);
