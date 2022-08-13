import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { authContext } from './contexts/authContext';

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const authData = await authContext(ctx);

  return {
    ...authData,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
