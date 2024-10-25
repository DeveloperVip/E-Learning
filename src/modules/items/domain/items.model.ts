export interface IProductInfo {
  origin?: string;
  color?: string;
  size?: string;
}

export interface IItems {
  name: string;
  imageURL: string;
  category: string;
  infoProduct: IProductInfo;
  price: number;
  description: string;
  remainingQuantity: number;
  quantitySold: number;
}
