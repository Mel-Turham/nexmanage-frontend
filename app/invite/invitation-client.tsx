'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiMutation } from '@/hooks/apis/use-api';
import { UserInvitationResponse } from '@/types';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

enum VerificationState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

const InvitationClientPage = ({ token }: { token: string }) => {
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>(
    VerificationState.PENDING,
  );
  const [countdown, setCountdown] = useState(3);

  const { error, mutateAsync } = useApiMutation<UserInvitationResponse, { token: string }>(
    'POST',
    '/org/verify-invitation',
    {
      onSuccess: (data) => {
        const {
          result: { invitation },
        } = data;

        if (!invitation.isUser) {
          localStorage.setItem('userInvitation', JSON.stringify(invitation));
          router.push('/create-password');
        } else {
          localStorage.setItem('userInvitation', JSON.stringify(invitation));
          router.push('/login-company');
        }
        setVerificationState(VerificationState.ACCEPTED);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      },
      onError: (error) => {
        if (error.message.includes('expiré')) {
          setVerificationState(VerificationState.EXPIRED);
        } else if (error.message.includes('invalide')) {
          setVerificationState(VerificationState.REJECTED);
        }
      },
    },
  );

  useEffect(() => {
    if (!token) {
      setVerificationState(VerificationState.REJECTED);
      return;
    }

    async function verify() {
      try {
        await mutateAsync({ token });
      } catch (error) {
        // L'erreur est déjà gérée dans onError
        console.error('Erreur de vérification:', error);
      }
    }

    verify();
  }, [token, mutateAsync]);
  const renderContent = () => {
    switch (verificationState) {
      case VerificationState.PENDING:
        return (
          <Card className="w-[400px]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Clock className="h-16 w-16 animate-spin text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Vérification en cours...</CardTitle>
              <CardDescription>Nous vérifions votre lien de vérification</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-100"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-200"></div>
              </div>
            </CardContent>
          </Card>
        );

      case VerificationState.ACCEPTED:
        return (
          <Card className="w-[400px]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-800">Vérification réussie !</CardTitle>
              <CardDescription className="text-green-600">
                Votre compte a été vérifié avec succès
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-sm text-green-700">
                Redirection automatique dans {countdown} seconde
                {countdown > 1 ? 's' : ''}...
              </p>
            </CardContent>
          </Card>
        );

      case VerificationState.EXPIRED:
        return (
          <Card className="w-[400px]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <AlertCircle className="h-16 w-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl text-yellow-800">Lien expiré</CardTitle>
              <CardDescription className="text-yellow-600">
                Ce lien de vérification a expiré
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-yellow-700">
                Pour des raisons de sécurité, les liens de vérification expirent après un certain
                temps.
              </p>
            </CardContent>
          </Card>
        );

      case VerificationState.REJECTED:
        return (
          <Card className="w-[400px]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-800">Lien invalide</CardTitle>
              <CardDescription className="text-red-600">
                Ce lien de vérification n&aposz;est pas valide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-red-700">
                Le lien que vous avez utilisé n&apos;est pas valide ou a déjà été utilisé.
              </p>
            </CardContent>
          </Card>
        );

      case VerificationState.EXPIRED:
        return (
          <Card className="w-[400px]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-800">Erreur de vérification</CardTitle>
              <CardDescription className="text-red-600">
                Une erreur est survenue lors de la vérification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-red-700">
                {error?.message || "Une erreur inattendue s'est produite"}
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };
  return <div>{renderContent()}</div>;
};

export default InvitationClientPage;
