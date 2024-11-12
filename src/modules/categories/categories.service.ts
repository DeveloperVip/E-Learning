import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './domain/categories.entity';
import { CreateCategoryDTO } from './dto/create.dto';
import { UpdateCategoryDTO } from './dto/update.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find({
      relations: ['store', 'billboard'],
    });
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['store', 'billboard'],
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async create(data: CreateCategoryDTO) {
    const category = this.categoryRepository.create({
      ...data,
      store: { id: data.storeId },
      billboard: { id: data.billboardId },
    });
    return await this.categoryRepository.save(category);
  }

  async update(id: string, data: UpdateCategoryDTO) {
    const category = await this.findById(id);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const updatedCategory = await this.categoryRepository.save({
      ...category,
      ...data,
      store: { id: data.storeId },
      billboard: { id: data.billboardId },
    });

    return updatedCategory;
  }

  async delete(id: string) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Category deleted successfully' };
  }
}
