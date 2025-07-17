'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NextManageIcon from '@/icons/logo';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import CreateOrganisation from '@/components/organisation/create-organisation';
import OrganisationsList from '@/components/organisation/list-organisations';
import { useAuthStore } from '@/stores/auth-store';
import { useApiMutation } from '@/hooks/apis/use-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function OrganisationsPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { mutateAsync, isPending } = useApiMutation('POST', '/auth/logout');

  const handlerLogout = async () => {
    try {
      await mutateAsync(undefined);
      clearAuth();
      toast.success('Deconnexion effectuer avec success', {
        duration: 4000,
      });
      router.push('/login');
    } catch (error) {
      console.log(error);
      toast.error('Une erreur est survenue lors de la deconnexion');
    }
  };
  return (
    <div className='min-h-svh flex flex-col px-6 pt-32 relative bg-white'>
      <header className='flex items-center justify-between bg-white shadow-sm border border-gray-300/25 px-4 py-2 fixed top-0 left-0 w-full'>
        <NextManageIcon className=' w-sm' />
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-2'>
            <Avatar className='h-8 w-8 rounded-lg '>
              <AvatarImage />
              <AvatarFallback className='rounded-lg'>
                {user?.nom?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{user?.nom}</span>
              <span className='truncate text-xs'>{user?.email}</span>
            </div>
            <ChevronsUpDown className='size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={'bottom'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage />
                  <AvatarFallback className='rounded-lg'>
                    {user?.nom?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user?.nom}</span>
                  <span className='truncate text-xs'>{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/admin/profile'>
                <User className='mr-2 h-4 w-4' />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/admin/parametres'>
                <Settings className='mr-2 h-4 w-4' />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handlerLogout}>
              {isPending ? (
                'Deconnexion...'
              ) : (
                <>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Deconnexion</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-black/70'>
            Mes Organisations
          </h1>
          <p className='text-base mt-2 tracking-tighter text-gray-500'>
            Gérez et suivez tous vos projets en cours
          </p>
        </div>
        <CreateOrganisation />
      </div>
      <OrganisationsList />
    </div>
  );
}

export default OrganisationsPage;
