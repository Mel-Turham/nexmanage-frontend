'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRefreshToken } from '@/hooks/use-refresh-token';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification à placer au niveau racine de l'application
 * Initialise automatiquement le refresh token et vérifie l'état d'authentification
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthenticated, accessToken, refreshToken, logout } = useAuthStore();
  const { refreshTokens } = useRefreshToken();
  useEffect(() => {
    // Vérifier l'état d'authentification au chargement de l'application
    const initializeAuth = async () => {
      if (isAuthenticated && accessToken && refreshToken) {
        // Vérifier si le token d'accès est expiré
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const currentTime = Date.now() / 1000;

          if (payload.exp < currentTime) {
            // Token expiré, essayer de le rafraîchir
            const refreshSuccess = await refreshTokens();
            if (!refreshSuccess) {
              // Si le refresh échoue, déconnecter l'utilisateur
              logout();
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          logout();
        }
      }
    };

    initializeAuth();
  }, [isAuthenticated, accessToken, refreshToken, refreshTokens, logout]);

  return <>{children}</>;
};
