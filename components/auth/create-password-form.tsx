'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreatePasswordSchema } from '@/schemas/auth.schemas/create-password.schema';
import { createPasswordSchema } from '@/schemas/auth.schemas/create-password.schema';
import NextManageIcon from '@/icons/logo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { EyeIcon, EyeOffIcon, Frown, Meh, Smile } from 'lucide-react';
import { use, useMemo, useState } from 'react';
import { useInvitationResponseStore } from '@/stores/invitation-response-store';
import { useApiMutation } from '@/hooks/apis/use-api';
import { InvitationResponse } from '../../types/index';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function CreatePasswordForm() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [focusedField, setFocusedField] = useState<string>('');
  const { user } = useInvitationResponseStore();

  const router = useRouter();

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
  const form = useForm<CreatePasswordSchema>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, control, watch } = form;

  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

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
  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };

  type dataCreatePassword = {
    password: string;
  } & InvitationResponse;

  const { mutateAsync, isPending, error } = useApiMutation<
    { message: string },
    dataCreatePassword
  >('POST', '/auth/register', {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function onSubmit(data: CreatePasswordSchema) {
    try {
      if (!user) {
        toast.warning("Votre compte n'a pas encore ete verifier", {
          duration: 3000,
        });
        return;
      }
      const response = await mutateAsync({
        nom: user.result.nom,
        email: user.result.email,
        phone: user.result.phone,
        password: data.password,
      });

      toast.success(response.message, {
        duration: 3000,
        // onAutoClose: () => {
        //   router.push('/auth/login');
        // },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col gap-4 min-h-screen'>
      <NextManageIcon />
      <div className='flex flex-col min-h-[50svh] justify-center items-center gap-4 w-full '>
        <div className='relative z-10'>
          <h1 className='text-3xl font-semibold  text-[#344EA2]'>
            Créer un mots de passe
          </h1>
          <p className='text-base tracking-tighter font-medium text-center mt-2 text-muted-foreground'>
            Créer facilement votre mots de passe
          </p>
        </div>
        <Form {...form}>
          <form
            className='space-y-4 max-w-md lg:w-[500px]'
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
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
                          className={`pt-6 pb-2 px-3 pr-10 transition-all duration-200 ${
                            form.formState.errors.password
                              ? 'border-red-500 focus:border-red-500 ring-red-500 focus:ring-red-500'
                              : 'border focus:border-[#344EA2]'
                          }`}
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
                          className={`${
                            form.formState.errors.confirmPassword
                              ? 'border-red-500 focus:border-red-500 ring-red-500 focus:ring-red-500'
                              : 'pt-6 pb-2 px-3 pr-10 border focus:border-[#344EA2] transition-all duration-200'
                          } `}
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
            <button
              disabled={
                !watchedConfirmPassword || !watchedPassword || isPending
              }
              type='submit'
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              {isPending ? 'Creation en cours...' : 'Création de mots de passe'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
