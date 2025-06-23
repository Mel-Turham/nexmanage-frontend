'use client';

import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
import { loginSchema, LoginSchema } from '@/schemas/auth.schemas/login.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Google } from '@/icons/google';
import Link from 'next/link';
import { Input } from '../ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useApiMutation } from '@/hooks/apis/use-api';
import { useAuthStore } from '@/stores/auth-store';
// import { useRefreshToken } from '@/hooks/use-refresh-token';

import { useRouter } from 'next/navigation';
import { LoginResponse } from '@/types';

const LoginForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const { login } = useAuthStore();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      telephone: '',
      motDePasse: '',
    },
  });

  const loginMutation = useApiMutation<LoginResponse, LoginSchema>(
    'POST',
    '/auth/login',
    {
      onSuccess: (data) => {
        login(data);
        toast.success('Connexion réussie');
        console.log('Données de connexion:', data);
        router.push('/admin');
      },
      onError: (error) => {
        toast.error(error.message || 'Erreur lors de la connexion');
        console.error('Erreur de connexion:', error);
      },
    }
  );

  const toggleVisibility = () => {
    setIsVisible((preveState) => !preveState);
  };

  // Surveiller les changements des champs
  const watchedTelephone = form.watch('telephone');
  const watchedMotDePasse = form.watch('motDePasse');

  // Fonction utilitaire pour déterminer si le label doit être animé vers le haut
  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.log('Erreur de connexion:', error);
    }
  };

  return (
    <AuthLayout
      url='/auth/register'
      text='Pas de compte?'
      textLink='Creer votre compte'
      className='lg:justify-between '
    >
      <NextManageIcon />
      <div className='flex flex-col items-center  gap-4 w-full lg:justify-center md:max-w-3xl mt-20 lg:mt-0'>
        <div className='relative z-10'>
          <h1 className='text-2xl font-semibold text-[#344EA2] text-center lg:text-left'>
            Connectez-vous à votre compte
          </h1>
          <p className='text-base tracking-tighter font-medium text-center mt-2 text-muted-foreground'>
            <span className='text-muted-foreground'>
              Votre email est-il enregistré ?
            </span>
            <span className='ml-2'>Connectez-vous avec</span>
          </p>
        </div>
        <Form {...form}>
          <form
            className='space-y-4 relative z-20 w-full lg:w-[400px] mt-2'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='telephone'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        type='tel'
                        autoComplete='off'
                        {...field}
                        placeholder=''
                        aria-label='Numéro de téléphone'
                        className='pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                        disabled={loginMutation.isPending}
                        onFocus={() => setFocusedField('telephone')}
                        onBlur={() => setFocusedField('')}
                      />
                    </FormControl>
                    <FormLabel
                      className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                        shouldAnimateLabel('telephone', watchedTelephone)
                          ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                      }`}
                    >
                      Numéro de téléphone
                    </FormLabel>
                  </div>
                  <FormMessage className='sr-only' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='motDePasse'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          {...field}
                          placeholder=''
                          type={isVisible ? 'text' : 'password'}
                          aria-label='Votre mot de passe'
                          className='pt-6 pb-2 px-3 pr-10 border focus:border-[#344EA2] transition-all duration-200'
                          disabled={loginMutation.isPending}
                          onFocus={() => setFocusedField('motDePasse')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                            shouldAnimateLabel('motDePasse', watchedMotDePasse)
                              ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                              : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                          }`}
                        >
                          Votre mot de passe
                        </FormLabel>
                        <button
                          className='text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
                          type='button'
                          onClick={toggleVisibility}
                          aria-label={
                            isVisible ? 'Hide password' : 'Show password'
                          }
                          aria-pressed={isVisible}
                          aria-controls='password'
                          disabled={loginMutation.isPending}
                        >
                          {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden='true' />
                          ) : (
                            <EyeIcon size={16} aria-hidden='true' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <Link
                      href={'/auth/forgot-password'}
                      className='text-xs underline text-end mt-2 block text-[#344EA2] hover:text-[#344EA2]/80 transition-colors'
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              disabled={
                !watchedTelephone ||
                !watchedMotDePasse ||
                loginMutation.isPending
              }
              type='submit'
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              {loginMutation.isPending
                ? 'Connexion en cours...'
                : 'Se connecter'}
            </button>

            <div className='relative z-20'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' aria-hidden='true' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  ou se connecter avec
                </span>
              </div>
            </div>

            <Button
              type='button'
              variant='outline'
              className='w-full'
              disabled={loginMutation.isPending}
            >
              <Google className='mr-2 size-5' />
              Se connecter avec Google
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
