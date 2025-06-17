import { z } from 'zod';

export const contractSchema = z
  .object({
    lieu: z
      .string({ required_error: 'Le lieu est obligatoire' })
      .min(1, { message: 'Le lieu est obligatoire' }),
    heureDebut: z.date({ required_error: "L'heure de debut est obligatoire" }),
    heureFin: z.date({ required_error: "L'heure de fin est obligatoire" }),
    taches: z
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
    estGabarit: z.boolean().optional(),
    nomGabarit: z
      .string({ required_error: 'Le nom du gabarit est obligatoire' })
      .optional(),
    estRepetif: z.boolean().optional(),
    utilisateur: z
      .array(z.string())
      .min(1, { message: 'Le contrat doit avoir au moins un employe' }),
  })
  .refine(
    (data) => data.estGabarit === false || data.nomGabarit !== undefined,
    { message: 'Le nom du gabarit est obligatoire' }
  );

export type ContractSchema = z.infer<typeof contractSchema>;
