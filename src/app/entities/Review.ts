export default interface Review {
  id: string;
  member: string;
  restaurantId: string;
  serviceRating: number;
  productRating: number;
  priceRating: number;
  packageRating: number;
  averageRating: number;
  additionalInfo?: string;
}
