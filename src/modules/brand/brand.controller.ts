import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDTO } from './dto/create.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // Tạo mới Brand
  @Post('create')
  public async createBrand(@Body() createBrandDTO: CreateBrandDTO) {
    return await this.brandService.createBrand(createBrandDTO);
  }

  // Lấy thông tin Brand theo ID
  @Get('get/:id')
  public async getBrandById(@Param('id') id: string) {
    return await this.brandService.getBrandById(id);
  }

  // Lấy tất cả các Brand
  @Get('get-all')
  public async getAllBrands() {
    return await this.brandService.getAllBrands();
  }

  // Xóa Brand theo ID
  @Delete('delete/:id')
  public async deleteBrand(@Param('id') id: string) {
    return await this.brandService.deleteBrand(id);
  }
}
