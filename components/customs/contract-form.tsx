'use client';
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
  HelpCircleIcon,
  Loading01Icon,
  Location01Icon,
  PauseIcon,
} from 'hugeicons-react';
import { Input } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MultipleSelector from '../ui/multiselect';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { MapPin, Maximize2, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/laoding';
import LocationSelector from './location-selector';
import { useApiMutation } from '@/hooks/apis/use-api';

interface ContractFormProps {
  initialDate?: Date | null;
}

const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => <Loading />,
});

const ContractForm = ({ initialDate }: ContractFormProps) => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    coordinates: number[];
  } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
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
      lieu: [],
      lieuName: '',
      dateDebut: undefined,
      dateFin: undefined,
      tachesIds: [],
      description: '',
      pause: undefined,
      nombreJoursRepetition: undefined,
      utilisateursIds: [],
    },
  });
  useEffect(() => {
    const lieu = form.watch('lieu');
    const lieuName = form.watch('lieuName');

    console.log('📍 Changement detecté:', { lieu, lieuName });

    if (
      lieu &&
      lieu.length === 2 &&
      lieuName &&
      !isNaN(lieu[0]) &&
      !isNaN(lieu[1])
    ) {
      console.log('✅ Mise à jour selectedLocation:', {
        name: lieuName,
        coordinates: lieu,
      });
      setSelectedLocation({
        name: lieuName,
        coordinates: lieu,
      });
      setMapReady(true);
    }
  }, [form.watch('lieu'), form.watch('lieuName')]);

  type contratMutationData = Pick<
    ContractSchema,
    | 'lieu'
    | 'description'
    | 'dateDebut'
    | 'dateFin'
    | 'tachesIds'
    | 'pause'
    | 'nombreJoursRepetition'
    | 'utilisateursIds'
  >;

  const createContratMutation = useApiMutation<unknown, contratMutationData>(
    'POST',
    '/contracts',
    {
      onError: (error) => {
        console.error('❌ Erreur lors de la création du contrat:', error);
        toast.error('❌ Erreur lors de la création du contrat');
      },
      onSuccess: () => {
        console.log('✅ Contrat cree avec success');
        toast.success('✅ Contrat cree avec success');
        router.push('/admin/planning');
      },
    }
  );

  const handleMapClick = (coordinates: [number, number]) => {
    console.log('🖱️ Clic sur carte reçu:', coordinates);

    // Validation des coordonnées
    if (
      !coordinates ||
      coordinates.length !== 2 ||
      isNaN(coordinates[0]) ||
      isNaN(coordinates[1])
    ) {
      console.error('❌ Coordonnées invalides:', coordinates);
      return;
    }

    // Conversion en array de numbers pour le schema
    const coordsArray = [coordinates[0], coordinates[1]];

    reverseGeocode(coordinates[0], coordinates[1])
      .then((name) => {
        console.log('✅ Reverse geocoding réussi:', name);
        form.setValue('lieuName', name, { shouldValidate: true });
        form.setValue('lieu', coordsArray, { shouldValidate: true });

        setSelectedLocation({
          name,
          coordinates: coordsArray,
        });
      })
      .catch((error) => {
        console.error('❌ Erreur reverse geocoding:', error);
        const name = 'Position sélectionnée';
        form.setValue('lieuName', name, { shouldValidate: true });
        form.setValue('lieu', coordsArray, { shouldValidate: true });

        setSelectedLocation({
          name,
          coordinates: coordsArray,
        });
      });
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    console.log('🔍 Reverse geocoding pour:', { lat, lon });
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            format: 'json',
            'accept-language': 'fr,en',
            zoom: '14',
          })
      );

      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();

      console.log('✅ Reverse geocoding:', data);

      // Meilleure extraction du nom
      return (
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        data.display_name?.split(',')[0]?.trim() ||
        'Lieu sélectionné'
      );
    } catch (error) {
      console.error('Erreur reverse geocoding:', error);
      return 'Lieu sélectionné';
    }
  };

  const onSubmit = async (data: ContractSchema) => {
    const { lieuName, ...rest } = data;
    console.log('Nom du lieu:', lieuName);
    console.log('Données soumises:', rest);
    const loading = toast.loading('Contrat en cours de création');
    try {
      await createContratMutation.mutateAsync(rest);
      toast.dismiss(loading);
      form.reset();
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast.dismiss(loading);
    } finally {
      toast.dismiss(loading);
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
    <div className='space-y-6'>
      {/* Header avec image */}
      {mapReady && selectedLocation && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <MapPin size={16} className='text-blue-600' />
              <span className='text-sm font-medium text-gray-700'>
                Localisation sélectionnée
              </span>
              <Badge variant='outline' className='text-xs'>
                {selectedLocation.name}
              </Badge>
            </div>
            <button
              type='button'
              onClick={() => setIsMapFullscreen(!isMapFullscreen)}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              title='Plein écran'
            >
              <Maximize2 size={16} className='text-gray-600' />
            </button>
          </div>

          <div
            className={`relative rounded-lg overflow-hidden border border-gray-200 ${
              isMapFullscreen ? 'h-[500px]' : 'h-[300px]'
            } transition-all duration-300`}
          >
            <MapComponent
              center={selectedLocation.coordinates as [number, number]}
              zoom={15}
              onMapClick={handleMapClick}
              markers={[
                {
                  position: selectedLocation.coordinates as [number, number],
                  popup: selectedLocation.name,
                },
              ]}
              className='w-full h-full'
            />
          </div>

          <div className='text-xs text-gray-500 flex items-center gap-1'>
            <MapPin size={12} />
            <span>
              Coordonnées: {selectedLocation.coordinates[0].toFixed(6)},{' '}
              {selectedLocation.coordinates[1].toFixed(6)}
            </span>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 w-full'
        >
          {/* Informations générales */}
          <Card>
            <CardContent className='space-y-4 pt-6'>
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
              {/* Lieu */}
              <FormField
                control={form.control}
                name='lieu'
                render={() => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                      <Location01Icon size={16} className='text-gray-600' />
                      Lieu de travail
                    </FormLabel>
                    <FormControl>
                      <LocationSelector
                        value={form.watch('lieuName') || ''}
                        onSelect={(name, coordinates) => {
                          form.setValue('lieuName', name);
                          form.setValue('lieu', coordinates);
                          setSelectedLocation({ name, coordinates });
                        }}
                        placeholder='Rechercher une ville...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Horaires */}
          <Card>
            <CardContent className='space-y-4 pt-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Heure début */}
                <FormField
                  control={form.control}
                  name='dateDebut'
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
                              const baseDate = initialDate || new Date();
                              field.onChange(
                                createTimeDate(e.target.value, baseDate)
                              );
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
                  name='dateFin'
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
                              const baseDate = initialDate || new Date();
                              field.onChange(
                                createTimeDate(e.target.value, baseDate)
                              );
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
                          <TooltipContent className='max-w-xs bg-background border'>
                            <p className='text-xs text-foreground'>
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
                            const baseDate = initialDate || new Date();
                            field.onChange(
                              createTimeDate(e.target.value, baseDate)
                            );
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
          <Card>
            <CardContent className='space-y-4 pt-6'>
              {/* Tâches */}
              <FormField
                control={form.control}
                name='tachesIds'
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
                name='utilisateursIds'
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
                          <TooltipContent className='max-w-xs bg-background border'>
                            <p className='text-xs text-foreground'>
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

          {/* Actions */}
          <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
            <button
              type='button'
              className='px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200'
              onClick={() => router.back()}
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
  );
};

export default ContractForm;
