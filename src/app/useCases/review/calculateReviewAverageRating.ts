import Review from 'app/entities/Review';
import roundOneCase from 'app/utils/roundOneCase';

type CalculateReviewAverageRatingRequest = Pick<
  Review,
  'productRating' | 'packageRating' | 'priceRating' | 'waitTimeRating' | 'serviceRating'
>;

export default class CalculateReviewAverageRatingUseCase {
  /**
   * Quantity of things being reviewed
   */
  private quantityOfReviews = 5;

  execute(data: CalculateReviewAverageRatingRequest): number {
    return roundOneCase(
      (data.serviceRating + data.priceRating + data.packageRating + data.productRating + data.waitTimeRating) /
        this.quantityOfReviews,
    );
  }
}
