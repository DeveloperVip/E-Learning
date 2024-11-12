import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { isDefined } from 'class-validator';
import { ProductsDto } from './dto/products.dto';
import { ProductResponseDto } from './dto/ProductResponse.dto';
import { ProducstEntity } from './domain/products.entity';
import { statusResponses } from '@shared/enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProducstEntity)
    private readonly productsRepository: Repository<ProducstEntity>,
  ) {}

  // Tạo sản phẩm mới
  public async createProducts(
    productInfo: ProductsDto,
  ): Promise<ProductResponseDto> {
    // Kiểm tra nếu sản phẩm đã tồn tại trong cơ sở dữ liệu theo tên
    const existingProduct = await this.productsRepository.findOne({
      where: { name: productInfo.name },
    });

    if (existingProduct) {
      return {
        data: null,
        message: 'Product already exists.',
        status: statusResponses.FAIL,
      };
    }

    // Tạo đối tượng sản phẩm mới với các ID của store, brand, và category
    const newProduct = this.productsRepository.create({
      ...productInfo,
      store: { id: productInfo.storeId }, // Chỉ cần ID của store
      brand: { id: productInfo.brandId }, // Chỉ cần ID của brand
      categories: { id: productInfo.categoryId }, // Chỉ cần ID của category
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    await this.productsRepository.save(newProduct);

    return {
      data: newProduct.id,
      message: 'Product created successfully.',
      status: statusResponses.SUCCESS,
    };
  }

  // Lấy tất cả sản phẩm
  public async findAllProducts() {
    return this.productsRepository.find({
      relations: ['store', 'brand', 'categories'], // Lấy thông tin của store, brand và category
    });
  }

  // Lấy sản phẩm theo ID
  public async findOneProduct(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['store', 'brand', 'categories'], // Lấy thông tin của store, brand và category
    });

    if (!product) {
      return {
        data: null,
        message: 'Product not found.',
        status: statusResponses.FAIL,
      };
    }

    return {
      data: product,
      message: 'Product found.',
      status: statusResponses.SUCCESS,
    };
  }

  public async updateProduct(productId: string, productDetail: ProductsDto) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    await this.productsRepository.update(productId, productDetail);
    const updatedProduct = await this.productsRepository.findOne({
      where: { id: productId },
    });
    return {
      data: updatedProduct,
      message: 'Product updated successfully',
      status: statusResponses.SUCCESS,
    };
  }

  public async deleteProduct(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    await this.productsRepository.delete(productId);
    return {
      data: null,
      message: 'Product deleted successfully',
      status: statusResponses.SUCCESS,
    };
  }
}
