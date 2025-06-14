'use client';
import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
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
import { Input } from '../ui/input';

import { useState, useMemo } from 'react';

import { EyeIcon, EyeOffIcon, Frown, Meh, Smile } from 'lucide-react';

import Link from 'next/link';
import {
  NewPasswordSchema,
  newPassWordSchema,
} from '../../schemas/auth.schemas/new-password.shema';

const ResetPasswordForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

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

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPassWordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Surveiller les changements du mot de passe
  const watchedPassword = form.watch('password');
  const watchedConfirmePassWord = form.watch('confirmPassword');

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

  const onSubmit = (data: NewPasswordSchema) => console.log(data);

  return (
    <AuthLayout>
      <NextManageIcon />
      <div className='flex flex-col items-center  max-w-[500px] mt-8 mx-auto gap-4 w-full lg:justify-center'>
        <div className='relative z-10'>
          <h1 className='text-3xl font-semibold  text-[#344EA2] text-center mb-6'>
            Réinitialisation de votre <br /> mot de passe
          </h1>
        </div>
        <Form {...form}>
          <form
            className='space-y-2 relative z-20 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='password'
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
                          className='pr-10'
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
                          className={`h-full  ${getStrengthColor(
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
                <FormItem className='group relative'>
                  <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                    <span className='bg-background inline-flex px-2'>
                      Confirmer le mot de passe
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        {...field}
                        placeholder='*******'
                        type={isPasswordVisible ? 'text' : 'password'}
                        aria-label=''
                        className=''
                      />
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
                </FormItem>
              )}
            />

            <button
              disabled={!watchedPassword || !watchedConfirmePassWord}
              type='submit'
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              Réinitialiser mon mot de passe
            </button>
          </form>
        </Form>
      </div>
      <div className='px-6 flex justify-between mt-6 flex-wrap  z-20 relative'>
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

export default ResetPasswordForm;
