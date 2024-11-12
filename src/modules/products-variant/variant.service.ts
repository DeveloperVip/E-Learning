import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from './domain/variant.entity';
import { ImageEntity } from './domain/image.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: Repository<ProductVariantEntity>,

    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  // Create a new ProductVariant
  async create(data: any): Promise<ProductVariantEntity> {
    const {
      productId,
      colorId,
      sizeId,
      price,
      remainingQuantity,
      quantitySold,
      isArchived,
      isFeatured,
      images,
    } = data;

    const newProductVariant = this.productVariantRepository.create({
      product: { id: productId },
      color: { id: colorId },
      size: { id: sizeId },
      price,
      remainingQuantity,
      quantitySold,
      isArchived,
      isFeatured,
    });

    if (images && images.length > 0) {
      newProductVariant.images = images.map((image: { url: string }) =>
        this.imageRepository.create({ url: image.url }),
      );
    }

    return this.productVariantRepository.save(newProductVariant);
  }

  // Get all ProductVariants
  async findAll(): Promise<ProductVariantEntity[]> {
    return this.productVariantRepository.find({
      relations: ['product', 'color', 'size', 'images'],
    });
  }

  // Get a single ProductVariant by ID
  async findOne(id: string): Promise<ProductVariantEntity> {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id },
      relations: ['product', 'color', 'size', 'images'],
    });

    if (!productVariant) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }

    return productVariant;
  }

  // Update a ProductVariant by ID
  async update(id: string, data: any): Promise<ProductVariantEntity> {
    const productVariant = await this.findOne(id);
    Object.assign(productVariant, data);
    return this.productVariantRepository.save(productVariant);
  }

  // Delete a ProductVariant by ID
  async delete(id: string): Promise<void> {
    const deleteResult = await this.productVariantRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }
  }
}
