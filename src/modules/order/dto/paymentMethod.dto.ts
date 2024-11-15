import { IsEnum } from 'class-validator';
import { PaymentMethod } from '../domain/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({ example: 'Payment method' })
  @IsEnum(PaymentMethod) // Validate the paymentMethod as one of the enum values
  paymentMethod: PaymentMethod;
}
