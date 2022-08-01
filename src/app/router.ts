import * as trpc from '@trpc/server';
import { membersController } from 'app/controllers/members.controller';

export const appRouter = trpc.router().merge('members.', membersController);

export type AppRouter = typeof appRouter;
