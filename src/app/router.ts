import loginController from './controllers/login.controller';
import { restaurantsController } from './controllers/restaurant.controller';
import { reviewsController } from './controllers/review.controller';
import { createRouter } from './utils/createRouter';

export const appRouter = createRouter()
  .merge(loginController)
  .merge('restaurant.', restaurantsController)
  .merge('review.', reviewsController);

export type AppRouter = typeof appRouter;
