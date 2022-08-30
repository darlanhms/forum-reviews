import Review from 'app/entities/Review';
import { FILE_PREFIX } from '../core/consts';
import { BaseRepository } from './BaseRepository';

export default class ReviewRepository extends BaseRepository<Review> {
  private getFilePath(reviewId: string): string {
    return `${FILE_PREFIX}/reviews/${reviewId}.json`;
  }

  compare(a: Review, b: Review): boolean {
    return a.id === b.id;
  }

  async getAll(restaurantId: string): Promise<Review[]> {
    return super.getAll(this.getFilePath(restaurantId));
  }

  async save(review: Review): Promise<Review> {
    const reviews = await this.getAll(review.restaurantId);

    const newReviews = this.updateOrInsertInArray(reviews, review);

    await this.saveFileContent(this.getFilePath(review.restaurantId), newReviews);

    return review;
  }
}
