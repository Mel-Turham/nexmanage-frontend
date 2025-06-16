import CreateEntrepriseForm from '@/components/customs/create-entreprise-form';
import React, { Suspense } from 'react';

const CreateEntrePrisePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateEntrepriseForm />
    </Suspense>
  );
};

export default CreateEntrePrisePage;
