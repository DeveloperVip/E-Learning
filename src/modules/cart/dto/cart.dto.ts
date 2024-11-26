import { IsNotEmpty, IsNumber, IsUUID, Min, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ItemStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class AddItemToCartDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The ID of the product being added to the cart',
    example: 'abc123',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product being added to the cart',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'The price of a single unit of the product',
    example: 19.99,
  })
  @IsNumber()
  @IsPositive()
  @Min(0)
  price: number;
}

export class UpdateItemQuantityDto {
  @ApiProperty({
    description: 'The ID of the product to update in the cart',
    example: 'abc123',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'The new quantity of the product in the cart',
    example: 5,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;
}

export class RemoveItemFromCartDto {
  @ApiProperty({
    description: 'The ID of the product to remove from the cart',
    example: 'abc123',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
