import loginController from './controllers/login.controller';
import { createRouter } from './utils/createRouter';

export const appRouter = createRouter().merge(loginController);

export type AppRouter = typeof appRouter;
