'use client';
import { queryClient } from '@/lib/react-query/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function ProviderQueryClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        initialIsOpen={process.env.NODE_ENV === 'development'}
      />
      {children}
    </QueryClientProvider>
  );
}
