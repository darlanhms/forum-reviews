import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from 'app/context';
import { appRouter } from 'app/router';

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
