import { z } from 'zod';

export const forgotPasswordSchema = z
  .object({
    phone: z.string().optional(),
    email: z.string().optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Vous devez fournir soit un email, soit un numéro de téléphone',
    path: ['root'],
  })
  .refine((data) => {
    if (data.email && data.email.length > 0) {
      return z.string().email().safeParse(data.email).success;
    }
    return true;
  }, {
    message: 'Entrer un email valide',
    path: ['email'],
  })
  .refine((data) => {
    if (data.phone && data.phone.length > 0) {
      return data.phone.length >= 8; // Ajustez selon vos besoins
    }
    return true;
  }, {
    message: 'Le numéro de téléphone doit contenir au moins 8 chiffres',
    path: ['phone'],
  });

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;