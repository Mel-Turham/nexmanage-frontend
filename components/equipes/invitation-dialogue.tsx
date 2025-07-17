'use client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '../ui/dialog';
import { useState } from 'react';
import { inviteSchema, InviteSchema } from '@/schemas/employer/invite.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useApiMutation } from '@/hooks/apis/use-api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function InvitationDialogue() {
  const [switchField, setSwitchField] = useState(true);
  const [open, setOpen] = useState(false);
  const actifOrg = useAuthStore((state) => state.organisationActive);

  const form = useForm<InviteSchema>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      phone: '',
      email: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = form;

  const { mutateAsync, isPending } = useApiMutation<
    { success: boolean; message: string },
    InviteSchema
  >('POST', `/org/${actifOrg?.id}/invite`, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message, { duration: 4000 });
      }
    },
    onError: (error) => {
      toast.error(error.message, { duration: 4000 });
    },
  });

  const onSubmit = async (data: InviteSchema) => {
    if (!actifOrg) {
      toast.error('Vous devez choisir une organisation');
      return;
    }
    try {
      const res = await mutateAsync(data);
      if (res.success) {
        reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'invitation");
    }
  };

  const handleSwitch = () => {
    if (switchField) {
      setValue('email', '');
    } else {
      setValue('phone', '');
    }
    clearErrors();
    setSwitchField((prev) => !prev);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button'>Inviter un membre</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Envoyez une invitation à un membre de l'équipe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {switchField ? (
            <div className='grid gap-3'>
              <Label htmlFor='email'>Adresse email</Label>
              <Input
                id='email'
                type='email'
                disabled={isPending}
                placeholder='Ex : nom@exemple.com'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
              )}
            </div>
          ) : (
            <div className='grid gap-3'>
              <Label htmlFor='phone'>Numéro de téléphone</Label>
              <Input
                id='phone'
                type='tel'
                disabled={isPending}
                placeholder='Ex : +237 6 XX XX XX XX'
                {...register('phone')}
              />
              {errors.phone && (
                <p className='text-red-500 text-sm'>{errors.phone.message}</p>
              )}
            </div>
          )}

          <div className='flex justify-between items-center gap-2'>
            <Button
              size='sm'
              variant='link'
              type='button'
              onClick={handleSwitch}
              disabled={isPending}
            >
              {switchField ? 'Inviter par téléphone' : 'Inviter par email'}
            </Button>

            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Envoyer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
