'use client';
import { useApiMutation } from '@/hooks/apis/use-api';
import { useAuthStore } from '@/stores/auth-store';
import { UserStorageData } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ApiError } from '@/types/api.types';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'userInvitation';
const ERROR_DURATION = 4000;

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <svg
        className="h-12 w-12"
        stroke="#1F46E4BF"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Chargement"
      >
        <g>
          <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round">
            <animate
              attributeName="stroke-dasharray"
              dur="1.5s"
              calcMode="spline"
              values="0 150;42 150;42 150;42 150"
              keyTimes="0;0.475;0.95;1"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              dur="1.5s"
              calcMode="spline"
              values="0;-16;-59;-59"
              keyTimes="0;0.475;0.95;1"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
              repeatCount="indefinite"
            />
          </circle>
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="2s"
            values="0 12 12;360 12 12"
            repeatCount="indefinite"
          />
        </g>
      </svg>
      <p className="text-muted-foreground mt-2 text-sm">Connexion en cours...</p>
    </div>
  );
}

function ErrorAlert({ error }: { error: ApiError }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur de connexion</AlertTitle>
        <AlertDescription>
          {error.message || "Une erreur inattendue s'est produite lors de la connexion"}
        </AlertDescription>
      </Alert>
    </div>
  );
}

function useUserInvitation() {
  const [userInvited, setUserInvited] = useState<UserStorageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Vérification côté client uniquement
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(STORAGE_KEY);
        const userData = item ? JSON.parse(item) : null;
        setUserInvited(userData);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      setUserInvited(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUserInvitation = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setUserInvited(null);
    }
  }, []);

  return { userInvited, isLoading, clearUserInvitation };
}

export function LoginCompany() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setActiveCompany = useAuthStore((state) => state.setOrganisationActive);
  const organisations = useAuthStore((state) => state.organisations);
  const { userInvited, isLoading: storageLoading, clearUserInvitation } = useUserInvitation();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);
  const router = useRouter();

  const { mutateAsync, isPending, error } = useApiMutation<
    { message: string; token: string; success: boolean },
    UserStorageData
  >('POST', '/org/login-company', {
    onSuccess: (data) => {
      setAccessToken(data.token);
      //mettre la derniere organisation actif
      setActiveCompany(organisations.at(-1)!);
      router.push('/admin');
      clearUserInvitation();
      toast.success('Connexion réussie !', {
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('Erreur de connexion:', error);
      clearUserInvitation();
      toast.error('Erreur lors de la connexion. Veuillez réessayer.', {
        duration: ERROR_DURATION,
      });
    },
  });

  const handleAutoLogin = useCallback(async () => {
    if (!userInvited || hasAttemptedLogin) return;

    try {
      setHasAttemptedLogin(true);
      const { isUser, ...rest } = userInvited;
      await mutateAsync(rest);
    } catch (error) {
      console.error('Erreur lors de la connexion automatique:', error);
    }
  }, [userInvited, hasAttemptedLogin, mutateAsync]);

  useEffect(() => {
    if (!storageLoading && userInvited && !hasAttemptedLogin) {
      handleAutoLogin();
    } else if (!storageLoading && !userInvited && !hasAttemptedLogin) {
      setHasAttemptedLogin(true);
      toast.error('Aucune invitation trouvée. Veuillez vérifier votre lien.', {
        duration: ERROR_DURATION,
      });
    }
  }, [storageLoading, userInvited, hasAttemptedLogin, handleAutoLogin]);

  if (storageLoading) {
    return <LoadingSpinner />;
  }

  if (isPending) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorAlert error={error} />;
  }

  return null;
}
