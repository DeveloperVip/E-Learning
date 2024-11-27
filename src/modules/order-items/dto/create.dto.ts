import { IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemStatus } from '../domain/orderItem.entity';

export class CreateOrderItemDto {
  id?: string;
  @ApiProperty({
    description: 'The ID of the product variant being ordered.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: 'The ID of the order that this item is part of.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  orderId: string | null;

  status?: OrderItemStatus;

  @ApiProperty({
    description: 'The price of a single unit of the product variant.',
    example: 49.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @ApiProperty({
    description: 'The quantity of the product variant ordered.',
    example: 2,
  })
  @IsNumber()
  amount?: number;
}
