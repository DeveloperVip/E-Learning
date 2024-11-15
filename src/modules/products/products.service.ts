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
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'categories')
      .select([
        'product',
        'store.name',
        'store.id',
        'brand.name',
        'brand.id',
        'categories.name',
        'categories.id',
      ])
      .getMany();
    if (!product)
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    return product;
  }

  // Lấy sản phẩm theo ID
  public async findOneProduct(productId: string) {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'categories')
      .select([
        'product',
        'store.name',
        'store.id',
        'brand.name',
        'brand.id',
        'categories.name',
        'categories.id',
      ])
      .where('product.id = :productId', { productId: productId })
      .getOne();

    if (!product) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  public async updateProduct(
    storeId: string,
    productId: string,
    productDetail: ProductsDto,
  ) {
    const product = await this.findOneProduct(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (storeId === product.storeId) {
      const updateProduct = await this.productsRepository.update(
        productId,
        productDetail,
      );
      if (updateProduct) {
        return {
          data: updateProduct,
          message: 'Product updated successfully',
          status: statusResponses.SUCCESS,
        };
      }
    }
    throw new HttpException(
      'Error internal server',
      HttpStatus.EXPECTATION_FAILED,
    );
  }

  public async deleteProduct(storeId: string, productId: string) {
    const product = await this.findOneProduct(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    if (storeId === product.storeId) {
      const deleteProduct = await this.productsRepository.remove(product);
      if (deleteProduct[0])
        return {
          data: null,
          message: 'Product deleted successfully',
          status: statusResponses.SUCCESS,
        };
    } else
      throw new HttpException(
        'Error internal server',
        HttpStatus.EXPECTATION_FAILED,
      );
  }
}
