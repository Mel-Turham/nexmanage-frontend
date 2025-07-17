import { BaseUser, Organisation } from '@/types/index';
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
  updateOrganisation: (org: Organisation) => void;
  setUserUpdate: (user: BaseUser) => void;
  setIsLoggedOut: (value: boolean) => void;

  isLoggedOut: boolean;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      organisations: [],
      organisationActive: null,
      isLoggedOut: false,
      setAccessToken: (token) =>
        set({
          accessToken: token,
          isLoggedOut: false,
        }),
      setUser: (user) => set({ user }),
      setOrganisations: (orgs) => set({ organisations: orgs }),
      setOrganisationActive: (org) => set({ organisationActive: org }),
      setIsLoggedOut: (value) => set({ isLoggedOut: value }),
      setUserUpdate: (user) => set({ user }),
      updateOrganisation: (org) =>
        set((state) => ({
          organisations: state.organisations.map((o) => (o.id === org.id ? org : o)),
          organisationActive:
            state.organisationActive?.id === org.id ? org : state.organisationActive,
        })),
      clearAuth: () => {
        set({
          accessToken: null,
          user: null,
          organisations: [],
          organisationActive: null,
          isLoggedOut: true,
        });

        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
