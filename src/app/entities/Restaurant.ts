export const waysToOrder = ['Telefone', 'App próprio', 'Pedidos10', 'iFood'] as const;

export type WayToOrder = typeof waysToOrder[number];

export default interface Restaurant {
  id: string;
  name: string;
  wayToOrder: Array<WayToOrder>;
}
