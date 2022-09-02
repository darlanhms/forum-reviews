export const waysToOrder = [
  'Telefone',
  'App próprio',
  'Pedidos10',
  'iFood',
  'Delivery Much',
  'Balcão',
  'WhatsApp',
] as const;

export type WayToOrder = typeof waysToOrder[number];

export default interface Restaurant {
  id: string;
  name: string;
  averageRating: number;
  reviewsAmount: number;
  wayToOrder: Array<WayToOrder>;
}
