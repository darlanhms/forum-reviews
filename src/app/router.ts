import loginController from './controllers/login.controller';
import { restaurantsController } from './controllers/restaurant.controller';
import { createRouter } from './utils/createRouter';

export const appRouter = createRouter().merge(loginController).merge('restaurant.', restaurantsController);

export type AppRouter = typeof appRouter;
