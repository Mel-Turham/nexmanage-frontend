// stores/auth-store.ts
import { AuthTokens, ResponseLogin, User } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
interface AuthState {
  // État
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (loginResponse: ResponseLogin) => void;
  logout: () => void;
  updateTokens: (tokens: AuthTokens) => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;

  // Utilitaires
  getAuthHeaders: () => { Authorization: string } | {};
  isTokenExpired: (token: string) => boolean;
  checkAuthStatus: () => boolean;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const syncWithCookies = (state: Partial<AuthState>) => {
  if (typeof window !== 'undefined') {
    if (state.isAuthenticated && state.accessToken) {
      // Stocker les informations importantes dans les cookies
      Cookies.set('auth-token', state.accessToken, {
        expires: 7, // 7 jours
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      Cookies.set('auth-status', 'authenticated', {
        expires: 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    } else {
      // Supprimer les cookies lors de la déconnexion
      Cookies.remove('auth-token');
      Cookies.remove('auth-status');
    }
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Action de connexion
      login: (loginResponse: ResponseLogin) => {
        set({
          user: loginResponse.user,
          accessToken: loginResponse.access_token,
          refreshToken: loginResponse.refresh_token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Action de déconnexion
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Optionnel: Rediriger vers la page de connexion
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      // Mettre à jour les tokens
      updateTokens: (tokens: AuthTokens) => {
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        });
      },

      // Mettre à jour l'utilisateur
      updateUser: (user: User) => {
        set({ user });
      },

      // Mettre à jour l'état de chargement
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Obtenir les en-têtes d'authentification
      getAuthHeaders: () => {
        const { accessToken } = get();
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      },

      // Vérifier si le token est expiré
      isTokenExpired: (token: string) => isTokenExpired(token),

      // Vérifier le statut d'authentification
      checkAuthStatus: () => {
        const { accessToken, isAuthenticated } = get();

        if (!isAuthenticated || !accessToken) {
          return false;
        }

        // Vérifier si le token est expiré
        if (isTokenExpired(accessToken)) {
          // Token expiré, déconnecter automatiquement
          get().logout();
          return false;
        }

        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Vérifier l'état après réhydratation
        if (state) {
          state.checkAuthStatus();
        }
      },
    }
  )
);
