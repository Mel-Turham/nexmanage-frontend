import CreateEntrepriseForm from '@/components/customs/create-entreprise-form';
import React, { Suspense } from 'react';
import Loading from '../laoding';

const CreateEntrePrisePage = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <CreateEntrepriseForm />
    </Suspense>
  );
};

export default CreateEntrePrisePage;
