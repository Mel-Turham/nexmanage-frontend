'use client';

import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from '@/schemas/auth.schemas/forgot-password.schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useApiMutation } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    telephone: string;
  };
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [switchField, setSwitchField] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>('');

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: '',
      email: '',
    },
  });

  const handlePreviousPage = () => {
    router.back();
  };

  const forgotPasswordMutation = useApiMutation<
    ForgotPasswordResponse,
    ForgotPasswordSchema
  >('POST', '/auth/forgot-password', {
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/otp');
    },
    onError: (error) => {
      toast.error(
        error.message || "Erreur lors de l'envoi du code de vérification",
        {
          duration: 4000,
        }
      );
      console.error('Erreur de connexion :', error);
    },
  });

  const watchFieldPhone = form.watch('phone');
  const watchFieldEmail = form.watch('email');

  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || (fieldValue && fieldValue.length > 0);
  };

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      // Nettoyer les données avant l'envoi
      const cleanData: ForgotPasswordSchema = {
        phone: switchField ? data.phone : '',
        email: !switchField ? data.email : '',
      };

      // Stocker l'information de contact appropriée
      if (switchField && data.phone) {
        localStorage.setItem('reset-phone', data.phone);
        localStorage.removeItem('reset-email');
      } else if (!switchField && data.email) {
        localStorage.setItem('reset-email', data.email);
        localStorage.removeItem('reset-phone');
      }

      await forgotPasswordMutation.mutateAsync(cleanData);
    } catch (error) {
      console.log('Erreur :', error);
    }
  };

  // Fonction pour gérer le changement de champ
  const handleFieldSwitch = () => {
    setSwitchField((prev) => !prev);
    // Réinitialiser les erreurs et les valeurs
    form.clearErrors();
    form.setValue('phone', '');
    form.setValue('email', '');
    setFocusedField('');
  };

  return (
    <AuthLayout
      url='/login'
      text='Vous avez déjà un compte ?'
      textLink='Se connecter'
    >
      <NextManageIcon />
      <div className='px-2'>
        <Button
          onClick={handlePreviousPage}
          className='cursor-pointer'
          variant={'link'}
          size={'sm'}
        >
          <ChevronLeft /> Retour
        </Button>
      </div>
      <div className='flex flex-col items-center  gap-4 w-full h-screen justify-between mx-auto max-w-[450px] py-5 px-8 shadow-lg rounded-md'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <div className='max-w-xl z-10'>
              <h1 className='text-xl mt-8 font-semibold text-[#344EA2] text-center'>
                Mot de passe oublié ?
              </h1>
              <p className='text-sm my-4 max-w-lg text-center'>
                Entrez votre{' '}
                {switchField ? 'numéro de téléphone' : 'adresse email'} pour
                recevoir un code de vérification.
              </p>
            </div>

            {switchField ? (
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          {...field}
                          type='tel'
                          placeholder=''
                          aria-label='Numéro de téléphone'
                          className='pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField('')}
                        />
                      </FormControl>
                      <FormLabel
                        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                          shouldAnimateLabel(
                            'phone',
                            watchFieldPhone ? watchFieldPhone : ''
                          )
                            ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                            : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                        }`}
                      >
                        Numéro de téléphone
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          {...field}
                          type='email'
                          placeholder=''
                          aria-label='Adresse email'
                          className='pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                        />
                      </FormControl>
                      <FormLabel
                        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                          shouldAnimateLabel(
                            'email',
                            watchFieldEmail ? watchFieldEmail : ''
                          )
                            ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                            : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                        }`}
                      >
                        Adresse email
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              variant={'link'}
              type='button'
              size={'sm'}
              className='cursor-pointer mx-auto'
              onClick={handleFieldSwitch}
            >
              {switchField ? 'Utiliser un email' : 'Utiliser un numéro'}
            </Button>

            <button
              type='submit'
              disabled={forgotPasswordMutation.isPending}
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              {forgotPasswordMutation.isPending ? 'Chargement...' : 'Continuer'}
            </button>

            <div className='text-sm text-gray-600 mx-auto p-4 rounded-md bg-[#8FA3FF]/20 text-center mt-2'>
              <p className='text-xs mb-2'>
                Veuillez entrer un numéro de téléphone ou une adresse email
                valide. Cela nous permettra de vous envoyer un code de
                vérification afin de réinitialiser votre mot de passe en toute
                sécurité.
              </p>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
