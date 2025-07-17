'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Globe, Loader2, Save } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { useAuthStore } from '@/stores/auth-store';
import { useForm } from 'react-hook-form';
import {
  createEntrepriseSchema,
  EditOrganisation as EditOrg,
} from '@/schemas/create-entreprise-schemas/create-entreprise.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiMutation } from '@/hooks/apis/use-api';
import { EditOrgResponse } from '@/types';
import { toast } from 'sonner';

function EditOrganisation() {
  const actifOrg = useAuthStore((state) => state.organisationActive);
  const updateOrganisation = useAuthStore((state) => state.updateOrganisation);

  // Si aucune organisation active, on n'affiche pas le formulaire
  if (!actifOrg) {
    return (
      <Card>
        <CardContent className='p-6 text-center text-yellow-600'>
          <p>Aucune organisation active trouvée.</p>
        </CardContent>
      </Card>
    );
  }

  const form = useForm<EditOrg>({
    resolver: zodResolver(createEntrepriseSchema),
    defaultValues: {
      id: actifOrg.id,
      nom: actifOrg.nom || '',
      domain: actifOrg.domain || '',
      adresse: actifOrg.adresse || '',
      nbreEmployes: actifOrg.nbreEmployes || 0,
      email: actifOrg.email || '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = form;

  // Synchronisation du formulaire à chaque changement de l'organisation active
  useEffect(() => {
    reset({
      id: actifOrg.id,
      nom: actifOrg.nom || '',
      domain: actifOrg.domain || '',
      adresse: actifOrg.adresse || '',
      nbreEmployes: actifOrg.nbreEmployes || 0,
      email: actifOrg.email || '',
    });
  }, [actifOrg, reset]);

  const { isPending, mutateAsync, error } = useApiMutation<
    EditOrgResponse,
    EditOrg
  >('PATCH', '/org', {
    onSuccess: (data) => {
      if (data.result) {
        updateOrganisation(data.result);
        reset({
          id: data.result.id,
          nom: data.result.nom,
          domain: data.result.domain,
          adresse: data.result.adresse,
          nbreEmployes: data.result.nbreEmployes,
          email: data.result.email,
        });
        toast.success(data.message, { duration: 4000 });
      }
    },
    onError: (error) => {
      toast.error(
        error.message || 'Une erreur est survenue lors de la mise à jour',
        { duration: 4000 }
      );
    },
  });

  const onSubmit = async (data: EditOrg) => {
    await mutateAsync({
      ...data,
      id: actifOrg.id,
      nbreEmployes: Number(data.nbreEmployes) || 0,
    });
  };

  const isLoading = isSubmitting || isPending;

  if (error) {
    return (
      <Card>
        <CardContent className='p-6 text-center text-red-500'>
          <p className='text-lg font-semibold'>Erreur de chargement</p>
          <p className='text-sm mt-2'>{error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            className='mt-4'
            variant='outline'
          >
            Actualiser la page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Globe className='w-5 h-5 mr-2' />
          Informations de l&apos;Entreprise
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        <form
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Nom */}
          <div className='space-y-2'>
            <Label htmlFor='companyName'>
              Nom de l&apos;organisation <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('nom')}
              id='companyName'
              disabled={isLoading}
              placeholder="Entrez le nom de l'organisation"
            />
            {errors.nom && (
              <p className='text-red-500 text-sm'>{errors.nom.message}</p>
            )}
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label htmlFor='email'>
              Email de l&apos;entreprise <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('email')}
              id='email'
              disabled={isLoading}
              placeholder='exemple@entreprise.com'
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
          </div>

          {/* Domaine */}
          <div className='space-y-2'>
            <Label htmlFor='domaine'>
              Domaine <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('domain')}
              id='domaine'
              disabled={isLoading}
              placeholder='Ex: Technologie, Finance, etc.'
            />
            {errors.domain && (
              <p className='text-red-500 text-sm'>{errors.domain.message}</p>
            )}
          </div>

          {/* Adresse */}
          <div className='space-y-2'>
            <Label htmlFor='address'>
              Adresse <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('adresse')}
              id='address'
              disabled={isLoading}
              placeholder="Adresse complète de l'entreprise"
            />
            {errors.adresse && (
              <p className='text-red-500 text-sm'>{errors.adresse.message}</p>
            )}
          </div>

          {/* Nombre d'employés */}
          <div className='space-y-2'>
            <Label htmlFor='nombreEmployer'>
              Nombre d&apos;employés <span className='text-red-500'>*</span>
            </Label>
            <Input
              {...register('nbreEmployes', { valueAsNumber: true })}
              id='nombreEmployer'
              type='number'
              min='0'
              disabled={isLoading}
              placeholder='0'
            />
            {errors.nbreEmployes && (
              <p className='text-red-500 text-sm'>
                {errors.nbreEmployes.message}
              </p>
            )}
          </div>

          {/* Bouton */}
          <div className='md:col-span-2'>
            <Button type='submit' className='w-fit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditOrganisation;
