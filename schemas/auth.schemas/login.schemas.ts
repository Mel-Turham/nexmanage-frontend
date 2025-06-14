import { z } from 'zod';

export const loginSchema = z.object({
  telephone: z
    .string()
    .min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres')
    .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, {
      message: 'Format de numéro de téléphone invalide',
    })
    .transform((val) => val.replace(/[\s\-\(\)]/g, ''))
    .refine(
      (val) => {
        return /^[\+]?[0-9]{8,15}$/.test(val);
      },
      {
        message: 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres',
      }
    ),
  motDePasse: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
