import { OrderItemService } from './../order-items/orderItem.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from './domain/variant.entity';
import { ImageEntity } from './domain/image.entity';
import { CreateProductVariantDto } from './dto/create.dto';
import { statusResponses } from '@shared/enum';
import { UpdateProductVariantDto } from './dto/update.dto';
import {
  OrderItemEntity,
  OrderItemStatus,
} from '@modules/order-items/domain/orderItem.entity';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: Repository<ProductVariantEntity>,

    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,

    @InjectRepository(OrderItemEntity)
    private OrderItemRepository: Repository<OrderItemEntity>,

    private readonly OrderItemService: OrderItemService,
  ) {}

  private calculateDiscountPrice(
    originalPrice: number,
    promotionType: 'fixed' | 'percent',
    promotionValue: number,
  ): number {
    try {
      if (promotionValue !== 0) {
        if (promotionType === 'fixed') {
          // Giảm giá cố định
          return Math.max(originalPrice - promotionValue, 0); // Tránh trường hợp giá nhỏ hơn 0
        } else if (promotionType === 'percent') {
          // Giảm giá theo phần trăm
          return Math.max(
            originalPrice - (originalPrice * promotionValue) / 100,
            0,
          );
        }
      }
      return originalPrice;
    } catch (err) {
      throw new HttpException(
        `Error calculating discount price: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: CreateProductVariantDto): Promise<any> {
    try {
      const discountPrice = this.calculateDiscountPrice(
        data.price,
        data.promotionType,
        data.promotionValue,
      );
      const newProductVariant = await this.productVariantRepository.save({
        ...data,
        discountPrice,
      });
      if (data.imageUrls && data.imageUrls.length > 0) {
        await Promise.all(
          data.imageUrls.map((url) =>
            this.createImage(url, newProductVariant.id, data.storeId),
          ),
        );
      }
      return newProductVariant;
    } catch (err) {
      throw new HttpException(
        `Error creating product variant: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<ProductVariantEntity[]> {
    try {
      return await this.productVariantRepository
        .createQueryBuilder('productVariant')
        .leftJoinAndSelect('productVariant.product', 'product')
        .leftJoinAndSelect('productVariant.color', 'color')
        .leftJoinAndSelect('productVariant.size', 'size')
        .leftJoinAndSelect('productVariant.images', 'images')
        .select([
          'productVariant',
          'color.name',
          'color.value',
          'size.name',
          'images',
        ])
        .where('productVariant.isDeleted = :isDeleted', { isDeleted: false })
        .getMany();
    } catch (err) {
      throw new HttpException(
        `Error retrieving product variants: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<ProductVariantEntity> {
    try {
      const productVariant = await this.productVariantRepository
        .createQueryBuilder('productVariant')
        .leftJoinAndSelect('productVariant.product', 'product')
        .leftJoinAndSelect('productVariant.color', 'color')
        .leftJoinAndSelect('productVariant.size', 'size')
        .leftJoinAndSelect('productVariant.images', 'images')
        .select([
          'productVariant',
          'color.name',
          'color.value',
          'size.name',
          'images',
        ])
        .where('productVariant.id = :id', { id })
        .getOne();
      if (!productVariant) {
        throw new NotFoundException({
          message: `ProductVariant with ID ${id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return productVariant;
    } catch (err) {
      throw new HttpException(
        `Error finding product variant: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    data: UpdateProductVariantDto,
    storeId: string,
    productId: string,
  ): Promise<ProductVariantEntity> {
    try {
      const productVariant = await this.findOne(id);
      if (
        storeId !== productVariant.storeId ||
        productId !== productVariant.productId
      ) {
        throw new ForbiddenException({
          message: `Unauthorized to update product variant`,
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
      const discountPrice = this.calculateDiscountPrice(
        data.price || productVariant.price,
        data.promotionType || productVariant.promotionType,
        data.promotionValue || productVariant.promotionValue,
      );
      Object.assign(productVariant, data, { discountPrice });
      const updatedProductVariant =
        await this.productVariantRepository.save(productVariant);
      if (data.imageUrls && data.imageUrls.length > 0) {
        await Promise.all(
          data.imageUrls.map((url) =>
            this.createImage(url, updatedProductVariant.id, data.storeId),
          ),
        );
      }
      return updatedProductVariant;
    } catch (err) {
      throw new HttpException(
        `Error updating product variant: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(id, storeId) {
    try {
      const image = await this.imageRepository.findOne({
        where: { id: id, storeId: storeId },
      });
      if (!image) {
        throw new NotFoundException({
          message: `Image with ID ${id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.imageRepository.remove(image);
      return {
        message: 'Delete image success',
        status: statusResponses.SUCCESS,
      };
    } catch (err) {
      throw new HttpException(
        `Error deleting image: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createImage(url, productVariant, storeId) {
    try {
      return await this.imageRepository.save({
        url: url,
        productVariantId: productVariant,
        storeId: storeId,
      });
    } catch (err) {
      throw new HttpException(
        `Error creating image: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string, storeId: string, productId: string): Promise<any> {
    try {
      const productVariant = await this.findOne(id);
      if (
        storeId !== productVariant.storeId ||
        productId !== productVariant.productId
      ) {
        throw new ForbiddenException({
          message: `Unauthorized to delete product variant`,
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
      const orderItems = await this.OrderItemRepository.find({
        where: { productId: id, status: OrderItemStatus.IN_CART },
      });
      await Promise.all(
        orderItems.map((item) => this.OrderItemService.delete(item.id)),
      );
      productVariant.isDeleted = true;
      await this.productVariantRepository.save(productVariant);
      return {
        message: `ProductVariant with ID ${id} deleted successfully`,
        status: statusResponses.SUCCESS,
      };
    } catch (err) {
      throw new HttpException(
        `Error deleting product variant: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
