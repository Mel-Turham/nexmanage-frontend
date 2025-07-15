'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import {
  createEntrepriseSchema,
  CreateEntrepriseSchema,
} from '@/schemas/create-entreprise-schemas/create-entreprise.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiMutation, useApiQuery } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
import { Organisation } from '@/types';

import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { Badge } from './ui/badge';

export function TeamSwitcher() {
  const activeOrg = useAuthStore((state) => state.organisationActive);
  const setActiveOrg = useAuthStore((state) => state.setOrganisationActive);
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();

  // States

  const [openCreateEntrepriseDialog, setOpenCreateEntrepriseDialog] =
    React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Query pour récupérer les entreprises avec pagination et recherche
  const {
    data,
    isLoading: isLoadingCompanies,
    refetch,
  } = useApiQuery<{ success: boolean; organisations: Organisation[] }>(
    ['organisations'],
    '/org/',
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const { organisations } = data ?? {
    success: false,
    organisations: [],
  };

  // Form pour créer une entreprise
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

  const {
    formState: { isSubmitting },
  } = form;

  // Mutation pour créer une entreprise
  const createEntrepriseMutation = useApiMutation<
    unknown,
    CreateEntrepriseSchema
  >('POST', '/org/create', {
    onSuccess: (data) => {
      console.log('Entreprise created successfully:', data);
      setOpenCreateEntrepriseDialog(false);
      form.reset();
      toast.success('Entreprise créée avec succès');
      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: ['entreprises'] });
      refetch();
    },
    onError: (error) => {
      console.error('Error creating entreprise:', error);
      toast.error(
        error.message || "Erreur lors de la création de l'entreprise"
      );
    },
  });

  // Gérer le changement d'entreprise
  const handleTeamSwitch = async (team: Organisation) => {
    setActiveOrg(team);
  };

  // Gérer la création d'entreprise
  const handleCreateEntreprise = () => {
    setOpenCreateEntrepriseDialog(true);
  };

  React.useEffect(() => {
    // mettre la premire organisation actif si actifOrg est null
    if (!activeOrg) {
      setActiveOrg(organisations[0]);
    }
  }, [activeOrg, setActiveOrg]);

  const onSubmit = async (data: CreateEntrepriseSchema) => {
    const loadingId = toast.loading("Création de l'entreprise en cours...");
    try {
      await createEntrepriseMutation.mutateAsync({
        ...data,
        nbreEmployes: Number(data.nbreEmployes),
      });
      console.log('Entreprise created:', data);
    } catch (error) {
      console.error('Error creating entreprise:', error);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Image
                    src={'/svg/next-manage-logo.svg'}
                    alt={'next-manage-logo.svg'}
                    width={1000}
                    height={1000}
                  />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold text-lg'>
                    {activeOrg?.nom}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {activeOrg?.domain}
                  </span>
                </div>
                <ChevronsUpDown className={`ml-auto transition-transform`} />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-80 rounded-lg p-2'
              align='start'
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-muted-foreground text-xs px-2'>
                Mes Entreprises
              </DropdownMenuLabel>

              <div className='max-h-60 overflow-y-auto'>
                {organisations?.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleTeamSwitch(org)}
                    className={`gap-2 p-2 cursor-pointer ${
                      activeOrg?.id === org.id ? 'bg-accent shadow' : ''
                    }`}
                  >
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {org.nom} •{' '}
                        <Badge
                          className='text-xs capitalize'
                          variant={'outline'}
                        >
                         
                          {org.role}
                        </Badge>
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {org.domain} • {org.nbreEmployes} Participant
                        {org?.nbreEmployes && org?.nbreEmployes > 1 ? 's' : ''}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator />

              {/* Bouton pour créer une nouvelle entreprise */}
              <DropdownMenuItem
                className='gap-2 p-2 cursor-pointer'
                onClick={handleCreateEntreprise}
              >
                <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                  <Plus className='size-4' />
                </div>
                <div className='text-muted-foreground font-medium'>
                  Ajouter une Entreprise
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Dialog pour créer une entreprise */}
      <Dialog
        open={openCreateEntrepriseDialog}
        onOpenChange={setOpenCreateEntrepriseDialog}
      >
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
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
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    className='w-fit'
                    type='submit'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Création...' : 'Créer'}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
