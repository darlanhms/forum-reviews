import Restaurant from 'app/entities/Restaurant';
import { FILE_PREFIX } from '../core/consts';
import { BaseRepository } from './BaseRepository';

export default class RestaurantRepository extends BaseRepository<Restaurant> {
  protected get filePath(): string {
    return `${FILE_PREFIX}/restaurants.json`;
  }

  async save(restaurant: Restaurant): Promise<Restaurant> {
    const restaurants = await this.getAll();

    const alreadyExistingRestaurantIndex = restaurants.findIndex(({ id }) => id === restaurant.id);

    if (alreadyExistingRestaurantIndex !== -1) {
      const oldRestaurant = restaurants[alreadyExistingRestaurantIndex];

      const updatedRestaurant = {
        ...oldRestaurant,
        ...restaurant,
      };

      restaurants[alreadyExistingRestaurantIndex] = updatedRestaurant;
    } else {
      restaurants.push(restaurant);
    }

    await this.saveFileContent(restaurants);

    return restaurant;
  }
}
