'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreatePasswordSchema } from '@/schemas/auth.schemas/create-password.schema';
import { createPasswordSchema } from '@/schemas/auth.schemas/create-password.schema';
import NextManageIcon from '@/icons/logo';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { EyeIcon, EyeOffIcon, Frown, Meh, Smile } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useInvitationResponseStore } from '@/stores/invitation-response-store';
import { useApiMutation } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { UserStorageData } from '@/types';

export function CreatePasswordForm() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [focusedField, setFocusedField] = useState<string>('');
  const { user, clearUser } = useInvitationResponseStore();
  const { setAccessToken } = useAuthStore();

  const item = localStorage.getItem('userInvitation');
  const userInvited: UserStorageData | null = item ? JSON.parse(item) : null;

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

  const strength = useMemo(() => checkStrength(watchedPassword || ''), [watchedPassword]);

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
        <span className="flex items-center gap-1 text-red-500">
          <Frown size={20} aria-hidden="true" />
          Mot de passe faible
        </span>
      );
    if (score === 3)
      return (
        <span className="flex items-center gap-1 text-amber-500">
          <Meh size={20} aria-hidden="true" />
          Mot de passe moyen
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-emerald-500">
        <Smile size={20} aria-hidden="true" />
        Mot de passe fort
      </span>
    );
  };
  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };

  type dataCreatePassword = {
    password: string;
    nom: string;
    email?: string;
    phone?: string;
  };

  const { mutateAsync: createPassword, isPending } = useApiMutation<
    { message: string; token: string },
    dataCreatePassword
  >('POST', '/auth/register', {
    onSuccess: (data) => {
      setAccessToken(data.token);
    },
    onError: (error) => {
      toast.error(error.message || 'Une erreur inconnue est survenue.');
    },
  });

  const { mutateAsync: UserInvitedRegister, isPending: isPendingInvited } = useApiMutation<
    { message: string; token: string; success: boolean },
    UserStorageData & { password: string }
  >('POST', '/org/register-company', {
    onSuccess: (data) => {
      setAccessToken(data.token);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(data: CreatePasswordSchema) {
    try {
      if (userInvited) {
        const { isUser, ...rest } = userInvited;
        const result = await UserInvitedRegister({
          ...rest,
          password: data.password,
        });

        toast.success(result.message, { duration: 3000 });
        localStorage.removeItem('userInvitation');
        router.push('/dashboard');
        return;
      }
      if (!user) {
        toast.warning("Votre compte n'a pas encore été vérifié");
        return;
      }

      const response = await createPassword({
        nom: user.result.nom,
        email: user.result.email,
        phone: user.result.phone,
        password: data.password,
      });

      toast.success(response.message, { duration: 3000 });
      clearUser();
      router.push('/create-entreprise');
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du mot de passe');
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <NextManageIcon />
      <div className="flex min-h-[50svh] w-full flex-col items-center justify-center gap-4">
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold text-[#344EA2]">Créer un mots de passe</h1>
          <p className="text-muted-foreground mt-2 text-center text-base font-medium tracking-tighter">
            Créer facilement votre mots de passe
          </p>
        </div>
        <Form {...form}>
          <form className="max-w-md space-y-4 lg:w-[500px]" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
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
                          className={`px-3 pt-6 pr-10 pb-2 transition-all duration-200 ${
                            form.formState.errors.password
                              ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border focus:border-[#344EA2]'
                          }`}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`bg-background pointer-events-none absolute left-3 px-1 transition-all duration-200 ${
                            shouldAnimateLabel('password', watchedPassword)
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
                        >
                          {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                          ) : (
                            <EyeIcon size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </div>

                  {/* Indicateur de force du mot de passe */}
                  {watchedPassword && (
                    <div className="mt-2">
                      <div
                        className="bg-border h-1 w-full overflow-hidden rounded-full"
                        role="progressbar"
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label="Password strength"
                      >
                        <div
                          className={`h-full ${getStrengthColor(
                            strengthScore,
                          )} transition-all duration-500 ease-out`}
                          style={{ width: `${(strengthScore / 4) * 100}%` }}
                        />
                      </div>
                      {/* Description de la force du mot de passe */}
                      <p className="text-foreground mt-2 text-xs font-medium">
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder=""
                          type={isPasswordVisible ? 'text' : 'password'}
                          aria-label="Confirmer le mot de passe"
                          className={`${
                            form.formState.errors.confirmPassword
                              ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border px-3 pt-6 pr-10 pb-2 transition-all duration-200 focus:border-[#344EA2]'
                          } `}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField('')}
                        />
                        <FormLabel
                          className={`bg-background pointer-events-none absolute left-3 px-1 transition-all duration-200 ${
                            shouldAnimateLabel('confirmPassword', watchedConfirmPassword)
                              ? 'top-0 -translate-y-1/2 text-xs text-[#344EA2]'
                              : 'text-muted-foreground top-1/2 -translate-y-1/2'
                          }`}
                        >
                          Confirmer le mot de passe
                        </FormLabel>
                        <button
                          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 cursor-pointer items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={togglePasswordVisibility}
                          aria-label={
                            isPasswordVisible ? 'Hide confirmPassword' : 'Show confirmPassword'
                          }
                          aria-pressed={isPasswordVisible}
                          aria-controls="confirmPassword"
                        >
                          {isPasswordVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                          ) : (
                            <EyeIcon size={16} aria-hidden="true" />
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
                !watchedConfirmPassword || !watchedPassword || isPending || isPendingInvited
              }
              type="submit"
              className="custom-button-gradient w-full py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30"
            >
              {isPending || isPendingInvited ? 'Creation en cours...' : 'Création de mots de passe'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
