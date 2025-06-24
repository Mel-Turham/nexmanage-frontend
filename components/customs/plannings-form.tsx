'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import GabaritSList from './gabarit-list';
import Commantaires from './commantaires';
import { AddCircleIcon } from 'hugeicons-react';

import { Dialog, DialogContent } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import ContractForm from './contract-form';

// Ajout des props pour contrôler la modal depuis l'extérieur
interface PlanningFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showButton?: boolean; // Pour contrôler si on affiche le bouton ou pas
}

const PlanningForm: React.FC<PlanningFormProps> = ({
  open = false,
  onOpenChange,
  showButton = true,
}) => {
  // État local uniquement si pas contrôlé de l'extérieur
  const [internalOpen, setInternalOpen] = React.useState<boolean>(false);

  // Utiliser l'état externe si fourni, sinon l'état interne
  const isOpen = onOpenChange ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <div className='relative'>
      {showButton && (
        <button
          type='submit'
          className='flex flex-row w-fit custom-button-gradient py-2 px-4 rounded-lg gap-2'
          onClick={() => setIsOpen(true)}
        >
          <AddCircleIcon />
          {'Créer'}
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[800px]'>
          <Tabs defaultValue='contrat' className='w-full'>
            <TabsList className='h-auto rounded-none border-b bg-transparent p-0 w-full'>
              <TabsTrigger
                value='contrat'
                className='data-[state=active]:after:bg-red-400 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                Contrat
              </TabsTrigger>
              <TabsTrigger
                value='gabarit'
                className='data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                Gabarit
              </TabsTrigger>

              <TabsTrigger
                value='Commentaires'
                className='data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                Commentaires
              </TabsTrigger>
            </TabsList>

            <TabsContent value='contrat'>
              <ScrollArea className='h-[400px]'>
                <ContractForm />
              </ScrollArea>
            </TabsContent>
            <TabsContent value='gabarit'>
              <ScrollArea className='h-[400px]'>
                <GabaritSList />
              </ScrollArea>
            </TabsContent>

            <TabsContent value='Commentaires'>
              <Commantaires />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanningForm;
