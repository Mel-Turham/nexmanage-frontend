'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, Frown, Meh, Smile, Loader2 } from 'lucide-react';

import {
  NewPasswordSchema,
  newPassWordSchema,
} from '@/schemas/auth.schemas/new-password.shema';
import { useApiMutation } from '@/hooks/apis/use-api';
import AuthLayout from '@/layouts/auth-layout';
import NextManageIcon from '@/icons/logo';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type ResetPasswordPayload = Pick<NewPasswordSchema, 'password'> & {
  resetToken: string;
};

const ResetPasswordForm = () => {
  const router = useRouter();

  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPassWordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { password, confirmPassword } = form.watch();

  useEffect(() => {
    const token = localStorage.getItem('reset-token');
    if (token) setResetToken(token);
  }, []);

  const { mutateAsync, isPending } = useApiMutation<
    unknown,
    ResetPasswordPayload
  >('POST', '/auth/reset-password', {
    onSuccess: () => {
      localStorage.removeItem('reset-token');
      toast.success('Mot de passe modifié avec succès');
      router.push('/auth/login');
    },
    onError: () => {
      toast.error('Erreur lors de la modification du mot de passe');
    },
  });

  const onSubmit = async (data: NewPasswordSchema) => {
    if (!resetToken) {
      toast.error('Token introuvable. Veuillez recommencer la procédure.');
      return;
    }

    await mutateAsync({ password: data.password, resetToken });
    toast.success('Mot de pass renitialiser avec success', {
      duration: 4000,
    });
  };

  const passwordStrength = useMemo(() => {
    const rules = [/.{8,}/, /[0-9]/, /[a-z]/, /[A-Z]/];
    return rules.reduce(
      (acc, regex) => acc + (regex.test(password || '') ? 1 : 0),
      0
    );
  }, [password]);

  const strengthText = () => {
    if (!password) return null;
    if (passwordStrength <= 2) {
      return (
        <span className='flex items-center gap-1 text-red-500'>
          <Frown size={16} /> Mot de passe faible
        </span>
      );
    }
    if (passwordStrength === 3) {
      return (
        <span className='flex items-center gap-1 text-amber-500'>
          <Meh size={16} /> Mot de passe moyen
        </span>
      );
    }
    return (
      <span className='flex items-center gap-1 text-emerald-500'>
        <Smile size={16} /> Mot de passe fort
      </span>
    );
  };

  const strengthColor = () => {
    return [
      'bg-border',
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-emerald-500',
    ][passwordStrength];
  };

  return (
    <AuthLayout>
      <div className='flex flex-col justify-center shadow-lg px-8 py-5 rounded-md mt-36 items-center max-w-[450px]  mx-auto gap-4 w-full'>
        <NextManageIcon />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 w-full relative z-10'
          >
            <h1 className='text-xl font-semibold text-[#344EA2] text-center mb-6'>
              Réinitialisation <br /> de votre mot de passe!
            </h1>
            {/* Champ mot de passe */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre mot de passe</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 end-0 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground'
                      >
                        {showPassword ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {password && (
                    <>
                      <div className='mt-2'>
                        <div
                          className='h-1 w-full bg-border rounded-full overflow-hidden'
                          role='progressbar'
                          aria-valuenow={passwordStrength}
                          aria-valuemin={0}
                          aria-valuemax={4}
                        >
                          <div
                            className={`h-full ${strengthColor()} transition-all`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <p className='text-xs mt-2 font-medium'>
                          {strengthText()}
                        </p>
                      </div>
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ confirmation */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showConfirm ? 'text' : 'password'}
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirm(!showConfirm)}
                        className='absolute inset-y-0 end-0 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground'
                      >
                        {showConfirm ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton */}
            <button
              type='submit'
              disabled={!password || !confirmPassword || isPending}
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed'
            >
              {isPending ? (
                <span className='flex items-center justify-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Réinitialisation...
                </span>
              ) : (
                'Réinitialiser mon mot de passe'
              )}
            </button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordForm;
