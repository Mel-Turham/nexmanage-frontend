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

// Types pour la réponse de connexion
interface LoginResponse {
  token: string;
  success: boolean;
  user: {
    id: string;
    telephone: string;
    // Ajoutez d'autres propriétés selon votre API
  };
}

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

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
        toast.success('Connexion réussie');
        // Ici vous pouvez gérer la réponse, par exemple :
        // - Stocker le token
        // - Rediriger l'utilisateur
        // - Mettre à jour le contexte d'authentification
        console.log('Données de connexion:', data);
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

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.log('Erreur de connexion:', error);
    }
  };

  return (
    <AuthLayout>
      <NextManageIcon />
      <div className='flex flex-col items-center gap-4 w-full lg:justify-center'>
        <div className='relative z-10'>
          <h1 className='text-2xl font-semibold  text-[#344EA2]'>
            Connectez-vous à votre compte
          </h1>
          <p className='text-base tracking-tighter font-medium text-center mt-2 text-muted-foreground'>
            <span className='text-muted-foreground'>
              {' '}
              Votre email est-il enregistré ?
            </span>
            <span className='ml-2'>Connectez-vous avec</span>
          </p>
        </div>
        <Form {...form}>
          <form
            className='space-y-4 relative z-20 w-[400px] mt-2'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='telephone'
              render={({ field }) => (
                <FormItem className=''>
                  <div className='group relative'>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background inline-flex px-2'>
                        {'Numéro de téléphone'}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-slot='phone-input'
                        placeholder='Numéro de téléphone'
                        aria-label=''
                        className=''
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='motDePasse'
              render={({ field }) => (
                <FormItem>
                  <div className='relative group '>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background inline-flex px-2'>
                        Votre mot de passe
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          {...field}
                          placeholder='*******'
                          type={isVisible ? 'text' : 'password'}
                          aria-label=''
                          disabled={loginMutation.isPending}
                        />

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
                  </div>
                  <Link
                    href={'/auth/forgot-password'}
                    className='text-xs underline text-end mt-2 block'
                  >
                    Mot de passe oublié ?
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              disabled={
                !form.watch('telephone') ||
                !form.watch('motDePasse') ||
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
      <div className='px-6 flex justify-between mt-6 flex-wrap  z-20 relative'>
        <p className='text-muted-foreground text-xs mt-2 font-medium'>
          <Link href={'/terms'} className='underline '>
            Conditions générales
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
