import { ApiProperty } from '@nestjs/swagger';

export class ProductsDto {
  @ApiProperty({ example: 'product_name' })
  name: string;
  userId?: string;
  @ApiProperty({ example: 'category' })
  category: string;
  @ApiProperty({ example: 'origin' })
  origin?: string;
  @ApiProperty({ example: 'color' })
  color?: string;
  @ApiProperty({ example: 'size' })
  size?: string;
  @ApiProperty({ example: 'description' })
  description: string;
  @ApiProperty({ example: 'remaining_quantity' })
  remainingQuantity: number;
  @ApiProperty({ example: 'quantity_sold' })
  quantitySold: number;
  @ApiProperty({ example: 'image_URL' })
  imageURL: string;
  @ApiProperty({ example: 'price' })
  price: number;
}
