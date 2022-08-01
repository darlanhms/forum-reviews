import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { withTRPC } from '@trpc/next';
import { AppRouter } from 'app/router';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <ChakraProvider>
      <Head>
        <title>Forum reviewer</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
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
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
