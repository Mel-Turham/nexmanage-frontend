import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ApiError } from '../../types/api.types';
import { api } from '@/lib/axios';

import { QueryParams } from '@/types/api.types';

// Hook générique pour les requêtes GET
export function useApiQuery<T>(
  key: string[],
  url: string,
  params?: QueryParams,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey: params ? [...key, params] : key,
    queryFn: async () => {
      const response: AxiosResponse<T> = await api.get(url, { params });
      return response.data;
    },
    ...options,
  });
}

// Hook générique pour les mutations

export function useApiMutation<TData, TVariables>(
  methode: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url;

      let response: AxiosResponse<TData>;

      switch (methode) {
        case 'POST':
          response = await api.post(endpoint, variables);
          break;
        case 'PUT':
          response = await api.put(endpoint, variables);
          break;
        case 'PATCH':
          response = await api.patch(endpoint, variables);
          break;
        case 'DELETE':
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Méthode HTTP non supportée: ${methode}`);
      }
      return response.data;
    },
    onSuccess: (data, variables, contexte) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, contexte);
    },
    ...options,
  });
}
