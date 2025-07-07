import { create } from 'zustand';
import { InvitationResponse } from '../types/index';
import { persist } from 'zustand/middleware';

interface InvitationResponseStore {
  user: InvitationResponse | null;
  setUser: (user: InvitationResponse) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<InvitationResponse>) => void;
}

export const useInvitationResponseStore = create<InvitationResponseStore>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user: InvitationResponse) => {
        set({ user });
      },

      clearUser: () => {
        set({ user: null });
      },

      updateUser: (updates: Partial<InvitationResponse>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'invitation-response-storage',
    }
  )
);
