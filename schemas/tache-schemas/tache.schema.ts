import { z } from 'zod';

export const tacheSchema = z.object({
  titre: z.string().min(1, { message: 'Le titre est obligatoire' }),
  description: z.string().min(1, { message: 'La description est obligatoire' }),
  TimeEstimated: z
    .number()
    .min(1, { message: 'Le temps estimé est obligatoire' }),
});

export type Tache = z.infer<typeof tacheSchema>;
