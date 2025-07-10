'use client';

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

function OrganisationsList() {
  const organisations = useAuthStore((state) => state.organisations);
  console.log(organisations);

  // Si aucune organisation
  // if (organisations.length === 0) {
  //   return (
  //     <div className='flex items-center flex-col pt-20 gap-4'>
  //       <h1 className='text-4xl font-bold text-gray-900'>
  //         Aucune organisation trouvée
  //       </h1>
  //       <p className='text-base text-gray-500'>
  //         Commencez par créer votre entreprise
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className='flex flex-col pb-8'>
      <section className='flex flex-col gap-2 py-10'>
        <h4 className=' font-medium text-gray-500'>Mes Entreprises</h4>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 '>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className='flex flex-col gap-2'>
        <h4 className=' font-medium text-gray-500'>Autres entreprises {8} </h4>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 '>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>HES</CardTitle>
              <CardDescription>Développement informatique</CardDescription>
            </CardHeader>
            <CardContent>
              <span className='text-sm leading-5'>
                Vous êtes membre de l&apos;organisation HES et vous occupez le
                rôle d&apos;administrateur.
              </span>
            </CardContent>
            <CardFooter className='justify-between'>
              <span className='text-sm'>
                Créée le &bull;{' '}
                <span className='text-gray-500'>01/01/2023</span>
              </span>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default OrganisationsList;
