'use client';

import Image from 'next/image';
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
  type ContractSchema,
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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { useApiMutation } from '@/hooks/apis/use-api';
import type { Contrat } from '@/types';
import { FileTextIcon, SaveIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

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
      pause: undefined,
      estGabarit: false,
      nomGabarit: '',
      utilisateur: [],
    },
  });

  const createContratMutation = useApiMutation<Contrat, ContractSchema>(
    'POST',
    '/contrats',
    {
      onSuccess: (data) => {
        console.log('Contrat créé:', data);
        form.reset();
      },
      onError: (error) => {
        console.error('Erreur création contrat:', error);
      },
    }
  );

  const onSubmit = async (data: ContractSchema) => {
    console.log('Données soumises:', data);

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

  const createTimeDate = (timeString: string, baseDate?: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const getTimeString = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toTimeString().substring(0, 5);
  };

  return (
    <ScrollArea className='h-[550px]'>
      <div className='space-y-6'>
        {/* Header avec image */}
        <div className='relative'>
          <div className='h-[200px] w-full relative overflow-hidden rounded-2xl shadow-lg'>
            <Image
              fill
              alt='map-image'
              src={'/map.png'}
              className='object-cover w-full h-full'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
            <div className='absolute bottom-4 left-4'>
              <h2 className='text-white text-2xl font-bold drop-shadow-lg'>
                Nouveau Contrat
              </h2>
              <p className='text-white/90 text-sm drop-shadow'>
                Créez un nouveau contrat de travail
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Informations générales */}
            <Card className='shadow-sm border-0 bg-gradient-to-br from-slate-50 to-white'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Location01Icon size={20} className='text-blue-600' />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Lieu */}
                <FormField
                  control={form.control}
                  name='lieu'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                        <Location01Icon size={16} className='text-gray-600' />
                        Lieu de travail
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Entrez le lieu de travail'
                          className='h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Poste */}
                <FormField
                  control={form.control}
                  name='poste'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                        <WorkAlertIcon size={16} className='text-gray-600' />
                        Poste
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Intitulé du poste'
                          className='h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Horaires */}
            <Card className='shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-white'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Clock01Icon size={20} className='text-emerald-600' />
                  Horaires de travail
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Heure début */}
                  <FormField
                    control={form.control}
                    name='heureDebut'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm font-medium'>
                          Heure de début
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            className='h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20'
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

                  {/* Heure fin */}
                  <FormField
                    control={form.control}
                    name='heureFin'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm font-medium'>
                          Heure de fin
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            className='h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20'
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

                {/* Pause */}
                <FormField
                  control={form.control}
                  name='pause'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                        <PauseIcon size={16} className='text-gray-600' />
                        Pause (optionnelle)
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircleIcon
                                size={16}
                                className='text-gray-400 hover:text-gray-600'
                              />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-xs'>
                              <p className='text-xs'>
                                Laisser vide pour ne pas ajouter de pause
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='time'
                          step={1}
                          placeholder='Heure de pause'
                          className='h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
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
              </CardContent>
            </Card>

            {/* Tâches et équipe */}
            <Card className='shadow-sm border-0 bg-gradient-to-br from-purple-50 to-white'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <CheckListIcon size={20} className='text-purple-600' />
                  Tâches et équipe
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Tâches */}
                <FormField
                  control={form.control}
                  name='taches'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                        <CheckListIcon size={16} className='text-gray-600' />
                        Tâches à effectuer
                        <Badge variant='secondary' className='text-xs'>
                          Optionnel
                        </Badge>
                      </FormLabel>
                      <FormControl>
                        <MultipleSelector
                          className='border-gray-200 focus:border-purple-500'
                          commandProps={{
                            label: 'Tâches',
                          }}
                          defaultOptions={randomTasks}
                          placeholder='Sélectionner des tâches'
                          emptyIndicator={
                            <p className='text-center text-sm text-gray-500'>
                              Aucune tâche trouvée
                            </p>
                          }
                          value={randomTasks.filter((option) =>
                            (field.value ?? []).includes(option.value)
                          )}
                          onChange={(selectedOptions) => {
                            field.onChange(
                              selectedOptions.map((opt) => opt.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Employés */}
                <FormField
                  control={form.control}
                  name='utilisateur'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                        <AddTeamIcon size={16} className='text-gray-600' />
                        Employés assignés
                        <Badge variant='destructive' className='text-xs'>
                          Requis
                        </Badge>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircleIcon
                                size={16}
                                className='text-gray-400 hover:text-gray-600'
                              />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-xs'>
                              <p className='text-xs'>
                                Au moins un employé doit être sélectionné
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <MultipleSelector
                          className='border-gray-200 focus:border-purple-500'
                          commandProps={{
                            label: 'Employés',
                          }}
                          defaultOptions={randomUsers}
                          placeholder='Sélectionner des employés'
                          emptyIndicator={
                            <p className='text-center text-sm text-gray-500'>
                              Aucun employé trouvé
                            </p>
                          }
                          value={randomUsers.filter((option) =>
                            (field.value ?? []).includes(option.value)
                          )}
                          onChange={(selectedOptions) => {
                            field.onChange(
                              selectedOptions.map((opt) => opt.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card className='shadow-sm border-0 bg-gradient-to-br from-amber-50 to-white'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <FileTextIcon size={20} className='text-amber-600' />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                        Description du contrat
                        <Badge variant='secondary' className='text-xs'>
                          Optionnel
                        </Badge>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ajoutez une description détaillée...'
                          className='h-11 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Options avancées */}
            <Card className='shadow-sm border-0 bg-gradient-to-br from-indigo-50 to-white'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <SaveIcon size={20} className='text-indigo-600' />
                  Options avancées
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100'>
                  <div className='flex items-center space-x-3'>
                    <FormField
                      control={form.control}
                      name='estGabarit'
                      render={({ field }) => (
                        <FormItem className='flex items-center space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormLabel className='text-sm font-medium cursor-pointer'>
                        Sauvegarder comme gabarit
                      </FormLabel>
                      <p className='text-xs text-gray-500'>
                        Réutilisez ce contrat comme modèle
                      </p>
                    </div>
                  </div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircleIcon
                          size={18}
                          className='text-gray-400 hover:text-gray-600'
                        />
                      </TooltipTrigger>
                      <TooltipContent className='max-w-sm'>
                        <p className='text-xs'>
                          Cette option vous permet de réutiliser rapidement ce
                          contrat comme modèle pour vos prochains horaires.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {form.watch('estGabarit') && (
                  <div className='animate-in slide-in-from-top-2 duration-200'>
                    <FormField
                      control={form.control}
                      name='nomGabarit'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium'>
                            Nom du gabarit
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Donnez un nom à votre gabarit'
                              className='h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
              <button
                type='button'
                className='px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200'
                onClick={() => form.reset()}
              >
                Annuler
              </button>
              <button
                className='px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                type='submit'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loading01Icon className='animate-spin' size={16} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <SaveIcon size={16} />
                    Enregistrer le contrat
                  </>
                )}
              </button>
            </div>

            {/* Debug errors */}
            {Object.keys(form.formState.errors).length > 0 && (
              <Card className='border-red-200 bg-red-50'>
                <CardContent className='pt-6'>
                  <div className='flex items-start gap-3'>
                    <div className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <div className='w-2 h-2 rounded-full bg-red-500' />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-red-800 mb-2'>
                        Erreurs de validation
                      </h4>
                      <ul className='text-sm text-red-600 space-y-1'>
                        {Object.entries(form.formState.errors).map(
                          ([field, error]) => (
                            <li key={field} className='flex items-center gap-2'>
                              <div className='w-1 h-1 rounded-full bg-red-400' />
                              <span className='font-medium'>{field}:</span>
                              <span>{error?.message}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default ContratForm;
