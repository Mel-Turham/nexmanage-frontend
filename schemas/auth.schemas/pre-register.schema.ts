import { z } from 'zod';

export const preRegisterSchema = z
  .object({
    nom: z
      .string()
      .min(2)
      .regex(
        /^[A-Za-zÀ-ÿ\s'-]+$/,
        'Le nom doit contenir uniquement des lettres'
      ),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Vous devez accepter les termes et conditions',
    }),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Vous devez fournir soit un email, soit un numéro de téléphone',
    path: ['email', 'phone'],
  });

export type PreRegisterSchema = z.infer<typeof preRegisterSchema>;
