'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  Users,
  Calendar,
  Shield,
  Clock,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAuthStore } from '@/stores/auth-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { CheckCheck, Ellipsis, Loader2 } from 'lucide-react';
import { Organisation, UserRole } from '@/types';
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApiMutation } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { format } from 'date-fns/format';
import { fr } from 'date-fns/locale';

function OrganisationsList() {
  const organisations = useAuthStore((state) => state.organisations);
  const setOrganisations = useAuthStore((state) => state.setOrganisations);
  const actifOrg = useAuthStore((state) => state.organisationActive);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [organisationToEdit, setOrganisationToEdit] =
    useState<Organisation | null>(null);
  const [organisationToDelete, setOrganisationToDelete] =
    useState<Organisation | null>(null);
  const [orgInfo, setOrgInfo] = useState<Organisation | null>(null);
  const [showOrgInfo, setShowOrgInfo] = useState<boolean>(false);
  const isLoading = useAuthStore(
    (state) => !state.user && !state.organisations.length
  );

  const orgAdmin = organisations.filter((org) => org.role === UserRole.ADMIN);
  const orgEmploye = organisations.filter(
    (org) => org.role === UserRole.EMPLOYE
  );

  const handlerSetActiveOrg = (org: Organisation) => () => {
    useAuthStore.getState().setOrganisationActive(org);
    router.push('/admin');
  };

  const handleDeleteOrg = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenDelete(true);
  };
  const { mutateAsync: deleteOrg, isPending: isDeleting } = useApiMutation<
    null,
    { id: string }
  >('DELETE', ({ id }) => `/org/${id}`, {
    onSuccess: (_, { id }) => {
      const orgs = useAuthStore.getState().organisations;
      const filtered = orgs.filter((org) => org.id !== id);
      setOrganisations(filtered);

      toast.success('Organisation supprimée avec succès');
      const activeOrg = useAuthStore.getState().organisationActive;
      if (activeOrg?.id === id) {
        useAuthStore.getState().setOrganisationActive(null);
      }
    },
    onError: (error) => {
      const status = error?.status;
      const message = error?.message;

      if (status === 401) {
        toast.error(error.message || "Vous n'êtes pas authentifié.");
      } else if (status === 403) {
        toast.error(
          error.message || "Accès refusé : vous n'avez pas les droits."
        );
      } else if (status === 404) {
        toast.error(error.message || 'Organisation introuvable.');
      } else {
        toast.error(message || 'Une erreur inconnue est survenue.');
      }
    },
  });

  const renderOrgCard = (
    org: (typeof organisations)[number],
    roleText: string
  ) => (
    <>
      <Card key={org.id}>
        <CardHeader>
          <CardTitle>{org.nom}</CardTitle>
          <CardDescription>{org.domain}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className='text-sm leading-5'>
            Vous êtes membre de l&apos;organisation <strong>{org.nom}</strong>{' '}
            et vous occupez le rôle {roleText}.
          </span>
        </CardContent>
        <CardFooter className='justify-between'>
          <span className='text-sm'>
            Créée &bull;{' '}
            <span className='text-gray-500'>
              {formatDistance(new Date(org.createAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setOrganisationToEdit(org);
                  setOpenEdit(true);
                }}
              >
                Éditer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setOrgInfo(org);
                  setShowOrgInfo(true);
                }}
              >
                Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteOrg;
                  setOrganisationToDelete(org);
                  setOpenDelete(true);
                }}
              >
                Supprimer
              </DropdownMenuItem>

              <DropdownMenuItem
                className={`${
                  actifOrg?.id === org.id &&
                  'bg-green-500 hover:bg-green-700 text-white'
                }`}
                onClick={handlerSetActiveOrg(org)}
              >
                {actifOrg?.id === org.id ? (
                  <>
                    <CheckCheck className='w-4 h-4 text-white mr-2' />
                    Organisation active
                  </>
                ) : (
                  'Activer'
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </>
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='animate-spin w-6 h-6 text-gray-600' />
      </div>
    );
  }

  if (organisations.length === 0) {
    return (
      <div className='flex items-center flex-col pt-20 gap-4'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Aucune organisation trouvée
        </h1>
        <p className='text-base text-gray-500'>
          Vous n&apos;avez encore rejoint ou créé aucune entreprise.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col pb-8'>
      {/* ADMIN */}
      <section className='flex flex-col gap-2 py-10'>
        <h4 className='font-medium text-gray-500'>Mes entreprises</h4>
        {orgAdmin.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {orgAdmin.map((org) => renderOrgCard(org, 'd’administrateur'))}
          </div>
        ) : (
          <div className='flex items-center flex-col pt-10 gap-2'>
            <h1 className='text-xl font-semibold text-gray-800'>
              Aucune entreprise créée
            </h1>
            <p className='text-sm text-gray-500'>
              Créez une entreprise pour commencer à gérer vos équipes.
            </p>
          </div>
        )}
      </section>

      {/* EMPLOYÉ */}
      <section className='flex flex-col gap-2'>
        <h4 className='font-medium text-gray-500'>
          Entreprises auxquelles je participe
        </h4>
        {orgEmploye.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {orgEmploye.map((org) => renderOrgCard(org, 'd’employé'))}
          </div>
        ) : (
          <div className='flex items-center flex-col pt-10 gap-2'>
            <h1 className='text-xl font-semibold text-gray-800'>
              Aucune entreprise rejointe
            </h1>
            <p className='text-sm text-gray-500'>
              Vous n’avez encore rejoint aucune entreprise.
            </p>
          </div>
        )}
      </section>
      {/* MODAL POUR EDITER UNE ORGANISATION */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <form>
          <DialogContent className='sm:max-w-[625px]'>
            <DialogHeader>
              <DialogTitle>Modifier l&apos;organisation</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l&apos;organisation. Cliquez sur
                "Enregistrer" pour valider.
              </DialogDescription>
            </DialogHeader>
            <form className='grid md:grid-cols-2 gap-4'>
              <div className='grid gap-3'>
                <Label htmlFor='org-nom'>Nom</Label>
                <Input id='org-nom' defaultValue={organisationToEdit?.nom} />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='org-domain'>Domaine</Label>
                <Input
                  id='org-domain'
                  defaultValue={organisationToEdit?.domain}
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='org-email'>Address Email</Label>
                <Input
                  id='org-email'
                  defaultValue={organisationToEdit?.email}
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='org-address'>
                  Adresse de l&apos;entreprise
                </Label>
                <Input
                  id='org-address'
                  defaultValue={organisationToEdit?.adresse || ''}
                />
              </div>
              <div className='grid gap-3 md:col-span-2'>
                <Label htmlFor='org-nbEmployes'>Nombre d&apos;employés</Label>
                <Input
                  id='org-address'
                  defaultValue={organisationToEdit?.nbreEmployes || ''}
                />
              </div>
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Annuler
                </Button>
              </DialogClose>
              <Button type='submit'>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* ALERT MODAL POUR SUPPRIMER UNE ORGANISATION */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette organisation ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et entraînera la suppression
              définitive de toutes les données associées à cette organisation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDelete(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (organisationToDelete) {
                  toast.promise(deleteOrg({ id: organisationToDelete.id }), {
                    loading: 'Suppression en cours...',
                    error: (err) =>
                      err?.response?.data?.message || 'Échec de la suppression',
                  });
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL POUR AFFICHER LES DETAILS D'UNE ORGANISATION */}
      <Dialog open={showOrgInfo} onOpenChange={setShowOrgInfo}>
        <DialogContent className='sm:max-w-[525px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              Informations de l&apos;organisation{' '}
              <span className='text-md font-semibold'>{orgInfo?.nom}</span>
            </DialogTitle>
            <DialogDescription>
              Visualiser les détails de l&apos;organisation.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Informations principales */}
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Building2 className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Nom</h4>
                </div>
                <span className='text-sm pl-6'>{orgInfo?.nom}</span>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Globe className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Domaine</h4>
                </div>
                <span className='text-sm pl-6'>{orgInfo?.domain}</span>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Email</h4>
                </div>
                <span className='text-sm pl-6'>{orgInfo?.email}</span>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Shield className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Rôle</h4>
                </div>
                <span className='text-sm pl-6'>{orgInfo?.role}</span>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
              {orgInfo?.adresse && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <h4 className='font-medium'>Adresse</h4>
                  </div>
                  <span className='text-sm pl-6'>{orgInfo.adresse}</span>
                </div>
              )}

              {orgInfo?.nbreEmployes && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <h4 className='font-medium'>Nombre d'employés</h4>
                  </div>
                  <span className='text-sm pl-6'>{orgInfo.nbreEmployes}</span>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Date de création</h4>
                </div>
                <span className='text-sm pl-6'>
                  {orgInfo?.createAt &&
                    format(orgInfo?.createAt, 'dd/MM/yyyy', { locale: fr })}
                </span>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Date d'adhésion</h4>
                </div>
                <span className='text-sm pl-6'>
                  {orgInfo?.joinedAt &&
                    format(orgInfo?.joinedAt, 'dd/MM/yyyy', { locale: fr })}
                </span>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <h4 className='font-medium'>Dernière mise à jour</h4>
                </div>
                <span className='text-sm pl-6'>
                  {orgInfo?.updatedAt &&
                    format(orgInfo?.updatedAt, 'dd/MM/yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrganisationsList;
