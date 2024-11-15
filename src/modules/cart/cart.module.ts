import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './domain/cart.entity';
import { OrderItemEntity } from '@modules/order-items/domain/orderItem.entity';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, OrderItemEntity]),
    AuthLibModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
