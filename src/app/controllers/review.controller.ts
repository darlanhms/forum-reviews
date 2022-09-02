import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import ReviewRepository from 'app/repositories/ReviewRepository';
import CreateReviewUseCase from 'app/useCases/review/createReview';
import DeleteReviewUseCase from 'app/useCases/review/deleteReview';
import UpdateReviewUseCase from 'app/useCases/review/updateReview';
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

const updateReviewRequest = z.object({
  id: z.string(),
  restaurantId: z.string(),
  serviceRating: z.number(),
  productRating: z.number(),
  priceRating: z.number(),
  packageRating: z.number(),
  waitTimeRating: z.number(),
  additionalInfo: z.string().optional(),
});

const deleteReviewRequest = z.object({
  id: z.string(),
  restaurantId: z.string(),
});

export type CreateReviewRequest = z.infer<typeof createReviewRequest>;

export type UpdateReviewRequest = z.infer<typeof updateReviewRequest>;

export type DeleteReviewRequest = z.infer<typeof deleteReviewRequest>;

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
      })
      .mutation('update', {
        input: updateReviewRequest,
        async resolve({ input }) {
          const review = await new UpdateReviewUseCase().execute(input);

          return review;
        },
      })
      .mutation('delete', {
        input: deleteReviewRequest,
        async resolve({ input }) {
          const review = await new DeleteReviewUseCase().execute(input);

          return review;
        },
      }),
  );
