'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

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
import { Input } from './ui/input';
import { useApiMutation } from '@/hooks/apis/use-api';
import { toast } from 'sonner';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
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
  const [openCreateEntrepriseDialog, setOpenCreateEntrepriseDialog] =
    React.useState(false);
  const createEntrepriseMutation = useApiMutation<
    unknown,
    CreateEntrepriseSchema
  >('POST', '/entreprises', {
    onSuccess: (data) => {
      console.log('Entreprise created successfully:', data);
      setOpenCreateEntrepriseDialog(false);
      form.reset();
      toast.success('Entreprise créée avec succès');
    },

    onError: (error) => {
      console.error('Error creating entreprise:', error);
      toast.error(
        error.message || "Erreur lors de la création de l'entreprise"
      );
    },
  });
  if (!activeTeam) {
    return null;
  }

  const handlerCreateEntreprise = () => {
    setOpenCreateEntrepriseDialog(true);
  };

  const onSubmit = async (data: CreateEntrepriseSchema) => {
    const loadingId = toast.loading("Création de l'entreprise en cours...");
    try {
      await createEntrepriseMutation.mutateAsync({
        ...data,
        nbre_employers: Number(data.nbre_employers),
      });

      toast.dismiss(loadingId);
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
          <DropdownMenu>
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
                    {activeTeam.name}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              align='start'
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                Entreprise
              </DropdownMenuLabel>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className='gap-2 p-2'
                >
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='gap-2 p-2'
                onClick={handlerCreateEntreprise}
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

              {/* Boutons déplacés DANS le formulaire */}
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
