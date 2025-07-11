'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { toast } from 'sonner';

import { OTPSchema, otpSchema } from '../../schemas/auth.schemas/otp.schemas';
import AuthLayout from '@/layouts/auth-layout';
import NextManageIcon from '@/icons/logo';
import { useApiMutation } from '@/hooks/apis/use-api';

interface OtpData {
  code: string;
  email?: string;
  phone?: string;
}

type OtpVerificationResponse = {
  message: string;
  resetToken: string;
};

const OtpForm = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState<string | null>(null);

  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  const watchOtp = form.watch('code');

  useEffect(() => {
    const email = localStorage.getItem('reset-email');
    const phone = localStorage.getItem('reset-phone');
    setEmailOrPhone(email || phone);
  }, []);

  const { mutateAsync, isPending } = useApiMutation<
    OtpVerificationResponse,
    OtpData
  >('POST', '/auth/verify-code', {
    onSuccess: (data) => {
      toast.success('Code validé avec succès');
      console.log('✅ Code OTP validé:', data);
      // Redirige vers la suite
      router.push('/reset-password');
      localStorage.removeItem('reset-email');
      localStorage.removeItem('reset-phone');
      localStorage.setItem('reset-token', data.resetToken);
    },
    onError: (error) => {
      toast.error('Code invalide ou expiré');
      console.error('❌ Erreur OTP:', error);
      form.resetField('code');
    },
  });

  const onSubmit = async (data: OTPSchema) => {
    if (!emailOrPhone) {
      toast.error('Aucun email ou numéro trouvé');
      return;
    }

    await mutateAsync({
      code: data.code,
      email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
    });
  };

  // Auto-submit quand 6 chiffres sont saisis
  useEffect(() => {
    if (watchOtp?.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  }, [watchOtp]);

  // Timer OTP
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          toast.error('Le code OTP a expiré.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
      seconds % 60
    ).padStart(2, '0')}`;

  const handlerResendOtp = async () => {
    form.reset();
    setTimeLeft(300);
    setIsTimerActive(true);

    toast.success('Un nouveau code OTP vous a été envoyé.');
    // Optionnel : appeler un endpoint de renvoi de code ici
    // await resendOtp(emailOrPhone)
  };

  return (
    <AuthLayout>
      <NextManageIcon />

      <div className='px-2'>
        <Button onClick={() => router.back()} variant='outline' size='sm'>
          <ChevronLeft /> Retour
        </Button>
      </div>

      <div className='flex flex-col items-center shadow-lg px-8 py-5 rounded-md max-w-[450px] mt-10 gap-4 w-full mx-auto'>
        <h1 className='text-xl  font-semibold text-[#344EA2] text-center'>
          Vérification de votre numéro <br /> de téléphone
        </h1>

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
              name='code'
              render={({ field }) => (
                <FormItem className='bg-[#8FA3FF]/20 rounded-md py-5 px-3.5'>
                  <FormControl>
                    <InputOTP
                      disabled={watchOtp?.length === 6 || timeLeft === 0}
                      maxLength={6}
                      {...field}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
            {isPending && (
              <Button disabled className='w-full'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                En cours...
              </Button>
            )}
          </form>
        </Form>

        {/* Points de progression */}
        <div className='flex gap-1 mt-2'>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                (watchOtp?.length || 0) > i ? 'bg-[#344EA2]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className='text-sm text-gray-600 max-w-[430px] p-4 rounded-md bg-[#8FA3FF]/20 text-center mt-2'>
          <p className='text-xs mb-2'>
            {timeLeft > 0
              ? `Entrez le code reçu. Valable ${formatTime(timeLeft)}.`
              : 'Le code a expiré. Cliquez pour renvoyer.'}
          </p>
          <button
            onClick={handlerResendOtp}
            disabled={timeLeft === 300}
            type='button'
            className={`font-semibold transition-colors ${
              timeLeft === 300
                ? 'text-gray-400 cursor-not-allowed'
                : timeLeft === 0
                ? 'text-red-500 hover:text-red-600'
                : 'text-[#142938] hover:text-[#344EA2]'
            }`}
          >
            {timeLeft === 300 ? 'Patientez...' : 'Cliquez pour renvoyer'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OtpForm;
