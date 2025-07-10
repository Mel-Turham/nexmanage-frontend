import ForgotPasswordForm from '@/components/customs/forgot-password-form';
import React, { Suspense } from 'react';

const ForgetPassWordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
};

export default ForgetPassWordPage;
