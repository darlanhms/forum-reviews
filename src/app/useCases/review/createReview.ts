import { TRPCError } from '@trpc/server';
import { v4 as uuid } from 'uuid';
import { CreateReviewRequest } from 'app/controllers/review.controller';
import Review from 'app/entities/Review';
import RestaurantRepository from 'app/repositories/RestaurantRepository';
import ReviewRepository from 'app/repositories/ReviewRepository';
import CalculateReviewAverageRatingUseCase from './calculateReviewAverageRating';
import UpdateRestaurantReviewPropsUseCase from './updateRestaurantReviewProps';

export default class CreateReviewUseCase {
  reviewRepo = new ReviewRepository();

  restaurantRepo = new RestaurantRepository();

  calculateAverage = new CalculateReviewAverageRatingUseCase();

  updateRestaurantReviewProps = new UpdateRestaurantReviewPropsUseCase();

  async execute(request: CreateReviewRequest): Promise<Review> {
    const { serviceRating, priceRating, packageRating, productRating, waitTimeRating, restaurantId, member } =
      request;

    const restaurantReviews = await this.reviewRepo.getAll(restaurantId);

    const alreadyReviewed = restaurantReviews.find(review => review.member === member);

    if (alreadyReviewed) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Não é possível fazer duas reviews no mesmo estabelecimento',
      });
    }

    const averageRating = this.calculateAverage.execute({
      serviceRating,
      packageRating,
      priceRating,
      productRating,
      waitTimeRating,
    });

    const review: Review = {
      ...request,
      id: uuid(),
      averageRating,
    };

    await this.updateRestaurantReviewProps.execute({
      restaurantId,
      reviews: [...restaurantReviews, review],
    });

    return this.reviewRepo.save(review);
  }
}
