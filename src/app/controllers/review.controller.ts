import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import ReviewRepository from 'app/repositories/ReviewRepository';
import CreateReviewUseCase from 'app/useCases/review/createReview';
import { createRouter } from 'app/utils/createRouter';

const createReviewRequest = z.object({
  member: z.string(),
  restaurantId: z.string(),
  serviceRating: z.number(),
  productRating: z.number(),
  priceRating: z.number(),
  packageRating: z.number(),
  waitTimeRating: z.number(),
  additionalInfo: z.string().optional(),
});

export type CreateReviewRequest = z.infer<typeof createReviewRequest>;

export const reviewsController = createRouter()
  .query('getByRestaurant', {
    input: z.string(),
    async resolve({ input }) {
      return new ReviewRepository().getAll(input);
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
        input: createReviewRequest,
        async resolve({ input }) {
          const review = await new CreateReviewUseCase().execute(input);

          return review;
        },
      }),
  );
