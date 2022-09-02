import { TRPCError } from '@trpc/server';
import Restaurant from 'app/entities/Restaurant';
import Review from 'app/entities/Review';
import RestaurantRepository from 'app/repositories/RestaurantRepository';
import roundOneCase from 'app/utils/roundOneCase';

interface UpdateRestaurantReviewPropsRequest {
  restaurantId: string;
  reviews: Array<Review>;
}

export default class UpdateRestaurantReviewPropsUseCase {
  restaurantRepo = new RestaurantRepository();

  async execute(request: UpdateRestaurantReviewPropsRequest): Promise<Restaurant> {
    const { restaurantId, reviews } = request;

    const restaurant = await this.restaurantRepo.findById(restaurantId);

    if (!restaurant) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Restaurante da review não encontrado',
      });
    }

    const newAverage = roundOneCase(
      reviews.reduce((previous: number, review: Review) => previous + review.averageRating, 0) / reviews.length,
    );

    restaurant.reviewsAmount = reviews.length;
    restaurant.averageRating = newAverage || 0;

    return this.restaurantRepo.save(restaurant);
  }
}
