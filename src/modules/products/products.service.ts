import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { statusResponse } from '../users/status.enum';
import { ProductsDto } from './dto/products.dto';
import { ProductResponseDto } from './dto/ProductResponse.dto';
import { ProducstEntity } from './domain/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProducstEntity)
    private readonly ProductsRepository: Repository<ProducstEntity>,
  ) {}
  public async createProducts(
    productInfo: ProductsDto,
  ): Promise<ProductResponseDto> {
    const product = await this.ProductsRepository.findOne({
      where: { name: productInfo.name, userId: productInfo.userId },
    });
    if (!isDefined(product)) {
      const newProduct = await this.ProductsRepository.save({
        ...productInfo,
        userId: productInfo.userId,
      });
      console.log(newProduct);
      return {
        data: newProduct.id,
        message: 'Create product success',
        status: statusResponse.SUCCESS,
      };
    }
    return {
      data: null,
      message: ' product existed',
      status: statusResponse.SUCCESS,
    };
  }

  public async findAllProducts() {
    return this.ProductsRepository.find();
  }

  public async findOneProduct(productId: string) {
    const product = this.ProductsRepository.findOne({
      where: { id: productId },
    });
    return product;
  }
}
