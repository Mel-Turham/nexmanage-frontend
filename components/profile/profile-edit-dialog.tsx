'use client';

import { EditProfileSchema, IEditProfile } from '@/schemas/profile.schemas/edit-profile.schema';
import { EditUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useApiMutation } from '@/hooks/apis/use-api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface ProfileEditDialogProps {
  user: EditUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({ user, open, onOpenChange }: ProfileEditDialogProps) {
  const setUserUpdate = useAuthStore((state) => state.setUserUpdate);
  const form = useForm<IEditProfile>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      nom: user.nom || '',
      phone: user.phone || '',
    },
  });
  const { mutateAsync, isPending: isLoading } = useApiMutation<
    { success: boolean; message: string },
    IEditProfile
  >('PATCH', '/user/me', {
    onSuccess: (data) => {
      const { message, success } = data;
      if (success) {
        setUserUpdate(user);
        toast.success(message, { duration: 3000 });
        onOpenChange(false);
        return;
      }
    },
    onError: (error) => {
      toast.error(error.message, { duration: 3000 });
    },
  });
  const onSubmit = async (data: IEditProfile) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.log('Erreur lors la modification du profile', error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles. Cliquez sur sauvegarder pour confirmer les
            modifications.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer votre numéro de téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
