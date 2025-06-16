'use client';

import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OTPSchema, otpSchema } from '../../schemas/auth.schemas/otp.schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { toast } from 'sonner';
import Link from 'next/link';

const OtpForm = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes en secondes
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handlePreviousPage = () => {
    router.back();
  };

  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      opt: '',
    },
  });

  // Fonction de soumission du formulaire
  const onSubmit = async (data: OTPSchema) => {
    try {
      console.log('Code OTP soumis:', data.opt);
    } catch (error) {
      console.error('Erreur lors de la validation OTP:', error);
    }
  };

  // Observer les changements de la valeur OTP
  const watchOtp = form.watch('opt');

  useEffect(() => {
    if (watchOtp && watchOtp.length === 6) {
      // Déclencher la validation du formulaire
      form.handleSubmit(onSubmit)();
    }
  }, [watchOtp, form]);

  // Gestion du compte à rebours
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            toast.error(
              'Le code OTP a expiré. Veuillez en demander un nouveau.'
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeLeft]);

  // Fonction pour formater le temps (mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handlerResendOtp = async () => {
    // Réinitialiser le timer
    setTimeLeft(300);
    setIsTimerActive(true);
    // Effacer le champ OTP
    form.reset({ opt: '' });
    toast.success('OTP ENVOYÉ AVEC SUCCÈS');
  };

  return (
    <AuthLayout className=''>
      <NextManageIcon />
      <div className='px-2'>
        <Button
          onClick={handlePreviousPage}
          className='cursor-pointer'
          variant={'outline'}
          size={'sm'}
        >
          <ChevronLeft /> Retour
        </Button>
      </div>
      <div className='flex flex-col items-center gap-4 w-full lg:justify-center mx-auto'>
        <div className='relative z-10'>
          <h1 className='text-xl mt-8 font-semibold text-[#344EA2] text-center'>
            Vérification de votre numéro <br /> de téléphone
          </h1>
        </div>

        {/* Affichage du compte à rebours */}
        <div className='flex items-center gap-2'>
          <div
            className={`text-lg font-mono font-semibold px-3 py-1 rounded-md ${
              timeLeft <= 60
                ? 'text-red-500 bg-red-50'
                : 'text-[#344EA2] bg-blue-50'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          {timeLeft === 0 && (
            <span className='text-red-500 text-sm font-medium'>Expiré</span>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='opt'
              render={({ field }) => (
                <FormItem className='bg-[#8FA3FF]/20 rounded-md py-5 px-3.5'>
                  <FormControl>
                    <InputOTP
                      disabled={watchOtp?.length === 6 || timeLeft === 0}
                      maxLength={6}
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Bouton de soumission optionnel (caché par défaut) */}
            <Button
              type='submit'
              className='w-full mt-4'
              disabled={watchOtp?.length !== 6 || timeLeft === 0}
              style={{ display: 'none' }} // Caché car la soumission est automatique
            >
              Vérifier
            </Button>
          </form>
        </Form>

        {/* Indicateur de progression */}
        <div className='flex gap-1 mt-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                (watchOtp?.length || 0) > index ? 'bg-[#344EA2]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Message d'instruction */}
        <div className='text-sm text-gray-600 max-w-[430px] p-4 rounded-md bg-[#8FA3FF]/20 text-center mt-2'>
          <p className='text-xs mb-2'>
            {timeLeft > 0
              ? `Entrez le code reçu par SMS. Code valable ${formatTime(
                  timeLeft
                )}. Vous n'avez pas reçu le code ?`
              : 'Le code a expiré. Cliquez pour en recevoir un nouveau.'}
          </p>
          <button
            onClick={handlerResendOtp}
            type='button'
            className={`font-semibold cursor-pointer transition-colors ${
              timeLeft > 0 && timeLeft < 300
                ? 'text-[#142938] hover:text-[#344EA2]'
                : timeLeft === 0
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={timeLeft === 300} // Désactiver pendant la première minute
          >
            {timeLeft === 300 ? 'Patientez...' : 'Cliquez pour renvoyer.'}
          </button>
        </div>
      </div>
      <div className='px-6 flex justify-between mt-6 flex-wrap   z-20 relative'>
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

export default OtpForm;
