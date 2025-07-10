'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

import { UserRole } from '@/types';

interface Props {
  children: React.ReactNode;
  orgId: string;
}

export function RoleProtectedPage({ children, orgId }: Props) {
  const { accessToken, user, organisations } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken || !user) {
      router.replace('/login');
    }

    const org = organisations.find((org) => org.id === orgId);
    if (!org) {
      router.replace('organisations');
      return;
    }

    const role = org.role;
    const isAdminRoute = pathname.startsWith('/admin');
    const isEmployeeRoute = pathname.startsWith('/employe');

    // l'employé ne peut pas acceder aux routes de l'admin
    if (role === UserRole.EMPLOYE && isAdminRoute) {
      router.replace('/employe');
      return;
    }
    // l'admin ne peut pas acceder aux routes de l'employé
    if (role === UserRole.ADMIN && isEmployeeRoute) {
      router.replace('/admin');
      return;
    }

    // si la route ne correspond pas au role

    if (
      (role === UserRole.EMPLOYE && !isEmployeeRoute) ||
      (role === UserRole.ADMIN && !isAdminRoute)
    ) {
      router.back();
      return;
    }
  }, [accessToken, pathname, organisations, user, orgId]);

  return <>{children}</>;
}
