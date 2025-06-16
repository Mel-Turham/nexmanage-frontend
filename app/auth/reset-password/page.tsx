import ResetPasswordForm from '@/components/customs/reset-password-form';
import React, { Suspense } from 'react';

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
