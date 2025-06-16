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
    <AuthLayout>
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
                <div className='group relative'>
                  <FormItem className=''>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background inline-flex px-2'>
                        {'Numéro de téléphone'}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-slot='phone-input'
                        aria-label=''
                        className=''
                        disabled={forgotPasswordMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
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
      <div className='px-2 lg:px-6 w-full flex justify-between  flex-wrap  z-20 relative'>
        <p className='text-muted-foreground text-xs mt-2 font-medium'>
          Vous avez déjà un compte ?{' '}
          <Link href='/auth/login' className='text-[#142938] underline'>
            Se connecter
          </Link>
        </p>
        <p className='text-muted-foreground text-xs mt-2 font-medium'>
          <Link href={'/terms'} className='underline'>
            Conditions générales
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
