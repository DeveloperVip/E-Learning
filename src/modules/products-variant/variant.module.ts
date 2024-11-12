import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from './domain/variant.entity';
import { ProductVariantController } from './variant.controller';
import { ProductVariantService } from './variant.service';
import { ImageEntity } from './domain/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity, ImageEntity])],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [],
})
export class ProductVariantModule {}
