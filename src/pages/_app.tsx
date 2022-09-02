import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { withTRPC } from '@trpc/next';
import { AppRouter } from 'app/router';
import { AuthProvider } from 'common/hooks/useAuth';
import theme from 'common/styles/theme';

// eslint-disable-next-line import/no-mutable-exports
export const authInfo: { token: string | null } = {
  token: null,
};

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  useEffect(() => {
    authInfo.token = localStorage.getItem('auth');
  }, []);

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Forum reviews</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : process.env.NEXT_PUBLIC_API_URL
      ? `https://${process.env.NEXT_PUBLIC_API_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchInterval: false,
            refetchOnMount: false,
          },
        },
      },
      headers() {
        return {
          Authorization: authInfo.token || undefined,
        };
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  // ssr: true,
})(MyApp);
