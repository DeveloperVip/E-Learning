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
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.store', 'store')
      .leftJoinAndSelect('category.billboard', 'billboard')
      .select([
        'category',
        'store.name',
        'store.id',
        'billboard.imageUrl',
        'billboard.label',
        'billboard.id',
      ])
      .getMany();
  }

  async findById(id: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.store', 'store')
      .leftJoinAndSelect('category.billboard', 'billboard')
      .select([
        'category',
        'store.name',
        'store.id',
        'billboard.imageUrl',
        'billboard.label',
        'billboard.id',
      ])
      .where('category.id = :id', { id })
      .getOne();
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async create(data: CreateCategoryDTO) {
    const category = await this.categoryRepository.create({
      ...data,
      storeId: data.storeId,
      billboardId: data.billboardId,
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
      name: data.name,
      storeId: data.storeId,
      billboardId: data.billboardId,
    });

    return updatedCategory;
  }

  async delete(id: string) {
    const result = await this.findById(id);
    if (!result[0]) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Category deleted successfully',
      status: HttpStatus.ACCEPTED,
    };
  }
}
