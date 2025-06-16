'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
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

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    telephone: string;
    // Ajoutez d'autres propriétés selon votre API
  };
}
const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      telephone: '',
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
      toast.success('OTP ENVOYÉ AVEC SUCCÈS');
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la connexion');
      console.error('Erreur de connexion:', error);
    },
  });

  const watchFieldPhone = form.watch('telephone');

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      router.push('/auth/login');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <AuthLayout
      url='/auth/login'
      text='Vous avez deja un compte ?'
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
      <div className='flex flex-col items-center gap-4 w-full h-screen justify-between  mx-auto max-w-[500px]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <div className=' max-w-xl z-10'>
              <h1 className='text-xl mt-8 font-semibold text-[#344EA2] text-center'>
                Mot de passe oublié ?
              </h1>
              <p className='text-sm my-4 max-w-lg text-center '>
                Entrez votre numero de téléphone pour recevoir un code de
                vérification.
              </p>
            </div>
            <FormField
              control={form.control}
              name='telephone'
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        placeholder=' '
                        data-slot='phone-input'
                        className='peer pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                        disabled={forgotPasswordMutation.isPending}
                      />
                      <FormLabel
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground bg-background px-1 text-sm transition-all duration-200 pointer-events-none 
                       peer-placeholder-shown:top-1/2 
                       peer-placeholder-shown:text-base 
                       peer-placeholder-shown:text-muted-foreground 
                       peer-focus:top-0 
                       peer-focus:text-xs 
                       peer-focus:text-[#344EA2] 
                       peer-focus:-translate-y-1/2'
                      >
                        Numéro de téléphone
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              disabled={forgotPasswordMutation.isPending || !watchFieldPhone}
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              Continuer
            </button>
            <div className='text-sm text-gray-600  mx-auto p-4 rounded-md bg-[#8FA3FF]/20 text-center mt-2'>
              <p className='text-xs mb-2'>
                Veuillez entrer un nouveau mot de passe pour sécuriser votre
                compte. Assurez-vous qu&apos;il soit suffisamment complexe (au
                moins 8 caractères, avec majuscules, chiffres, et symboles).
              </p>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
