import { useAuthStore } from '@/stores/auth-store';
import { JwtPayload, UserRole } from '@/types';
import { format, differenceInSeconds, differenceInMinutes, fromUnixTime, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};

export const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return 'default';
    case 'EMPLOYE':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const checkTokenExpiration = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      console.warn('⚠️ Token sans expiration');
      return { isExpired: true, timeLeft: 0 };
    }

    const now = new Date();
    const expirationDate = fromUnixTime(decoded.exp);
    const isExpired = isAfter(now, expirationDate);

    if (isExpired) {
      console.warn('⚠️ Token expiré');
      return { isExpired: true, timeLeft: 0 };
    }

    const secondsLeft = differenceInSeconds(expirationDate, now);
    const minutesLeft = differenceInMinutes(expirationDate, now);

    // Log selon le temps restant
    if (secondsLeft < 300) {
      // Moins de 5 minutes
      console.warn(
        `⏰ Token expire bientôt: ${Math.floor(secondsLeft / 60)}min ${secondsLeft % 60}s`,
      );
    } else if (minutesLeft < 30) {
      // Moins de 30 minutes
      console.info(`⏳ Token expire dans: ${minutesLeft} minutes`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Token valide pour: ${minutesLeft} minutes`);
    }

    return {
      isExpired: false,
      timeLeft: secondsLeft,
      expirationDate,
      minutesLeft,
      payload: decoded,
    };
  } catch (error) {
    console.error('❌ Erreur lors du décodage du JWT:', error);
    return { isExpired: true, timeLeft: 0 };
  }
};

export const getTokenExpirationInfo = (token?: string) => {
  const currentToken = token || useAuthStore.getState().accessToken;
  if (!currentToken) return null;

  return checkTokenExpiration(currentToken);
};

export const getInitials = (nom: string) => {
  const names = nom.split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  return nom.substring(0, 2).toUpperCase();
};
