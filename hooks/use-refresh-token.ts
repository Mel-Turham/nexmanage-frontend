// import { useAuthStore } from '@/stores/auth-store';
// import { useCallback, useEffect, useRef } from 'react';
// import { useApiMutation } from './apis/use-api';
// import { RefreshTokenResponse } from '@/types';
// import { toast } from 'sonner';

// export const useRefreshToken = () => {
//   const {

//     accessToken,

//     logout,

//     isAuthenticated,
//   } = useAuthStore();

//   const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const isRefreshingRef = useRef(false);

//   const refreshMutation = useApiMutation<
//     RefreshTokenResponse,
//     { refresh_token: string }
//   >('POST', '/auth/refresh-token', {
//     onSuccess: (data) => {
//       updateTokens({
//         access_token: data.access_token,
//         refresh_token: data.refresh_token,
//       });
//       isRefreshingRef.current = false;
//       console.log('Tokens refreshed successfully:', data);
//     },

//     onError: (error) => {
//       console.error('Erreur lors du refresh token:', error);
//       toast.error('Session expirée, veuillez vous reconnecter');
//       logout();
//       isRefreshingRef.current = false;
//     },
//   });

//   //Fonction pour rafraîchir le token
//   const refreshTokens = useCallback(async () => {
//     if (!refreshToken || !isRefreshingRef.current) return false;

//     //verifier si le token de rafraîchissement est expiré
//     if (isTokenExpired(refreshToken)) {
//       console.log('Refresh token expiré');
//       logout();
//       return false;
//     }
//     try {
//       isRefreshingRef.current = true;
//       await refreshMutation.mutateAsync({ refresh_token: refreshToken });
//       return true;
//     } catch (error) {
//       console.error('Erreur refresh token:', error);
//       return false;
//     }
//   }, [refreshToken, refreshMutation, logout, isTokenExpired]);

//   // Fonction pour vérifier si le token a besoin d'être rafraîchi
//   const shouldRefreshToken = useCallback(() => {
//     if (!accessToken || !isAuthenticated) return false;

//     try {
//       const payload = JSON.parse(atob(accessToken.split('.')[1]));
//       const currentTime = Date.now() / 1000;
//       const timeUntilExpiry = payload.exp - currentTime;

//       // Rafraîchir si le token expire dans moins de 5 minutes (300 secondes)
//       return timeUntilExpiry < 300;
//     } catch (error) {
//       return true; // En cas d'erreur, essayer de rafraîchir
//     }
//   }, [accessToken, isAuthenticated]);

//   // Fonction pour démarrer la vérification automatique

//   const startTokenRefreshInterval = useCallback(() => {
//     // Nettoyer l'intervalle existant
//     if (refreshIntervalRef.current) {
//       clearInterval(refreshIntervalRef.current);
//     }

//     // Démarrer un nouvel intervalle de vérification toutes les 5 minutes
//     refreshIntervalRef.current = setInterval(() => {
//       if (shouldRefreshToken()) {
//         refreshTokens();
//       }
//     }, 5 * 60 * 1000); // 5 minutes
//   }, [shouldRefreshToken, refreshTokens]);

//   // Fonction pour arrêter la vérification automatique
//   const stopTokenRefreshInterval = useCallback(() => {
//     if (refreshIntervalRef.current) {
//       clearInterval(refreshIntervalRef.current);
//       refreshIntervalRef.current = null;
//     }
//   }, []);

//   // Effet pour gérer l'intervalle de refresh automatique
//   useEffect(() => {
//     if (isAuthenticated && accessToken && refreshToken) {
//       // Vérifier immédiatement si le token a besoin d'être rafraîchi
//       if (shouldRefreshToken()) {
//         refreshTokens();
//       }

//       // Démarrer l'intervalle de vérification
//       startTokenRefreshInterval();
//     } else {
//       // Arrêter l'intervalle si l'utilisateur n'est pas connecté
//       stopTokenRefreshInterval();
//     }

//     // Nettoyage à la destruction du composant
//     return () => {
//       stopTokenRefreshInterval();
//     };
//   }, [
//     isAuthenticated,
//     accessToken,
//     refreshToken,
//     shouldRefreshToken,
//     refreshTokens,
//     startTokenRefreshInterval,
//     stopTokenRefreshInterval,
//   ]);

//   return {
//     refreshTokens,
//     isRefreshing: isRefreshingRef.current,
//     startTokenRefreshInterval,
//     stopTokenRefreshInterval,
//   };
// };
