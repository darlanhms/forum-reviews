import { DeleteReviewRequest } from 'app/controllers/review.controller';
import RestaurantRepository from 'app/repositories/RestaurantRepository';
import ReviewRepository from 'app/repositories/ReviewRepository';
import UpdateRestaurantReviewPropsUseCase from './updateRestaurantReviewProps';

export default class DeleteReviewUseCase {
  reviewRepo = new ReviewRepository();

  restaurantRepo = new RestaurantRepository();

  updateRestaurantReview = new UpdateRestaurantReviewPropsUseCase();

  async execute(request: DeleteReviewRequest): Promise<void> {
    const restaurantReviews = await this.reviewRepo.getAll(request.restaurantId);

    await this.updateRestaurantReview.execute({
      restaurantId: request.restaurantId,
      reviews: restaurantReviews.filter(({ id }) => id !== request.id),
    });

    return this.reviewRepo.delete(request.id, request.restaurantId);
  }
}
