'use client';

import React, { useState } from 'react';
import CreateModal from './modals/create-contrat-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContratForm from './form-contrat';
import GabaritSList from './gabarit-list';
import Commantaires from './commantaires';

const PlanningForm = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='relative'>
      <button
        className='bg-[#344EA2] hover:bg-[#2a3d8f] text-white py-2 px-4 rounded transition-colors cursor-pointer'
        onClick={() => setOpen(true)}
      >
        Create
      </button>

      <CreateModal open={open} setOpen={setOpen}>
        <Tabs defaultValue='contrat' className='w-full'>
          <TabsList className='h-auto rounded-none border-b bg-transparent p-0 w-full'>
            <TabsTrigger
              value='contrat'
              className='data-[state=active]:after:bg-Primaire relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 data-[state=active]:text-Primaire after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
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
            <ContratForm />
          </TabsContent>
          <TabsContent value='gabarit'>
            <GabaritSList />
          </TabsContent>

          <TabsContent value='Commentaires'>
            <Commantaires />
          </TabsContent>
        </Tabs>
      </CreateModal>
    </div>
  );
};

export default PlanningForm;
