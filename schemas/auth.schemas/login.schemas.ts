import { z } from 'zod';

export const loginSchema = z
  .object({
    telephone: z
      .string()
      .min(6, 'Le numéro est trop court')
      .max(20, 'Le numéro est trop long')
      .optional()
      .or(z.literal('')), 
    email: z
      .string()
      .email('Entrez un email valide')
      .optional()
      .or(z.literal('')),
    password: z.string().min(8, 'Le mot de passe est obligatoire'),
  })
  .refine((data) => !!data.email || !!data.telephone, {
    message: 'Entrez un email ou un numéro de téléphone',
    path: ['email'], 
  })
  .refine((data) => !(data.email && data.telephone), {
    message: 'Entrez uniquement un email ou un numéro, pas les deux',
    path: ['email'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
