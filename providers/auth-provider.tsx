'use client';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setOrganisations = useAuthStore((state) => state.setOrganisations);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedOut = useAuthStore((state) => state.isLoggedOut);

  const { data, isLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      const user = response.data.user.user;
      const organisations = response.data.user.organisations;
      setUser(user);
      setOrganisations(organisations);
      return response.data;
    },
    enabled: !!accessToken && !isLoggedOut,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setUser(data.user.user);
      setOrganisations(data.user.organisations);
    }
  }, [data, setUser, setOrganisations, isLoggedOut]);

  return <>{children}</>;
}
