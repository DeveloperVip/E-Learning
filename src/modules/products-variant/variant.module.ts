import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from './domain/variant.entity';
import { ProductVariantController } from './variant.controller';
import { ProductVariantService } from './variant.service';
import { ImageEntity } from './domain/image.entity';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';
import { OrderItemEntity } from '@modules/order-items/domain/orderItem.entity';
import { OrderItemService } from '@modules/order-items/orderItem.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductVariantEntity,
      ImageEntity,
      OrderItemEntity,
    ]),
    AuthLibModule,
  ],
  controllers: [ProductVariantController],
  providers: [ProductVariantService, OrderItemService],
  exports: [],
})
export class ProductVariantModule {}
