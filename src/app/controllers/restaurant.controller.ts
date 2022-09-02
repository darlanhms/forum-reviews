import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { waysToOrder } from 'app/entities/Restaurant';
import RestaurantRepository from 'app/repositories/RestaurantRepository';
import CreateRestaurantUseCase from 'app/useCases/restaurant/createRestaurant';
import { createRouter } from 'app/utils/createRouter';

const createRestaurantRequest = z.object({
  name: z.string().min(1),
  wayToOrder: z.array(z.enum(waysToOrder)),
});

export type CreateRestaurantRequest = z.infer<typeof createRestaurantRequest>;

export const restaurantsController = createRouter()
  .query('getAll', {
    async resolve() {
      return new RestaurantRepository().getAll();
    },
  })
  .query('getOne', {
    input: z.string(),
    async resolve({ input }) {
      const restaurants = await new RestaurantRepository().getAll();

      return restaurants.find(({ id }) => id === input);
    },
  })
  .merge(
    createRouter()
      .middleware(({ ctx, next }) => {
        if (!ctx.member) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        return next();
      })
      .mutation('create', {
        input: createRestaurantRequest,
        async resolve({ input }) {
          return new CreateRestaurantUseCase().execute(input);
        },
      }),
  );
