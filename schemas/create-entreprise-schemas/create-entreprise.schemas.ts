import { z } from 'zod';

export const createEntrepriseSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom de l'entreprise doit contenir au moins 3 caractères")
    .max(100),
  domaine: z
    .string()
    .min(3, "Le domaine de l'entreprise doit contenir au moins 3 caractères")
    .max(100),
  email: z
    .string()
    .email("L'email de l'entreprise doit contenir au moins 3 caractères"),
  address: z
    .string()
    .min(3, "L'adresse de l'entreprise doit contenir au moins 3 caractères")
    .max(100),
  nombreEmployes: z
    .number()
    .min(
      1,
      "Le nombre d'employés de l'entreprise doit contenir au moins 1 employé"
    ),
});

export type createEntrepriseSchema = z.infer<typeof createEntrepriseSchema>;
