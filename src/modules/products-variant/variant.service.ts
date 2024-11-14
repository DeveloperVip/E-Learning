import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from './domain/variant.entity';
import { ImageEntity } from './domain/image.entity';
import { CreateProductVariantDto } from './dto/create.dto';
import { statusResponses } from '@shared/enum';
import { UpdateProductVariantDto } from './dto/update.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: Repository<ProductVariantEntity>,

    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  // Create a new ProductVariant
  async create(data: CreateProductVariantDto): Promise<any> {
    const newProductVariant = await this.productVariantRepository.save({
      ...data,
    });
    console.log(newProductVariant);
    if (data.imageUrls && data.imageUrls.length > 0) {
      await data.imageUrls.map(async (url) => {
        await this.createImage(url, newProductVariant.id, data.storeId);
      });
      return newProductVariant;
    }
    throw new HttpException('Error Create Product', HttpStatus.CONFLICT);
  }

  // Get all ProductVariants
  async findAll(): Promise<ProductVariantEntity[]> {
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
      .getMany(); // getMany() để lấy tất cả các bản ghi
  }

  // Get a single ProductVariant by ID
  async findOne(id: string): Promise<ProductVariantEntity> {
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
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }

    return productVariant;
  }

  // Update a ProductVariant by ID
  async update(
    id: string,
    data: UpdateProductVariantDto,
    storeId: string,
    productId: string,
  ): Promise<ProductVariantEntity> {
    const productVariant = await this.findOne(id);
    if (
      storeId === productVariant.storeId &&
      productId === productVariant.productId
    ) {
      console.log(data);
      Object.assign(productVariant, data);
      const newProduct =
        await this.productVariantRepository.save(productVariant);
      if (data.imageUrls && data.imageUrls.length > 0) {
        await data.imageUrls.map(async (url) => {
          await this.createImage(url, newProduct.id, data.storeId);
        });
      }
      return newProduct;
    }
    throw new HttpException(
      'No find this product variant',
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteImage(id, storeId) {
    const image: ImageEntity = await this.imageRepository.findOne({
      where: { id: id, storeId: storeId },
    });
    const deleteImage = await this.imageRepository.remove(image);
    if (deleteImage[0])
      return {
        message: 'Delete image success',
        status: statusResponses.SUCCESS,
      };
  }

  async createImage(url, productVariant, storeId) {
    return await this.imageRepository.save({
      url: url,
      productVariantId: productVariant,
      storeId: storeId,
    });
  }

  // Delete a ProductVariant by ID
  async delete(id: string, storeId: string, productId: string): Promise<any> {
    const productVariant = await this.findOne(id);
    if (
      storeId === productVariant.storeId &&
      productId === productVariant.productId
    ) {
      const deleteResult =
        await this.productVariantRepository.remove(productVariant);
      if (deleteResult[0] === 0) {
        throw new NotFoundException(`ProductVariant with ID ${id} not found`);
      }
      return {
        message: `ProductVariant with ID ${id} deleted success`,
        status: statusResponses.SUCCESS,
      };
    }
  }
}
