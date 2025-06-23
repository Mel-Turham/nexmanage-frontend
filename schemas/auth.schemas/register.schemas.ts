import { z } from 'zod';

export const registerSchema = z
  .object({
    nom: z
      .string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(20),
    telephone: z
      .string({ required_error: 'Le numéro de téléphone est requis' })
      .min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Vous devez accepter les termes et conditions',
    }),
    motDePasse: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .regex(
        /[^A-Za-z0-9]/,
        'Le mot de passe doit contenir au moins un caractère spécial'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.motDePasse === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
