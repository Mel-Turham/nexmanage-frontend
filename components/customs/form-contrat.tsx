'use client';

import Image from 'next/image';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import {
  contractSchema,
  ContractSchema,
} from '@/schemas/planings-shemas/contract.shema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddTeamIcon,
  CheckListIcon,
  Clock01Icon,
  HelpCircleIcon,
  Loading01Icon,
  Location01Icon,
  PauseIcon,
  WorkAlertIcon,
} from 'hugeicons-react';
import { Input } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MultipleSelector from '../ui/multiselect';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { useApiMutation } from '@/hooks/apis/use-api';
import { Contrat } from '@/types';

const ContratForm = () => {
  const randomTasks = [
    { value: '1', label: 'Tache 1' },
    { value: '2', label: 'Tache 2' },
    { value: '3', label: 'Tache 3' },
    { value: '4', label: 'Tache 4' },
    { value: '5', label: 'Tache 5' },
    { value: '6', label: 'Tache 6' },
    { value: '7', label: 'Tache 7' },
    { value: '8', label: 'Tache 8' },
    { value: '9', label: 'Tache 9' },
    { value: '10', label: 'Tache 10' },
  ];

  const randomUsers = [
    { value: '1', label: 'User 1' },
    { value: '2', label: 'User 2' },
    { value: '3', label: 'User 3' },
    { value: '4', label: 'User 4' },
  ];

  const form = useForm<ContractSchema>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      lieu: '',
      heureDebut: undefined,
      heureFin: undefined,
      poste: '',
      taches: [],
      description: '',
      pause: undefined, // Changé de new Date() à undefined
      estGabarit: false,
      nomGabarit: '',
      utilisateur: [], // Problème principal : doit avoir au moins 1 élément selon le schema
    },
  });

  const createContratMutation = useApiMutation<Contrat, ContractSchema>(
    'POST',
    '/contrats',
    {
      onSuccess: (data) => {
        console.log('Contrat créé:', data);
        form.reset(); // Reset le formulaire après succès
      },
      onError: (error) => {
        console.error('Erreur création contrat:', error);
      },
    }
  );

  const onSubmit = async (data: ContractSchema) => {
    console.log('Données soumises:', data); // Debug

    const loading = toast.loading('Contrat en cours de création');
    try {
      await createContratMutation.mutateAsync(data);
      toast.dismiss(loading);
      toast.success('Contrat créé avec succès');
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast.dismiss(loading);
      toast.error('Une erreur est survenue lors de la création');
    }
  };

  // Helper function pour créer une date à partir d'une string time
  const createTimeDate = (timeString: string, baseDate?: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Helper function pour extraire le time d'une date
  const getTimeString = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toTimeString().substring(0, 5);
  };

  return (
    <div className='flex flex-col gap-2'>
      {/* Images */}
      <div className='h-[180px] w-full relative overflow-hidden rounded-2xl'>
        <Image
          fill
          alt='map-image'
          src={'/map.png'}
          className='object-cover w-full h-full'
        />
      </div>

      <Form {...form}>
        <form
          className='flex flex-col gap-4 mt-3 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Lieu */}
          <div className='flex items-center gap-2'>
            <Location01Icon size={24} color='#142938' />
            <FormField
              control={form.control}
              name='lieu'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Lieu'
                      className='h-9 flex-1 w-full focus-visible:ring-0'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Heures début et fin */}
          <div className='flex items-center gap-2'>
            <Clock01Icon size={24} color='#142938' />
            <FormField
              control={form.control}
              name='heureDebut'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormControl>
                    <Input
                      type='time'
                      placeholder='Heure de début'
                      className='h-9 flex-1 w-full focus-visible:ring-0'
                      value={getTimeString(field.value)}
                      onChange={(e) => {
                        if (e.target.value) {
                          field.onChange(createTimeDate(e.target.value));
                        }
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span>-</span>
            <FormField
              control={form.control}
              name='heureFin'
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormControl>
                    <Input
                      type='time'
                      placeholder='Heure de fin'
                      className='h-9 flex-1 w-full focus-visible:ring-0'
                      value={getTimeString(field.value)}
                      onChange={(e) => {
                        if (e.target.value) {
                          field.onChange(createTimeDate(e.target.value));
                        }
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Poste et Pause */}
          <div className='flex items-center w-full gap-2'>
            <div className='flex items-center gap-1 flex-1'>
              <WorkAlertIcon size={24} color='#142938' />
              <FormField
                control={form.control}
                name='poste'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        placeholder='Poste'
                        className='h-9 flex-1 w-full focus-visible:ring-0'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex items-center w-1/2 relative'>
              <PauseIcon className='mx-2' size={22} color='#142938' />
              <FormField
                control={form.control}
                name='pause'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        type='time'
                        placeholder='Pause'
                        className='h-9 flex-1 w-full focus-visible:ring-0'
                        value={getTimeString(field.value)}
                        onChange={(e) => {
                          if (e.target.value) {
                            field.onChange(createTimeDate(e.target.value));
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className='absolute right-1' asChild>
                    <HelpCircleIcon size={18} color='#142938' />
                  </TooltipTrigger>
                  <TooltipContent className='px-2 py-3 text-xs bg-white text-gray-600'>
                    Laisser vide pour ne pas ajouter de pause
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Tâches */}
          <div className='flex items-center gap-1 flex-1'>
            <CheckListIcon size={24} color='#142938' />
            <FormField
              control={form.control}
              name='taches'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <MultipleSelector
                      className='w-full flex-1'
                      commandProps={{
                        label: 'Tâches',
                      }}
                      defaultOptions={randomTasks}
                      placeholder='Sélectionner des tâches'
                      emptyIndicator={
                        <p className='text-center text-sm'>
                          Pas de résultat trouvé
                        </p>
                      }
                      value={randomTasks.filter((option) =>
                        (field.value ?? []).includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions.map((opt) => opt.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Employés */}
          <div className='flex items-center gap-1 relative flex-1'>
            <AddTeamIcon size={24} color='#142938' />
            <FormField
              control={form.control}
              name='utilisateur'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <MultipleSelector
                      className='w-full flex-1'
                      commandProps={{
                        label: 'Employés',
                      }}
                      defaultOptions={randomUsers}
                      placeholder='Sélectionner des employés'
                      emptyIndicator={
                        <p className='text-center text-sm'>
                          Pas de résultat trouvé
                        </p>
                      }
                      value={randomUsers.filter((option) =>
                        (field.value ?? []).includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions.map((opt) => opt.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className='absolute right-1' asChild>
                  <HelpCircleIcon size={18} color='#142938' />
                </TooltipTrigger>
                <TooltipContent className='px-2 py-3 text-xs bg-white text-gray-600'>
                  Au moins un employé doit être sélectionné
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Description (champ manquant dans le formulaire original) */}
          <div className='flex items-center gap-2'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Description du contrat'
                      className='h-9 w-full focus-visible:ring-0'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gabarit et nom du gabarit */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <FormField
                control={form.control}
                name='estGabarit'
                render={({ field }) => (
                  <FormItem className='flex items-center space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='font-normal ml-2'>
                      Sauvegarder comme gabarit
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircleIcon
                              size={18}
                              color='#142938'
                              className='ml-1'
                            />
                          </TooltipTrigger>
                          <TooltipContent className='px-2 py-3 text-xs shadow bg-white text-gray-600 max-w-xl w-80'>
                            Cette option vous permet de réutiliser rapidement ce
                            contrat comme modèle pour vos prochains horaires.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Nom du gabarit - affiché seulement si estGabarit est true */}
              {form.watch('estGabarit') && (
                <FormField
                  control={form.control}
                  name='nomGabarit'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Nom du gabarit'
                          className='h-9 w-48 focus-visible:ring-0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
                onClick={() => form.reset()}
              >
                Annuler
              </button>
              <button
                className='custom-button-gradient text-sm font-normal w-[120px] px-4 py-2 rounded-md'
                type='submit'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loading01Icon
                      className='animate-spin mr-1'
                      size={16}
                      color='#fff'
                    />
                    Enregistrer...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </div>

          {/* Debug: Afficher les erreurs de validation */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm font-medium text-red-800 mb-2'>
                Erreurs de validation :
              </p>
              <ul className='text-sm text-red-600 space-y-1'>
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ContratForm;
