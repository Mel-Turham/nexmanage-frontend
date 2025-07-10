'use client';

import Loading from '@/app/laoding';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setOrganisations = useAuthStore((state) => state.setOrganisations);

  const { isLoading } = useQuery<User, unknown>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      console.log('Me response', response.data.user);
      setUser(response.data.user.user);
      setOrganisations(response.data.user.organisations);

      return response.data.user;
    },
    enabled: !!accessToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
