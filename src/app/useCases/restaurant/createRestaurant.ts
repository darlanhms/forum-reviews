import { v4 as uuid } from 'uuid';
import { CreateRestaurantRequest } from 'app/controllers/restaurant.controller';
import Restaurant from 'app/entities/Restaurant';
import RestaurantRepository from 'app/repositories/RestaurantRepository';

export default class CreateRestaurantUseCase {
  execute(request: CreateRestaurantRequest): Promise<Restaurant> {
    const restaurantRepo = new RestaurantRepository();

    const restaurant: Restaurant = {
      ...request,
      id: uuid(),
      averageRating: 0,
      reviewsAmount: 0,
    };

    return restaurantRepo.save(restaurant);
  }
}
