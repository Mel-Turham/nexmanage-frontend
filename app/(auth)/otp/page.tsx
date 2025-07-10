import OtpForm from '@/components/customs/otp-form';
import React, { Suspense } from 'react';

const OTPPages = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpForm />
    </Suspense>
  );
};

export default OTPPages;
