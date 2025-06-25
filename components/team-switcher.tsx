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
import { MyCompaniesRespose, MyEntreprise } from '@/types';
import { Skeleton } from './ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveCompany } from '@/hooks/use-active-company';

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();
  const {
    activeCompany,
    switchCompany,
    isLoading: isSwitching,
  } = useActiveCompany();

  // States
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit] = React.useState(4);
  const [openCreateEntrepriseDialog, setOpenCreateEntrepriseDialog] =
    React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Query pour récupérer les entreprises avec pagination et recherche
  const {
    data: companiesResponse,
    isLoading: isLoadingCompanies,
    refetch,
  } = useApiQuery<MyCompaniesRespose>(
    ['entreprises', String(currentPage), String(limit), searchTerm],
    '/entreprises/my-companies',
    {
      page: currentPage,
      limit: limit,
      search: searchTerm || undefined,
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const companies = companiesResponse?.data || [];
  const pagination = companiesResponse?.pagination;

  // Form pour créer une entreprise
  const form = useForm<CreateEntrepriseSchema>({
    resolver: zodResolver(createEntrepriseSchema),
    defaultValues: {
      nom: '',
      domaine: '',
      email: '',
      adresse: '',
      nbre_employers: 0,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Mutation pour créer une entreprise
  const createEntrepriseMutation = useApiMutation<
    unknown,
    CreateEntrepriseSchema
  >('POST', '/entreprises', {
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

  // Définir l'entreprise active par défaut si aucune n'est sélectionnée
  React.useEffect(() => {
    if (companies.length > 0 && !activeCompany) {
      const firstCompany = companies[0];
      switchCompany(firstCompany);
    }
  }, [companies, activeCompany, switchCompany]);

  // Gérer le changement d'entreprise
  const handleTeamSwitch = async (team: MyEntreprise) => {
    if (team.id === activeCompany?.id) return;

    try {
      await switchCompany(team);
      setIsDropdownOpen(false);
      toast.success(`Basculé vers ${team.nom}`, {
        duration: 2000,
      });
    } catch (error) {
      console.error('Error switching company:', error);
      toast.error("Erreur lors du changement d'entreprise");
    }
  };

  // Gérer la création d'entreprise
  const handleCreateEntreprise = () => {
    setOpenCreateEntrepriseDialog(true);
  };

  const onSubmit = async (data: CreateEntrepriseSchema) => {
    const loadingId = toast.loading("Création de l'entreprise en cours...");
    try {
      await createEntrepriseMutation.mutateAsync({
        ...data,
        nbre_employers: Number(data.nbre_employers),
      });
      console.log('Entreprise created:', data);
    } catch (error) {
      console.error('Error creating entreprise:', error);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  // Gérer la recherche avec debounce
  const debouncedSearch = React.useMemo(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1); // Reset à la première page lors de la recherche
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  React.useEffect(() => {
    return debouncedSearch;
  }, [debouncedSearch]);

  // Gérer le changement de page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (!activeCompany && isLoadingCompanies) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton className='w-full h-[60px] bg-gray-200 rounded-lg' />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeCompany) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                disabled={isSwitching}
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
                    {isSwitching ? 'Changement...' : activeCompany.nom}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {activeCompany.domaine}
                  </span>
                </div>
                <ChevronsUpDown
                  className={`ml-auto transition-transform ${
                    isSwitching ? 'animate-spin' : ''
                  }`}
                />
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

              {/* Barre de recherche */}
              <div className='relative mb-2'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                  placeholder='Rechercher une entreprise...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 h-8'
                />
              </div>

              {/* Loading state */}
              {isLoadingCompanies ? (
                <div className='space-y-1'>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className='h-8 w-full' />
                  ))}
                </div>
              ) : (
                <>
                  {/* Liste des entreprises */}
                  {companies.length > 0 ? (
                    <div className='max-h-60 overflow-y-auto'>
                      {companies.map((team) => (
                        <DropdownMenuItem
                          key={team.id}
                          onClick={() => handleTeamSwitch(team)}
                          className={`gap-2 p-2 cursor-pointer ${
                            activeCompany.id === team.id ? 'bg-accent' : ''
                          }`}
                          disabled={isSwitching}
                        >
                          <div className='flex flex-col'>
                            <span className='font-medium'>{team.nom}</span>
                            <span className='text-xs text-muted-foreground'>
                              {team.domaine} • {team.totalUsers} utilisateur
                              {team.totalUsers > 1 ? 's' : ''}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-4 text-muted-foreground'>
                      {searchTerm
                        ? 'Aucune entreprise trouvée'
                        : 'Aucune entreprise disponible'}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className='flex items-center justify-between mt-2 px-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoadingCompanies}
                      >
                        Précédent
                      </Button>
                      <span className='text-xs text-muted-foreground'>
                        {currentPage} / {pagination.totalPages}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage === pagination.totalPages ||
                          isLoadingCompanies
                        }
                      >
                        Suivant
                      </Button>
                    </div>
                  )}
                </>
              )}

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
                name='domaine'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domaine de l&apos;entreprise</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder="Domaine de l'entreprise"
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
                name='nbre_employers'
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
