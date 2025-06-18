'use client';
import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as RPNInput from 'react-phone-number-input';
import {
  registerSchema,
  RegisterSchema,
} from '@/schemas/auth.schemas/register.schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { FlagComponent } from './flag-component';
import { CountrySelect } from './country-selected';
import { useState, useMemo } from 'react';
import { PhoneInput } from './phone-input';
import { EyeIcon, EyeOffIcon, Frown, Meh, Smile } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Google } from '@/icons/google';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useApiMutation, useApiQuery } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { error } from 'console';

const RegisterForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'Au moins 8 caractères' },
      { regex: /[0-9]/, text: 'Au moins 1 chiffre' },
      { regex: /[a-z]/, text: 'Au moins 1 minuscule' },
      { regex: /[A-Z]/, text: 'Au moins 1 majuscule' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nom: '',
      telephone: '',
      motDePasse: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Mutation pour l'inscription
  // ne pas envoyer les champs confirmPassword et terms
  // et gérer les erreurs de manière appropriée
  type RegisterDataMutation = Pick<
    RegisterSchema,
    'nom' | 'telephone' | 'motDePasse'
  >;
  const registerMutation = useApiMutation<any, RegisterDataMutation>(
    'POST',
    '/auth/register',
    {
      onSuccess: (data) => {
        toast.success('Inscription réussie');
        console.log("Données d'inscription:", data);
        // Rediriger l'utilisateur vers la page de connexion ou une autre page
        router.push('/auth/otp');
      },
      onError: (error) => {
        toast.error(error.message || "Erreur lors de l'inscription");
        console.error("Erreur d'inscription:", error);
      },
    }
  );

  const googleSignUpQuery = useApiMutation<any, void>(
    'GET',
    'auth/google/login',
    {
      onSuccess: (data) => {
        console.log('Connexion Google réussie:', data);
      },
      onError: (error) => {
        console.error('Erreur de connexion Google:', error.message);
      },
    }
  );

  // Surveiller les changements du mot de passe
  const watchedPassword = form.watch('motDePasse');
  const watchedTerms = form.watch('terms');
  const watchedUsername = form.watch('nom');
  const watchedConfirmPassword = form.watch('confirmPassword');

  const strength = useMemo(
    () => checkStrength(watchedPassword || ''),
    [watchedPassword]
  );

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return;
    if (score <= 2)
      return (
        <span className='flex items-center gap-1 text-red-500'>
          <Frown size={20} aria-hidden='true' />
          Mot de passe faible
        </span>
      );
    if (score === 3)
      return (
        <span className='flex items-center gap-1 text-amber-500'>
          <Meh size={20} aria-hidden='true' />
          Mot de passe moyen
        </span>
      );
    return (
      <span className='flex items-center gap-1 text-emerald-500'>
        <Smile size={20} aria-hidden='true' />
        Mot de passe fort
      </span>
    );
  };

  const onSubmit = async (data: RegisterSchema) => {
    try {
      // retirer les champs confirmPassword et terms avant l'envoi
      const { confirmPassword, terms, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  const handlerSignUpWithGoogle = async () => {
    try {
      await googleSignUpQuery.mutateAsync();
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      toast.error('Erreur lors de la connexion avec Google');
    }
  };

  // Fonction utilitaire pour déterminer si le label doit être animé vers le haut
  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };

  return (
    <AuthLayout
      text='Vous avez déjà un compte ?'
      textLink='Connectez-vous'
      url='/auth/login'
      className='justify-between'
    >
      <NextManageIcon />
      <div className='flex flex-col items-center gap-4 w-full lg:justify-center'>
        <div className='relative z-10'>
          <h1 className='text-3xl font-semibold  text-[#344EA2]'>
            Créer un compte
          </h1>
          <p className='text-base tracking-tighter font-medium text-center mt-2 text-muted-foreground'>
            Créez facilement votre compte
          </p>
        </div>
        <Form {...form}>
          <form
            className='space-y-2 relative z-20 max-w-[400px]'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='nom'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=''
                        type='text'
                        aria-label="Nom d'utilisateur"
                        className='pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField('')}
                      />
                    </FormControl>
                    <FormLabel
                      className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                        shouldAnimateLabel('username', watchedUsername)
                          ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                          : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                      }`}
                    >
                      Nom d&apos;utilisateur
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='telephone'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className='w-full'>
                      <RPNInput.default
                        className='flex w-full'
                        international
                        flagComponent={FlagComponent}
                        inputComponent={PhoneInput}
                        countrySelectComponent={CountrySelect}
                        placeholder='Entrez votre numéro'
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value || '');
                        }}
                      />
                      {fieldState.error && (
                        <p className='text-destructive text-xs mt-1'>
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  </FormControl>
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
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                            shouldAnimateLabel('password', watchedPassword)
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

                  {/* Indicateur de force du mot de passe */}
                  {watchedPassword && (
                    <div className='mt-2'>
                      <div
                        className='bg-border h-1 w-full  overflow-hidden rounded-full'
                        role='progressbar'
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label='Password strength'
                      >
                        <div
                          className={`h-full ${getStrengthColor(
                            strengthScore
                          )} transition-all duration-500 ease-out`}
                          style={{ width: `${(strengthScore / 4) * 100}%` }}
                        />
                      </div>
                      {/* Description de la force du mot de passe */}
                      <p className='text-foreground text-xs mt-2 font-medium'>
                        {getStrengthText(strengthScore)}
                      </p>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          {...field}
                          placeholder=''
                          type={isPasswordVisible ? 'text' : 'password'}
                          aria-label='Confirmer le mot de passe'
                          className='pt-6 pb-2 px-3 pr-10 border focus:border-[#344EA2] transition-all duration-200'
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                            shouldAnimateLabel(
                              'confirmPassword',
                              watchedConfirmPassword
                            )
                              ? 'top-0 text-xs text-[#344EA2] -translate-y-1/2'
                              : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                          }`}
                        >
                          Confirmer le mot de passe
                        </FormLabel>
                        <button
                          className='text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
                          type='button'
                          onClick={togglePasswordVisibility}
                          aria-label={
                            isPasswordVisible
                              ? 'Hide confirmPassword'
                              : 'Show confirmPassword'
                          }
                          aria-pressed={isPasswordVisible}
                          aria-controls='confirmPassword'
                        >
                          {isPasswordVisible ? (
                            <EyeOffIcon size={16} aria-hidden='true' />
                          ) : (
                            <EyeIcon size={16} aria-hidden='true' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='terms'
              render={({ field }) => (
                <FormItem className='flex flex-col items-start gap-3.5'>
                  <FormLabel className='sr-only'>Terms</FormLabel>
                  <FormControl>
                    <div className='flex gap-1.5'>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className='mt-0.5 cursor-pointer'
                      />
                      <small className='text-muted-foreground text-xs'>
                        J&apos;ai lu et j&apos;accepte les{' '}
                        <Link href={'/terms'}>
                          <strong className='text-[#142938] cursor-pointer'>
                            Termes et conditions
                          </strong>
                        </Link>{' '}
                        ainsi que{' '}
                        <Link href={'/police'}>
                          <strong className='text-[#142938] cursor-pointer'>
                            la Politique de confidentialité
                          </strong>{' '}
                        </Link>
                      </small>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              disabled={!watchedTerms || isSubmitting}
              type='submit'
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
            </button>
            <div className='relative z-20'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' aria-hidden='true' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  ou s&apos;inscrire avec
                </span>
              </div>
            </div>
            <Button
              onClick={handlerSignUpWithGoogle}
              type='button'
              variant='outline'
              className='w-full'
            >
              <Google className='mr-2 size-5' />
              S&apos;inscrire avec Google
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
