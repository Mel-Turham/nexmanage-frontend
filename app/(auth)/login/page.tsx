import Loading from '@/app/laoding';
import LoginForm from '@/components/customs/login-form';
import React, { Suspense } from 'react';

const LoginPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
