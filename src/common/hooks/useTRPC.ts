import { createReactQueryHooks } from '@trpc/react';
import { AppRouter } from 'app/router';

let trpc: ReturnType<typeof createReactQueryHooks<AppRouter>>;
export const useTRPC = (): typeof trpc => {
  if (!trpc) {
    trpc = createReactQueryHooks<AppRouter>();
  }
  return trpc;
};
