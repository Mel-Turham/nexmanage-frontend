'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useApiMutation } from '@/hooks/apis/use-api';
import { InvitationResponse } from '@/types';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitationResponseStore } from '@/stores/invitation-response-store';
import { toast } from 'sonner';

interface Token {
  token: string;
}

enum VerificationState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

function VerifyClientPage({ token }: { token: string }) {
  const router = useRouter();
  const { setUser } = useInvitationResponseStore();
  const [verificationState, setVerificationState] = useState<VerificationState>(
    VerificationState.PENDING
  );
  const [countdown, setCountdown] = useState(3);

  const { mutateAsync, error } = useApiMutation<InvitationResponse, Token>(
    'POST',
    '/auth/verify-magic-link',
    {
      onSuccess: (data) => {
        setVerificationState(VerificationState.ACCEPTED);
        setUser(data);

        // Démarrer le compte à rebours
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push('/auth/create-password');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      },
      onError: (error) => {
        // Déterminer le type d'erreur basé sur le message
        if (error.message.includes('expiré')) {
          setVerificationState(VerificationState.EXPIRED);
        } else if (error.message.includes('invalide')) {
          setVerificationState(VerificationState.REJECTED);
        }
      },
    }
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
          <Card className='w-[400px]'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4'>
                <Clock className='h-16 w-16 text-blue-500 animate-spin' />
              </div>
              <CardTitle className='text-2xl'>
                Vérification en cours...
              </CardTitle>
              <CardDescription>
                Nous vérifions votre lien de vérification
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <div className='flex justify-center items-center space-x-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></div>
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100'></div>
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200'></div>
              </div>
            </CardContent>
          </Card>
        );

      case VerificationState.ACCEPTED:
        return (
          <Card className='w-[400px]'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4'>
                <CheckCircle className='h-16 w-16 text-green-500' />
              </div>
              <CardTitle className='text-2xl text-green-800'>
                Vérification réussie !
              </CardTitle>
              <CardDescription className='text-green-600'>
                Votre compte a été vérifié avec succès
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='text-sm text-green-700 mb-4'>
                Redirection automatique dans {countdown} seconde
                {countdown > 1 ? 's' : ''}...
              </p>
              <Button
                onClick={() => router.push('/auth/create-password')}
                className='bg-green-600 hover:bg-green-700'
              >
                Continuer maintenant
              </Button>
            </CardContent>
          </Card>
        );

      case VerificationState.EXPIRED:
        return (
          <Card className='w-[400px]'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4'>
                <AlertCircle className='h-16 w-16 text-yellow-500' />
              </div>
              <CardTitle className='text-2xl text-yellow-800'>
                Lien expiré
              </CardTitle>
              <CardDescription className='text-yellow-600'>
                Ce lien de vérification a expiré
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <p className='text-sm text-yellow-700'>
                Pour des raisons de sécurité, les liens de vérification expirent
                après un certain temps.
              </p>
              <div className='space-y-2'>
                <Button
                  onClick={() => router.push('/auth/resend-verification')}
                  className='w-full bg-yellow-600 hover:bg-yellow-700'
                >
                  Demander un nouveau lien
                </Button>
                <Button
                  variant='outline'
                  onClick={() => router.push('/auth/login')}
                  className='w-full'
                >
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case VerificationState.REJECTED:
        return (
          <Card className='w-[400px]'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4'>
                <XCircle className='h-16 w-16 text-red-500' />
              </div>
              <CardTitle className='text-2xl text-red-800'>
                Lien invalide
              </CardTitle>
              <CardDescription className='text-red-600'>
                Ce lien de vérification n'est pas valide
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <p className='text-sm text-red-700'>
                Le lien que vous avez utilisé n'est pas valide ou a déjà été
                utilisé.
              </p>
              <div className='space-y-2'>
                <Button
                  onClick={() => router.push('/auth/resend-verification')}
                  className='w-full bg-red-600 hover:bg-red-700'
                >
                  Demander un nouveau lien
                </Button>
                <Button
                  variant='outline'
                  onClick={() => router.push('/auth/login')}
                  className='w-full'
                >
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case VerificationState.EXPIRED:
        return (
          <Card className='w-[400px]'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4'>
                <XCircle className='h-16 w-16 text-red-500' />
              </div>
              <CardTitle className='text-2xl text-red-800'>
                Erreur de vérification
              </CardTitle>
              <CardDescription className='text-red-600'>
                Une erreur est survenue lors de la vérification
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <p className='text-sm text-red-700'>
                {error?.message || "Une erreur inattendue s'est produite"}
              </p>
              <div className='space-y-2'>
                <Button
                  onClick={() => window.location.reload()}
                  className='w-full bg-red-600 hover:bg-red-700'
                >
                  Réessayer
                </Button>
                <Button
                  variant='outline'
                  onClick={() => router.push('/auth/login')}
                  className='w-full'
                >
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}

export default VerifyClientPage;
