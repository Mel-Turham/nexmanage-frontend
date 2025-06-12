import { ErrorWithStatus } from '@/types/api.types';
import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes pour les queries
    gcTime: 10 * 60 * 1000,

    retry: (failureCount, error: unknown) => {
      const errorWithStatus = error as ErrorWithStatus;

      if (
        errorWithStatus?.status &&
        errorWithStatus.status >= 400 &&
        errorWithStatus.status < 500
      ) {
        return false;
      }
      return failureCount < 3;
    },
  },
  mutations: {
    retry: 1,
    retryDelay: 1000, // ceci permet de délai de 1 seconde entre chaque tentative de réessayer le mutation.
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
