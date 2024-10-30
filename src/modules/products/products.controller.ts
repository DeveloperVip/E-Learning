import {
  Body,
  Controller,
  Get,
  Post,
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
  constructor(private readonly ProductsService: ProductsService) {}

  @Get('GetAllProduct')
  async GetAllProduct() {
    return this.ProductsService.findAllProducts();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create-product')
  async CreateProduct(
    @Request() req,
    @Body() productDetail: ProductsDto,
  ): Promise<ProductResponseDto> {
    console.log(req);
    return await this.ProductsService.createProducts({
      userId: req.user.userId,
      ...productDetail,
    });
  }
}
