import { useAuthStore } from '@/stores/auth-store';
import { useMemo } from 'react';

export function useAuthCheck() {
  const { isAuthenticated, accessToken, checkAuthStatus } = useAuthStore();

  const isValid = useMemo(() => {
    return checkAuthStatus();
  }, [isAuthenticated, accessToken, checkAuthStatus]);

  return isValid;
}
