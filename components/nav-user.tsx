'use client';

import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth-store';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useApiMutation } from '@/hooks/apis/use-api';

export function NavUser() {
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
      localStorage.clear();
      router.push('/login');
    } catch (error) {
      console.log(error);
      toast.error('Une erreur est survenue lors de la deconnexion');
    }
  };

  return (
    <SidebarMenu className='contents'>
      <SidebarMenuItem className='w-fit'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-fit'
            >
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
            </SidebarMenuButton>
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
