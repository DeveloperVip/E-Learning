import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './domain/orderItem.entity';
import { OrderItemService } from './orderItem.service';
import { OrderItemController } from './orderItem.controller';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemEntity]), AuthLibModule],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
