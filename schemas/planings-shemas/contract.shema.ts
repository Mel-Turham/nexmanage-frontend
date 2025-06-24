import { z } from 'zod';

export const contractSchema = z.object({
  lieu: z
    .array(z.number())
    .length(2, {
      message: 'Les coordonnées doivent contenir latitude et longitude',
    })
    .optional(),
  lieuName: z.string().optional(),
  dateDebut: z.date({ required_error: "L'heure de debut est obligatoire" }),
  dateFin: z.date({ required_error: "L'heure de fin est obligatoire" }),
  tachesIds: z
    .array(
      z
        .string({ required_error: 'La tache est obligatoire' })
        .min(1, { message: 'La tache est obligatoire' })
    )
    .optional(),
  description: z
    .string({ required_error: 'La description est obligatoire' })
    .min(1, { message: 'La description est obligatoire' })
    .optional(),
  pause: z
    .date({ required_error: "L'heure de fin est obligatoire" })
    .optional(),
  nombreJoursRepetition: z.number().optional(),
  utilisateursIds: z
    .array(
      z
        .string({ required_error: 'Minimum 1 Employe' })
        .min(1, { message: 'Minimum 1 Employe' })
    )
    .optional(),
});

export type ContractSchema = z.infer<typeof contractSchema>;
