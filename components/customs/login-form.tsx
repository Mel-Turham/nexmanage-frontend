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
import { memo, useState } from 'react';
import { useApiMutation } from '@/hooks/apis/use-api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

const LoginForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const actifOrg = useAuthStore((state) => state.organisationActive);
  const organisations = useAuthStore((state) => state.organisations);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      telephone: '',
      password: '',
      email: '',
    },
  });

  const loginMutation = useApiMutation<
    { message: string; token: string },
    LoginSchema
  >('POST', '/auth/login', {
    onSuccess: (data) => {
      toast.success('Connexion réussie');
      console.log('Données de connexion:', data);
      setAccessToken(data.token);
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la connexion');
      console.error('Erreur de connexion:', error);
    },

    retry: false,
    retryDelay: 1000,
  });

  const toggleVisibility = () => {
    setIsVisible((preveState) => !preveState);
  };

  // Surveiller les changements des champs
  const watchedTelephone = form.watch('telephone');
  const watchedpassword = form.watch('password');
  const watchedEmail = form.watch('email');
  console.log('watchedEmail', watchedEmail);
  console.log('watchedPassword', watchedpassword);
  // Fonction utilitaire pour déterminer si le label doit être animé vers le haut
  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };

  const onSubmit = async (data: LoginSchema) => {
    try {
      console.log('Données soumises:', data);

      const payload = isSwitchOn
        ? { telephone: data.telephone, password: data.password }
        : { email: data.email, password: data.password };

      await loginMutation.mutateAsync(payload);

      if (!actifOrg && organisations.length > 0) {
        router.push('/organisations');
        return;
      }

      if (actifOrg) {
        router.push('/admin');
        return;
      }
      if (!actifOrg && organisations.length === 0) {
        router.push('/organisations');
        return;
      }
    } catch (error) {
      console.log('Erreur de connexion:', error);
    }
  };

  return (
    <>
      <div className='flex flex-col items-center  gap-4 w-full lg:justify-center md:max-w-3xl mt-20 lg:mt-0 relative '>
        <NextManageIcon />
        <Form {...form}>
          <form
            className='space-y-1  relative z-20 w-full max-w-[450px] py-5 px-8 shadow-lg rounded-2xl bg-white'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='relative flex flex-col items-center z-10 mb-4'>
              <h1 className='text-2xl font-semibold text-[#344EA2] text-center lg:text-left'>
                Accédez à votre espace sécurisé
              </h1>
              <p className='text-center text-base text-gray-600 '>
                Connectez-vous pour accéder à votre espace avec votre{' '}
                {isSwitchOn ? ' numéro de téléphone' : 'adresse e-mail'}.
              </p>
            </div>

            {isSwitchOn ? (
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
                          className='pt-6 pb-2 px-3 border disabled:hover:cursor-not-allowed focus:border-[#344EA2] transition-all duration-200'
                          disabled={
                            loginMutation.isPending || watchedEmail
                              ? true
                              : false
                          }
                          onFocus={() => setFocusedField('telephone')}
                          onBlur={() => setFocusedField('')}
                        />
                      </FormControl>
                      <FormLabel
                        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                          shouldAnimateLabel(
                            'telephone',
                            watchedTelephone ? watchedTelephone : ''
                          )
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
            ) : (
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type='email'
                          autoComplete='off'
                          {...field}
                          placeholder=''
                          aria-label='Email'
                          className='pt-6 pb-2 px-3 border disabled:hover:cursor-not-allowed focus:border-[#344EA2] transition-all duration-200'
                          disabled={
                            loginMutation.isPending || watchedTelephone
                              ? true
                              : false
                          }
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                        />
                      </FormControl>
                      <FormLabel
                        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                          shouldAnimateLabel(
                            'email',
                            watchedEmail ? watchedEmail : ''
                          )
                            ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                            : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                        }`}
                      >
                        Email
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              type='button'
              variant={'link'}
              size={'sm'}
              className='text-gray-500 cursor-pointer'
              onClick={() => setIsSwitchOn((prev) => !prev)}
            >
              {isSwitchOn ? 'Adresse e-mail' : 'Numéro de téléphone'}
            </Button>
            <FormField
              control={form.control}
              name='password'
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
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                            shouldAnimateLabel('password', watchedpassword)
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
                      href={'/forgot-password'}
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
                (!form.watch('email') && !form.watch('telephone')) ||
                !form.watch('password') ||
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
    </>
  );
};

export default memo(LoginForm);
