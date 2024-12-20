import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDTO } from './dto/update.dto';
import { CreateCategoryDTO } from './dto/create.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @Get('get-all')
  async getAllCategories() {
    return await this.CategoriesService.findAll();
  }

  @Get('get/:id')
  async getCategoryById(@Param('id') id: string) {
    return await this.CategoriesService.findById(id);
  }

  @Post('create/:storeId/:billboardId')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() data: CreateCategoryDTO,
    @Param('storeId') storeId: string,
    @Param('billboardId') billboardId: string,
  ) {
    const dataCategory = {
      ...data,
      storeId,
      billboardId,
    };
    return await this.CategoriesService.create(dataCategory);
  }

  @Put('update/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDTO,
  ) {
    return await this.CategoriesService.update(id, data);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string) {
    await this.CategoriesService.delete(id);
    return;
  }
}
