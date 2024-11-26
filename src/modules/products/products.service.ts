import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsDto } from './dto/products.dto';
import { ProductResponseDto } from './dto/ProductResponse.dto';
import { ProducstEntity } from './domain/products.entity';
import { statusResponses } from '@shared/enum';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import { ProductVariantService } from '@modules/products-variant/variant.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProducstEntity)
    private readonly productsRepository: Repository<ProducstEntity>,

    @InjectRepository(ProductVariantEntity)
    private readonly ProductVariantRepository: Repository<ProductVariantEntity>,

    private readonly ProductVariantService: ProductVariantService,
  ) {}

  // Tạo sản phẩm mới
  public async createProducts(
    productInfo: ProductsDto,
  ): Promise<ProductResponseDto> {
    try {
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
    } catch (error) {
      throw new HttpException(
        `Error creating product: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Lấy tất cả sản phẩm
  public async findAllProducts() {
    try {
      const product = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.store', 'store')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categories', 'categories')
        .leftJoinAndSelect('product.productVariants', 'productVariants')
        .leftJoinAndSelect('productVariants.color', 'color')
        .leftJoinAndSelect('productVariants.images', 'images')
        .leftJoinAndSelect('productVariants.size', 'size')
        .select([
          'product',
          'store.name',
          'store.id',
          'brand.name',
          'brand.id',
          'categories.name',
          'categories.id',
          'productVariants',
          'images.url',
          'color',
          'size',
        ])
        .where('product.isDeleted = :isDeleted', { isDeleted: false })
        .getMany();

      if (!product)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

      return product;
    } catch (error) {
      throw new HttpException(
        `Error fetching products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Lấy sản phẩm theo ID
  public async findOneProduct(productId: string) {
    try {
      const product = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.store', 'store')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.categories', 'categories')
        .leftJoinAndSelect('product.productVariants', 'productVariants')
        .leftJoinAndSelect('productVariants.images', 'images')
        .leftJoinAndSelect('productVariants.color', 'color')
        .leftJoinAndSelect('productVariants.size', 'size')
        .select([
          'product',
          'store.name',
          'store.id',
          'brand.name',
          'brand.id',
          'categories.name',
          'categories.id',
          'productVariants',
          'images.url',
          'color',
          'size',
        ])
        .where('product.id = :productId', { productId: productId })
        .getOne();

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return product;
    } catch (error) {
      throw new HttpException(
        `Error fetching product with ID ${productId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Cập nhật sản phẩm
  public async updateProduct(
    storeId: string,
    productId: string,
    productDetail: ProductsDto,
  ) {
    try {
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
    } catch (error) {
      throw new HttpException(
        `Error updating product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Xóa sản phẩm
  public async deleteProduct(storeId: string, productId: string) {
    try {
      const product = await this.findOneProduct(productId);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      if (storeId === product.storeId) {
        product.isDeleted = true;
        const productVariant = this.ProductVariantRepository.find({
          where: { productId: productId, isDeleted: false },
        });
        await Promise.all(
          (await productVariant).map((item) =>
            this.ProductVariantService.delete(item.id, storeId, productId),
          ),
        );
        await product.save();
        return {
          data: null,
          message: `Product name ${product.name} deleted successfully`,
          status: statusResponses.SUCCESS,
        };
      } else {
        throw new HttpException(
          'Error internal server',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    } catch (error) {
      throw new HttpException(
        `Error deleting product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
