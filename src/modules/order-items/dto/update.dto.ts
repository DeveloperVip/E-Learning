import { IsUUID, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemStatus } from '../domain/orderItem.entity';

export class UpdateOrderItemDto {
  id?: string;

  @ApiProperty({
    description: 'The ID of the order that this item is part of.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  orderId?: string;

  @IsEnum(OrderItemStatus)
  status?: OrderItemStatus;

  @IsBoolean()
  choosen?: boolean;

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
