'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PreRegisterSchema } from '@/schemas/auth.schemas/pre-register.schema';
import { preRegisterSchema } from '@/schemas/auth.schemas/pre-register.schema';
import AuthLayout from '@/layouts/auth-layout';
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
import { useState } from 'react';
import * as RPNInput from 'react-phone-number-input';
import { FlagComponent } from '../customs/flag-component';
import { PhoneInput } from '../customs/phone-input';
import { CountrySelect } from '../customs/country-selected';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Google } from '@/icons/google';
import { useApiMutation } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
function PreRegisterForm() {
  const [focusedField, setFocusedField] = useState<string>('');
  const form = useForm<PreRegisterSchema>({
    resolver: zodResolver(preRegisterSchema),
    defaultValues: {
      nom: '',
      email: '',
      phone: '',
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;
  type preRegisterData = Pick<PreRegisterSchema, 'nom' | 'email' | 'phone'>;
  // mutation pre-register

  const { mutateAsync, isPending, isError } = useApiMutation<
    preRegisterData,
    unknown
  >('POST', '/auth/pre-register', {
    onSuccess: (data) => {
      console.log("Données d'inscription:", data);
    },
    onError: (error) => {
      console.error("Erreur d'inscription:", error);
    },
  });

  const watchedUsername = watch('nom');
  const watchedEmail = watch('email');
  // const watchPhone = watch('phone');
  const watchedTerms = watch('terms');

  const shouldAnimateLabel = (fieldName: string, fieldValue: string) => {
    return focusedField === fieldName || fieldValue.length > 0;
  };
  async function onsubmit(data: PreRegisterSchema) {
    try {
      const { terms, ...rest } = data;
      await mutateAsync(rest);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  }
  return (
    <AuthLayout
      className='justify-between'
      text='Vous avez déjà un compte ?'
      textLink='Connectez-vous'
      url='/auth/login'
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
            onSubmit={handleSubmit(onsubmit)}
            className='space-y-4 relative z-20 max-w-[400px]'
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
              name='phone'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        {...field}
                        type='email'
                        aria-label='Email'
                        className='pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                      />
                    </FormControl>
                    <FormLabel
                      className={`absolute left-3 transition-all duration-200 pointer-events-none bg-background px-1 ${
                        shouldAnimateLabel('email', watchedEmail!)
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
              disabled={!watchedTerms || isPending}
              type='submit'
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              {isPending ? 'Inscription en cours...' : "S'inscrire"}
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
            <Button type='button' variant='outline' className='w-full'>
              <Google className='mr-2 size-5' />
              S&apos;inscrire avec Google
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}

export default PreRegisterForm;
