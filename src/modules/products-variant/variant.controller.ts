import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ProductVariantService } from './variant.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  //   NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { CreateProductVariantDto } from './dto/create.dto';
import { UpdateProductVariantDto } from './dto/update.dto';

@Controller('product-variants')
@ApiTags('Product-variant')
export class ProductVariantController {
  constructor(private readonly ProductVariantService: ProductVariantService) {}

  // Create a new ProductVariant
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:storeId/create/:productId')
  @ApiProperty({ type: CreateProductVariantDto })
  async create(
    @Body() data: CreateProductVariantDto,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    const dataProduct: CreateProductVariantDto = {
      ...data,
      storeId,
      productId,
    };
    console.log('🚀 ~ ProductVariantController ~ dataProduct:', dataProduct);
    return this.ProductVariantService.create(dataProduct);
  }

  // Get all ProductVariants
  @Get('get-all')
  async findAll() {
    return await this.ProductVariantService.findAll();
  }

  // Get a single ProductVariant by ID
  @Get('get-by-id/:id')
  async findOne(@Param('id') id: string) {
    return await this.ProductVariantService.findOne(id);
  }

  // Update a ProductVariant by ID
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:storeId/update/:productId/:id')
  @ApiProperty({ type: UpdateProductVariantDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductVariantDto,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    if (storeId) data.storeId = storeId;
    if (productId) data.productId = productId;
    return this.ProductVariantService.update(id, data, storeId, productId);
  }

  // Delete a ProductVariant by ID
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:storeId/delete/:productId/:id')
  async delete(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.ProductVariantService.delete(id, storeId, productId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:storeId/delete-image/:id')
  async deleteImage(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
  ) {
    return this.ProductVariantService.deleteImage(id, storeId);
  }
}
