import EquipesList from '@/components/equipes/equipes-list';
import { InvitationDialogue } from '@/components/equipes/invitation-dialogue';
import React from 'react';

const Page = () => {
  return (
    <div className='p-4 space-y-4'>
      <InvitationDialogue />
      <EquipesList />
    </div>
  );
};

export default Page;
