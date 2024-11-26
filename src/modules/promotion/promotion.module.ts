import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import { PromotionEntity } from './domain/promotion.entity';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity, PromotionEntity])],
  providers: [PromotionService],
  exports: [PromotionService],
  controllers: [PromotionController],
})
export class PromotionModule {}
