import { z } from 'zod';

export const createEntrepriseSchema = z.object({
  nom: z
    .string()
    .min(3, "Le nom de l'entreprise doit contenir au moins 3 caractères")
    .max(100),
  domain: z
    .string()
    .min(3, "Le domain de l'entreprise doit contenir au moins 3 caractères")
    .max(100),
  email: z
    .string()
    .email("L'email de l'entreprise doit contenir au moins 3 caractères"),
  adresse: z
    .string()
    .min(3, "L'adresse de l'entreprise doit contenir au moins 3 caractères")
    .max(100),
  nbreEmployes: z
    .number()
    .min(
      1,
      "Le nombre d'employés de l'entreprise doit contenir au moins 1 employé"
    ),
});

export type CreateEntrepriseSchema = z.infer<typeof createEntrepriseSchema>;
