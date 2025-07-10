'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (accessToken && user) {
      router.replace('/organisations');
    }
  }, [accessToken, user]);

  return <>{children}</>;
}
