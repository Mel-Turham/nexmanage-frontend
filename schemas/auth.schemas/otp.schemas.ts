import { z } from 'zod';

export const otpSchema = z.object({
  opt: z
    .string()
    .min(6, 'Le code OTP doit contenir au moins 6 chiffres')
    .max(6, 'Le code OTP doit contenir au moins 6 chiffres'),
});

export type OTPSchema = z.infer<typeof otpSchema>;
