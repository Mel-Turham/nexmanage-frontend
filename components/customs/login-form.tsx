'use client';

import NextManageIcon from '@/icons/logo';

import { loginSchema, LoginSchema } from '@/schemas/auth.schemas/login.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Google } from '@/icons/google';
import Link from 'next/link';
import { Input } from '../ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
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
  const setActifOrg = useAuthStore((state) => state.setOrganisationActive);
  const setIsLoggedOut = useAuthStore((state) => state.setIsLoggedOut);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      telephone: '',
      password: '',
      email: '',
    },
  });

  const loginMutation = useApiMutation<{ message: string; token: string }, LoginSchema>(
    'POST',
    '/auth/login',
    {
      onSuccess: (data) => {
        toast.success('Connexion réussie');
        console.log('Données de connexion:', data);
        setAccessToken(data.token);
        setIsLoggedOut(false);
      },
      onError: (error) => {
        toast.error(error.message || 'Erreur lors de la connexion');
        console.error('Erreur de connexion:', error);
      },

      retry: false,
      retryDelay: 1000,
    },
  );

  const toggleVisibility = () => {
    setIsVisible((preveState) => !preveState);
  };

  // Surveiller les changements des champs
  const watchedTelephone = form.watch('telephone');
  const watchedpassword = form.watch('password');
  const watchedEmail = form.watch('email');
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
      if (!actifOrg && organisations.length === 1) {
        setActifOrg(organisations[0]);
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
      <div className="relative mt-20 flex w-full flex-col items-center gap-4 md:max-w-3xl lg:mt-0 lg:justify-center">
        <NextManageIcon />
        <Form {...form}>
          <form
            className="relative z-20 w-full max-w-[450px] space-y-1 rounded-2xl bg-white px-8 py-5 shadow-lg"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="relative z-10 mb-4 flex flex-col items-center">
              <h1 className="text-center text-2xl font-semibold text-[#344EA2] lg:text-left">
                Accédez à votre espace sécurisé
              </h1>
              <p className="text-center text-base text-gray-600">
                Connectez-vous pour accéder à votre espace avec votre{' '}
                {isSwitchOn ? ' numéro de téléphone' : 'adresse e-mail'}.
              </p>
            </div>

            {isSwitchOn ? (
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="tel"
                          autoComplete="off"
                          {...field}
                          placeholder=""
                          aria-label="Numéro de téléphone"
                          className="border px-3 pt-6 pb-2 transition-all duration-200 focus:border-[#344EA2] disabled:hover:cursor-not-allowed"
                          disabled={loginMutation.isPending || watchedEmail ? true : false}
                          onFocus={() => setFocusedField('telephone')}
                          onBlur={() => setFocusedField('')}
                        />
                      </FormControl>
                      <FormLabel
                        className={`bg-background pointer-events-none absolute left-3 px-1 transition-all duration-200 ${
                          shouldAnimateLabel('telephone', watchedTelephone ? watchedTelephone : '')
                            ? 'top-0 -translate-y-1/2 text-xs text-[#344EA2]'
                            : 'text-muted-foreground top-1/2 -translate-y-1/2'
                        }`}
                      >
                        Numéro de téléphone
                      </FormLabel>
                    </div>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="off"
                          {...field}
                          placeholder=""
                          aria-label="Email"
                          className="border px-3 pt-6 pb-2 transition-all duration-200 focus:border-[#344EA2] disabled:hover:cursor-not-allowed"
                          disabled={loginMutation.isPending || watchedTelephone ? true : false}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                        />
                      </FormControl>
                      <FormLabel
                        className={`bg-background pointer-events-none absolute left-3 px-1 transition-all duration-200 ${
                          shouldAnimateLabel('email', watchedEmail ? watchedEmail : '')
                            ? 'top-0 -translate-y-1/2 text-xs text-[#344EA2]'
                            : 'text-muted-foreground top-1/2 -translate-y-1/2'
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
              type="button"
              variant={'link'}
              size={'sm'}
              className="cursor-pointer text-gray-500"
              onClick={() => setIsSwitchOn((prev) => !prev)}
            >
              {isSwitchOn ? 'Adresse e-mail' : 'Numéro de téléphone'}
            </Button>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder=""
                          type={isVisible ? 'text' : 'password'}
                          aria-label="Votre mot de passe"
                          className="border px-3 pt-6 pr-10 pb-2 transition-all duration-200 focus:border-[#344EA2]"
                          disabled={loginMutation.isPending}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`bg-background pointer-events-none absolute left-3 px-1 transition-all duration-200 ${
                            shouldAnimateLabel('password', watchedpassword)
                              ? 'top-0 -translate-y-1/2 text-xs text-[#344EA2]'
                              : 'text-muted-foreground top-1/2 -translate-y-1/2'
                          }`}
                        >
                          Votre mot de passe
                        </FormLabel>
                        <button
                          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 cursor-pointer items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={toggleVisibility}
                          aria-label={isVisible ? 'Hide password' : 'Show password'}
                          aria-pressed={isVisible}
                          aria-controls="password"
                          disabled={loginMutation.isPending}
                        >
                          {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                          ) : (
                            <EyeIcon size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <Link
                      href={'/forgot-password'}
                      className="mt-2 block text-end text-xs text-[#344EA2] underline transition-colors hover:text-[#344EA2]/80"
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
              type="submit"
              className="custom-button-gradient w-full py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30"
            >
              {loginMutation.isPending ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            <div className="relative z-20">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" aria-hidden="true" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  ou se connecter avec
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              <Google className="mr-2 size-5" />
              Se connecter avec Google
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default memo(LoginForm);
