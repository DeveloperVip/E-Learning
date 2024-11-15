import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from '@modules/order-items/dto/create.dto';
import { OrderStatus, PaymentMethod } from '../domain/order.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The shipping address for the order.',
    example: '123 Main St, Springfield, IL',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description:
      'The status of the order. False indicates pending, and true indicates completed.',
    example: 'NOT_PAID',
    default: 'NOT_PAID',
  })
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'The contact phone number of the customer.',
    example: 1234567890,
  })
  @IsNumber()
  phone: number;

  @ApiProperty({
    description: 'The total price of the order before applying promotion.',
    example: 199.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  total: number;

  @ApiProperty({
    description: 'The ID of the user placing the order.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description:
      'The payment method used by the customer (e.g., cash, credit card).',
    example: 'cash',
    default: 'cash',
  })
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'The discount amount applied to the order.',
    example: 10.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  promotion?: number;

  @ApiProperty({
    description: 'An array of items included in the order.',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  orderItems: CreateOrderItemDto[];

  orderCode?: string;
}
