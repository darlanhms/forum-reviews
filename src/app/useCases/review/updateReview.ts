import { TRPCError } from '@trpc/server';
import { UpdateReviewRequest } from 'app/controllers/review.controller';
import Review from 'app/entities/Review';
import RestaurantRepository from 'app/repositories/RestaurantRepository';
import ReviewRepository from 'app/repositories/ReviewRepository';
import CalculateReviewAverageRatingUseCase from './calculateReviewAverageRating';
import UpdateRestaurantReviewPropsUseCase from './updateRestaurantReviewProps';

export default class UpdateReviewUseCase {
  reviewRepo = new ReviewRepository();

  restaurantRepo = new RestaurantRepository();

  calculateAverage = new CalculateReviewAverageRatingUseCase();

  updateRestaurantReviewProps = new UpdateRestaurantReviewPropsUseCase();

  async execute(request: UpdateReviewRequest): Promise<Review> {
    const { serviceRating, priceRating, packageRating, productRating, waitTimeRating, restaurantId, id } =
      request;

    const restaurantReviews = await this.reviewRepo.getAll(restaurantId);

    const alreadyReviewed = restaurantReviews.find(review => review.id === id);

    if (!alreadyReviewed) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Não foi possível encontrar o review para atualizar',
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
      ...alreadyReviewed,
      ...request,
      averageRating,
    };

    const newRestaurantReviews = restaurantReviews.map(restaurantReview => {
      if (restaurantReview.id === id) {
        return review;
      }
      return restaurantReview;
    });

    await this.updateRestaurantReviewProps.execute({
      restaurantId,
      reviews: newRestaurantReviews,
    });

    return this.reviewRepo.save(review);
  }
}
