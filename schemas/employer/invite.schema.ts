import { z } from 'zod';

export const inviteSchema = z
  .object({
    phone: z
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
  })
  .refine((data) => !!data.email || !!data.phone, {
    message: 'Entrez un email ou un numéro de téléphone',
    path: ['email'],
  })
  .refine((data) => !(data.email && data.phone), {
    message: 'Entrez uniquement un email ou un numéro, pas les deux',
    path: ['email'],
  });

export type InviteSchema = z.infer<typeof inviteSchema>;
