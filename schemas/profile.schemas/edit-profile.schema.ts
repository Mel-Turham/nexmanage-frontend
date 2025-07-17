import { z } from 'zod';

export const EditProfileSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères'),
});

export type IEditProfile = z.infer<typeof EditProfileSchema>;
