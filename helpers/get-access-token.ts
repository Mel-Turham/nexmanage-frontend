import { useAuthStore } from '@/stores/auth-store';
import { isTokenExpired } from './token-expried';

export function getAccessToken() {
  const { accessToken, logout, checkAuthStatus } = useAuthStore.getState();
  const isValid = checkAuthStatus();

  return {
    accessToken: isValid ? accessToken : null,
    logout,
    isValid,
  };
}

export function getTokenFromCookies(cookieHeader?: string) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies['auth-token'] || null;
}
