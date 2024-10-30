export interface IProducts {
  name: string;
  userId: string;
  category: string;
  origin?: string;
  color?: string;
  size?: string;
  description: string;
  remainingQuantity: number;
  quantitySold: number;
  imageURL: string;
  price: number;
}
