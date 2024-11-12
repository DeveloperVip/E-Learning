import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsDto } from './dto/products.dto';
import { ProductResponseDto } from './dto/ProductResponse.dto';
import { JwtAuthGuard } from 'src/libs/auth-lib/jwt-auth.guard';
import { ProductsService } from './products.service';

@Controller('product')
@ApiTags('Product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products
  @Get('GetAllProduct')
  async GetAllProduct() {
    return this.productsService.findAllProducts();
  }

  // Get a product by ID
  @Get('get/:productId')
  async GetProductById(@Param('productId') productId: string) {
    return this.productsService.findOneProduct(productId);
  }

  // Create a product
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create-product/:storeId') // storeId is now a route parameter
  async CreateProduct(
    @Request() req,
    @Param('storeId') storeId: string,
    @Body() productDetail: ProductsDto, // Get the product details from the body
  ): Promise<ProductResponseDto> {
    console.log(req); // Optional: for debugging request data
    return await this.productsService.createProducts({
      ...productDetail,
      storeId: storeId, // Pass the storeId along with product details
    });
  }

  // Update a product (PATCH)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-product/:productId')
  async UpdateProduct(
    @Param('productId') productId: string,
    @Body() productDetail: ProductsDto, // Get updated product details from body
  ) {
    return this.productsService.updateProduct(productId, productDetail);
  }

  // Delete a product (DELETE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':productId/delete-product')
  async DeleteProduct(@Param('productId') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
