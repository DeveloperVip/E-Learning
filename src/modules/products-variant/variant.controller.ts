import { ProductVariantService } from './variant.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  //   NotFoundException,
} from '@nestjs/common';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly ProductVariantService: ProductVariantService) {}

  // Create a new ProductVariant
  @Post()
  async create(@Body() data: any) {
    return this.ProductVariantService.create(data);
  }

  // Get all ProductVariants
  @Get()
  async findAll() {
    return this.ProductVariantService.findAll();
  }

  // Get a single ProductVariant by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ProductVariantService.findOne(id);
  }

  // Update a ProductVariant by ID
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.ProductVariantService.update(id, data);
  }

  // Delete a ProductVariant by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ProductVariantService.delete(id);
  }
}
