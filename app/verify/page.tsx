import React from 'react';
import VerifyClientPage from './verify-client';
import { redirect } from 'next/navigation';
async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const tokenRaw = await searchParams.then((params) => params.token);
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] ?? '' : tokenRaw ?? '';

  if (!token || token.trim() === '') {
    redirect('/auth/login?error=invalid_token');
  }

  if (token.length < 10) {
    redirect('/auth/login?error=invalid_token');
  }
  return (
    <div className='min-h-svh  flex items-center justify-center'>
      <VerifyClientPage token={token} />
    </div>
  );
}

export default VerifyPage;
