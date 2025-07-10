import { useAuthStore } from '@/stores/auth-store';

export function getCurrentOrganisationById(orgId: string) {
  const { organisations } = useAuthStore.getState();
  return organisations.find((org) => org.id === orgId);
}
