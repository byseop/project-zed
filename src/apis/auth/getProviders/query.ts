import { useQuery } from '@tanstack/react-query';
import { getProviders } from '.';

export const useGetProvidersQueryKey = {
  getProviders: ['getProviders']
} as const;

export const useGetProvidersQuery = () => {
  return useQuery({
    queryKey: useGetProvidersQueryKey.getProviders,
    queryFn: getProviders,
    enabled: true
  });
};
