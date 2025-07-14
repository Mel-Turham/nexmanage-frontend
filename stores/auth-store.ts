import { BaseUser, Organisation, User } from '@/types/index';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  accessToken: string | null;
  user: BaseUser | null;
  organisations: Organisation[];
  organisationActive: Organisation | null;
  setAccessToken: (token: string | null) => void;
  setOrganisations: (orgs: Organisation[]) => void;
  setUser: (user: BaseUser | null) => void;
  setOrganisationActive: (org: Organisation | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      organisations: [],
      organisationActive: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      setOrganisations: (orgs) => set({ organisations: orgs }),
      setOrganisationActive: (org) => set({ organisationActive: org }),
      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          organisations: [],
          organisationActive: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
