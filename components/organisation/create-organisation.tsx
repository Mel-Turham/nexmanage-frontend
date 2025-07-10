'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useApiMutation } from '@/hooks/apis/use-api';
import {
  createEntrepriseSchema,
  CreateEntrepriseSchema,
} from '@/schemas/create-entreprise-schemas/create-entreprise.schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

function CreateOrganisation() {
  const router = useRouter();
  const [openCreateEntrepriseDialog, setOpenCreateEntrepriseDialog] =
    useState(false);
  const queryClient = useQueryClient();
  const form = useForm<CreateEntrepriseSchema>({
    resolver: zodResolver(createEntrepriseSchema),
    defaultValues: {
      nom: '',
      domain: '',
      email: '',
      adresse: '',
      nbreEmployes: 0,
    },
  });

  const { mutateAsync, isPending } = useApiMutation<
    unknown,
    CreateEntrepriseSchema
  >('POST', '/company/create', {
    onSuccess: (data) => {
      console.log('Entreprise created successfully:', data);
      setOpenCreateEntrepriseDialog(false);
      form.reset();
      toast.success('Entreprise créée avec succès');

      queryClient.invalidateQueries({ queryKey: ['entreprises'] });
    },
    onError: (error) => {
      console.error('Error creating entreprise:', error);
      toast.error(
        error.message || "Erreur lors de la création de l'entreprise"
      );
    },
  });

  const onSubmit = async (data: CreateEntrepriseSchema) => {
    const loadingId = toast.loading("Création de l'entreprise en cours...");
    try {
      await mutateAsync({
        ...data,
        nbreEmployes: Number(data.nbreEmployes),
      });
      console.log('Entreprise created:', data);
      router.push('/admin');
    } catch (error) {
      console.error('Error creating entreprise:', error);
    } finally {
      toast.dismiss(loadingId);
    }
  };
  return (
    <Dialog
      open={openCreateEntrepriseDialog}
      onOpenChange={setOpenCreateEntrepriseDialog}
    >
      <DialogTrigger asChild>
        <Button
          className='w-fit text-white'
          onClick={() => setOpenCreateEntrepriseDialog(true)}
        >
          <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
            <Plus className='size-4' />
          </div>
          <div className='font-medium'>Ajouter une Entreprise</div>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle entreprise</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer une nouvelle
            entreprise.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='nom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l&apos;entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='domain'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>domain de l&apos;entreprise</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder="domain de l'entreprise"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de l&apos;entreprise</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='email'
                      type='email'
                      placeholder="Email de l'entreprise"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='adresse'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse de l&apos;entreprise</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='street-address'
                      type='text'
                      placeholder="Adresse de l'entreprise"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nbreEmployes'
              render={({ field }) => (
                <FormItem className='col-span-1 md:col-span-2'>
                  <FormLabel>Nombre d&apos;employés</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='off'
                      type='number'
                      placeholder="Nombre d'employés"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='col-span-1 md:col-span-2'>
              <div className='space-x-2'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => setOpenCreateEntrepriseDialog(false)}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button className='w-fit' type='submit' disabled={isPending}>
                  {isPending ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrganisation;
