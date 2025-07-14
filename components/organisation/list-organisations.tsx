'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
import { Ellipsis } from 'lucide-react';
import { Organisation, UserRole } from '@/types';
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/navigation';

function OrganisationsList() {
  const organisations = useAuthStore((state) => state.organisations);
  const router = useRouter();

  const orgAdmin = organisations.filter((org) => org.role === UserRole.ADMIN);
  const orgEmploye = organisations.filter(
    (org) => org.role === UserRole.EMPLOYE
  );

  const handlerSetActiveOrg = (org: Organisation) => () => {
    useAuthStore.getState().setOrganisationActive(org);
    router.push('/admin');
  };

  const renderOrgCard = (
    org: (typeof organisations)[number],
    roleText: string
  ) => (
    <Card
      onClick={handlerSetActiveOrg(org)}
      className='cursor-pointer'
      key={org.id}
    >
      <CardHeader>
        <CardTitle>{org.nom}</CardTitle>
        <CardDescription>{org.domain}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className='text-sm leading-5'>
          Vous êtes membre de l’organisation <strong>{org.nom}</strong> et vous
          occupez le rôle {roleText}.
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
        <Button size='icon' variant='ghost'>
          <Ellipsis />
        </Button>
      </CardFooter>
    </Card>
  );

  // ✅ Aucune organisation
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
    </div>
  );
}

export default OrganisationsList;
