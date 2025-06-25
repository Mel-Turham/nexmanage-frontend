'use client';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from './team-switcher';
import {
  Analytics02Icon,
  Calendar02Icon,
  CursorPointer02Icon,
  Home01Icon,
  Message01Icon,
  Settings02Icon,
  UserListIcon,
  WorkHistoryIcon,
} from 'hugeicons-react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { useActiveCompany } from '@/hooks/use-active-company';

const data = {
  navMain: [
    {
      title: 'Menu principal',
      url: '#',
      items: [
        { title: 'Accueil', icon: Home01Icon, url: '/admin' },
        { title: 'Planning', icon: Calendar02Icon, url: '/admin/planning' },
        { title: 'Congés', icon: WorkHistoryIcon, url: '/admin/conges' },
      ],
    },
    {
      title: 'Menu Secondaire',
      url: '#',
      items: [
        {
          title: 'Pointages',
          icon: CursorPointer02Icon,
          url: '/admin/pointages',
        },
        {
          title: 'Ressources Humaines',
          icon: UserListIcon,
          url: '/admin/employer',
        },
        { title: 'Messages', icon: Message01Icon, url: '/admin/message' },
      ],
    },
    {
      title: 'Aide et Analyse',
      url: '#',
      items: [
        { title: 'Rapports', icon: Analytics02Icon, url: '/admin/rapports' },
        { title: 'Paramètres', icon: Settings02Icon, url: '/admin/parametres' },
      ],
    },
  ],
};

const NavigationSkeleton = () => (
  <>
    {data.navMain.map((group, groupIndex) => (
      <SidebarGroup key={`skeleton-${groupIndex}`}>
        <SidebarGroupLabel>
          <Skeleton className='h-4 w-24 bg-gray-200' />
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((_, itemIndex) => (
              <SidebarMenuItem key={`skeleton-item-${itemIndex}`}>
                <div className='flex items-center space-x-2 px-2 py-3'>
                  <Skeleton className='h-6 w-6 bg-gray-200 rounded' />
                  <Skeleton className='h-4 w-20 bg-gray-200' />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ))}
  </>
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { activeCompany, isLoading } = useActiveCompany();

  if (isLoading) {
    return <NavigationSkeleton />;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`${item.url}${
                            activeCompany ? `?company=${activeCompany.id}` : ''
                          }`}
                          className={`flex items-center space-x-2 rounded-none px-2 py-3 h-fit transition-all duration-200 ${
                            isActive
                              ? 'border-l-4 border-Primaire text-Primaire font-semibold bg-bleu-ciel'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-Primaire'
                          }`}
                        >
                          {Icon && (
                            <Icon
                              size={24}
                              color={isActive ? '#344EA2' : '#142938'}
                              className='transition-colors duration-200'
                            />
                          )}
                          <span className='transition-colors duration-200'>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Section footer avec informations contextuelles */}
        {activeCompany && !isLoading && (
          <div className='mt-auto p-4 border-t'>
            <div className='text-xs text-muted-foreground mb-2'>
              Informations entreprise
            </div>
            <div className='space-y-1 text-xs'>
              <div className='flex justify-between'>
                <span>Domaine:</span>
                <span className='font-medium'>{activeCompany.domaine}</span>
              </div>
              <div className='flex justify-between'>
                <span>Employés:</span>
                <span className='font-medium'>
                  {activeCompany.nbre_employers}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Créée le:</span>
                <span className='font-medium'>
                  {new Date(activeCompany.dateCreation).toLocaleDateString(
                    'fr-FR'
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export { Sidebar };
