import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import { PromotionEntity } from './domain/promotion.entity';
import { CreatePromotionDto } from './dto/create.dto';
import { UpdatePromotionDto } from './dto/update.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private readonly productVariantRepository: Repository<ProductVariantEntity>,
    @InjectRepository(PromotionEntity)
    private readonly promotionRepository: Repository<PromotionEntity>, // Repository của Promotion
  ) {}

  /**
   * Tạo mới một khuyến mại
   */
  async createPromotion(
    createPromotionDto: CreatePromotionDto,
  ): Promise<PromotionEntity> {
    const promotion = this.promotionRepository.create(createPromotionDto);
    return await this.promotionRepository.save(promotion);
  }

  /**
   * Cập nhật thông tin khuyến mại
   */
  async updatePromotion(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<PromotionEntity> {
    const promotion = await this.promotionRepository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Cập nhật các thuộc tính
    Object.assign(promotion, updatePromotionDto);

    return await this.promotionRepository.save(promotion);
  }

  /**
   * Xóa khuyến mại
   */
  async deletePromotion(id: string): Promise<void> {
    const promotion = await this.promotionRepository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    await this.promotionRepository.remove(promotion);
  }
  /**
   * Lấy tất cả khuyến mại hợp lệ cho Product Variant
   */
  async getAllPromotionsForVariant(
    variantId: string,
  ): Promise<PromotionEntity[]> {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id: variantId },
      relations: [
        'promotions', // Khuyến mại của variant
        'product', // Lấy thông tin product
        'product.brand', // Brand của product
        'product.category', // Category của product
        'store', // Store của variant
      ],
    });

    if (!productVariant) {
      throw new NotFoundException('Product Variant not found');
    }

    const now = new Date();

    // Lấy khuyến mại từ Variant
    const variantPromotions = productVariant.promotions.filter((promotion) =>
      this.isPromotionValid(promotion, now),
    );

    // Lấy khuyến mại từ Brand
    const brandPromotions =
      productVariant.product?.brand?.promotions?.filter((promotion) =>
        this.isPromotionValid(promotion, now),
      ) || [];

    // Lấy khuyến mại từ Category
    const categoryPromotions =
      productVariant.product?.categories?.promotions?.filter((promotion) =>
        this.isPromotionValid(promotion, now),
      ) || [];

    // Lấy khuyến mại từ Store
    const storePromotions = await this.getStorePromotions(
      productVariant.store.id,
    );

    // Lấy khuyến mại toàn cục (Global Promotions)
    const globalPromotions = await this.getGlobalPromotions();

    // Gộp tất cả các khuyến mại
    return [
      ...variantPromotions,
      ...brandPromotions,
      ...categoryPromotions,
      ...storePromotions,
      ...globalPromotions,
    ];
  }

  /**
   * Lấy khuyến mại của Store
   */
  private async getStorePromotions(
    storeId: string,
  ): Promise<PromotionEntity[]> {
    return await this.promotionRepository.find({
      where: {
        isActive: true,
        store: { id: storeId }, // Điều kiện khuyến mại thuộc về store
      },
      relations: ['store'], // Quan hệ với Store
    });
  }

  /**
   * Lấy khuyến mại toàn cục (Global Promotions)
   */
  private async getGlobalPromotions(): Promise<PromotionEntity[]> {
    return await this.promotionRepository.find({
      where: { isActive: true, isGlobal: true }, // Giả sử là có trường `isGlobal: true`
    });
  }

  /**
   * Áp dụng khuyến mại tốt nhất cho Product Variant
   */
  async applyBestPromotionForVariant(variantId: string): Promise<{
    finalPrice: number;
    appliedPromotion?: PromotionEntity;
    freeShipping?: boolean;
  }> {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id: variantId },
    });

    if (!productVariant) {
      throw new NotFoundException('Product Variant not found');
    }

    const promotions = await this.getAllPromotionsForVariant(variantId);

    let finalPrice = productVariant.discountPrice; // Giá gốc từ variant
    let appliedPromotion: PromotionEntity | undefined;
    let freeShipping = false;

    for (const promotion of promotions) {
      let discountedPrice = finalPrice;

      if (promotion.type === 'percent') {
        discountedPrice = finalPrice * (1 - promotion.discountValue / 100);
      } else if (promotion.type === 'fixed') {
        discountedPrice = Math.max(0, finalPrice - promotion.discountValue);
      } else if (promotion.type === 'free_shipping') {
        freeShipping = true;
        discountedPrice = finalPrice; // Không thay đổi giá nếu chỉ có free shipping
      }

      if (discountedPrice < finalPrice) {
        finalPrice = discountedPrice;
        appliedPromotion = promotion;
      }
    }

    return { finalPrice, appliedPromotion, freeShipping };
  }

  /**
   * Kiểm tra khuyến mại có hợp lệ hay không
   */
  private isPromotionValid(promotion: PromotionEntity, now: Date): boolean {
    return (
      promotion.isActive &&
      (!promotion.startDate || now >= new Date(promotion.startDate)) &&
      (!promotion.endDate || now <= new Date(promotion.endDate)) &&
      (!promotion.maxQuantity ||
        promotion.appliedQuantity < promotion.maxQuantity)
    );
  }
}
