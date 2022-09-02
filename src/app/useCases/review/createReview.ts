import { TRPCError } from '@trpc/server';
import { v4 as uuid } from 'uuid';
import { CreateReviewRequest } from 'app/controllers/review.controller';
import Restaurant from 'app/entities/Restaurant';
import Review from 'app/entities/Review';
import RestaurantRepository from 'app/repositories/RestaurantRepository';
import ReviewRepository from 'app/repositories/ReviewRepository';

export default class CreateReviewUseCase {
  async execute(request: CreateReviewRequest): Promise<Review> {
    const { serviceRating, priceRating, packageRating, productRating, waitTimeRating, restaurantId, member } =
      request;

    const reviewRepo = new ReviewRepository();
    const restaurantRepo = new RestaurantRepository();

    const restaurant = await restaurantRepo.findById(restaurantId);

    if (!restaurant) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Restaurante da review não encontrado',
      });
    }

    const restaurantReviews = await reviewRepo.getAll(restaurantId);

    const alreadyReviewed = restaurantReviews.find(review => review.member === member);

    if (alreadyReviewed) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Não é possível fazer duas reviews no mesmo estabelecimento',
      });
    }

    const averageRating = this.roundOneCase(
      (serviceRating + priceRating + packageRating + productRating + waitTimeRating) / 5,
    );

    const review: Review = {
      ...request,
      id: uuid(),
      averageRating,
    };

    const updatedRestaurant = this.updateRestaurantProps(restaurant, restaurantReviews, review);

    await restaurantRepo.save(updatedRestaurant);

    return reviewRepo.save(review);
  }

  private roundOneCase(value: number): number {
    return Number(value.toFixed(1));
  }

  private updateRestaurantProps(restaurant: Restaurant, reviews: Array<Review>, newReview: Review): Restaurant {
    const newReviews = [...reviews, newReview];

    const newAverage = this.roundOneCase(
      newReviews.reduce((previous: number, review: Review) => previous + review.averageRating, 0) /
        newReviews.length,
    );

    restaurant.reviewsAmount = newReviews.length;
    restaurant.averageRating = newAverage;

    return restaurant;
  }
}
