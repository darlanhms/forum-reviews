import Restaurant from 'app/entities/Restaurant';
import { FILE_PREFIX } from '../core/consts';
import { BaseRepository } from './BaseRepository';

export default class RestaurantRepository extends BaseRepository<Restaurant> {
  private getFilePath(): string {
    return `${FILE_PREFIX}/restaurants.json`;
  }

  compare(a: Restaurant, b: Restaurant): boolean {
    return a.id === b.id;
  }

  async getAll(): Promise<Array<Restaurant>> {
    return super.getAll(this.getFilePath());
  }

  async save(restaurant: Restaurant): Promise<Restaurant> {
    const restaurants = await this.getAll();

    const newRestaurants = this.updateOrInsertInArray(restaurants, restaurant);

    await this.saveFileContent(this.getFilePath(), newRestaurants);

    return restaurant;
  }
}
