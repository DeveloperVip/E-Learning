import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemStatus } from '@modules/order-items/domain/orderItem.entity';

export class UpdateOrderItemStatusDto {
  @ApiProperty({
    description: 'The status of the order item.',
    example: OrderItemStatus.ORDERING,
    enum: OrderItemStatus,
  })
  @IsEnum(OrderItemStatus)
  @IsNotEmpty()
  status: OrderItemStatus;
}
