'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { request } from '~/lib/utils/http/request';
import { generateUrl, type UrlParamsType } from '~/lib/utils/http/uri';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('4')) {
            return false;
          }

          return failureCount < 2;
        },
        queryFn: async ({ queryKey, signal }) => {
          const [context, params, withAuth] = queryKey as [
            string,
            UrlParamsType | undefined,
            boolean | undefined,
          ];

          return await request(generateUrl(context, params), {
            signal,
            withAuth: typeof withAuth === 'boolean' ? withAuth : true,
          });
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}

export function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
