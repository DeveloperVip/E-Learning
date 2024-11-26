import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionEntity } from './domain/promotion.entity';
import { CreatePromotionDto } from './dto/create.dto';
import { UpdatePromotionDto } from './dto/update.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('promotions')
@ApiTags('Promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  /**
   * Tạo mới một khuyến mại
   */
  @Post('create')
  async createPromotion(
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<PromotionEntity> {
    return await this.promotionService.createPromotion(createPromotionDto);
  }

  /**
   * Cập nhật thông tin khuyến mại
   */
  @Put('update/:id')
  async updatePromotion(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ): Promise<PromotionEntity> {
    return await this.promotionService.updatePromotion(id, updatePromotionDto);
  }

  /**
   * Lấy tất cả các khuyến mại hợp lệ cho Product Variant
   */
  @Get('variant/:variantId')
  async getAllPromotionsForVariant(
    @Param('variantId') variantId: string,
  ): Promise<PromotionEntity[]> {
    return await this.promotionService.getAllPromotionsForVariant(variantId);
  }

  /**
   * Áp dụng khuyến mại tốt nhất cho Product Variant
   */
  @Post('variant/:variantId/apply')
  async applyBestPromotionForVariant(
    @Param('variantId') variantId: string,
  ): Promise<{
    finalPrice: number;
    appliedPromotion?: PromotionEntity;
    freeShipping?: boolean;
  }> {
    return await this.promotionService.applyBestPromotionForVariant(variantId);
  }

  /**
   * Xóa khuyến mại
   */
  @Delete('delete/:id')
  async deletePromotion(@Param('id') id: string): Promise<void> {
    return await this.promotionService.deletePromotion(id);
  }
}
