import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProducstEntity } from './domain/products.entity';
import { AuthLibModule } from 'src/libs/auth-lib/auth.lib.module';
import { ProductsController } from './products.controller';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import { ProductVariantService } from '@modules/products-variant/variant.service';
import { ImageEntity } from '@modules/products-variant/domain/image.entity';
import { OrderItemEntity } from '@modules/order-items/domain/orderItem.entity';
import { OrderItemService } from '@modules/order-items/orderItem.service';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProducstEntity,
      ProductVariantEntity,
      ImageEntity,
      OrderItemEntity,
    ]),
    AuthLibModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductVariantService, OrderItemService],
  exports: [ProductsService],
})
export class ProductsModule {}
