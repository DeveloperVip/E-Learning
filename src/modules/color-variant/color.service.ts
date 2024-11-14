import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorEntity } from './domain/color.entity';
import { Repository } from 'typeorm';
import { CreateColorDTO } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(ColorEntity)
    private readonly ColorRepository: Repository<ColorEntity>,
  ) {}

  async findAllColor() {
    const color = await this.ColorRepository.createQueryBuilder('color')
      .leftJoinAndSelect('color.store', 'store')
      .select(['color', 'store.name', 'store.id'])
      .getMany();
    if (!color)
      throw new HttpException('Color not found', HttpStatus.NOT_FOUND);
    return color;
  }

  public async findById(id: string) {
    const color = await this.ColorRepository.createQueryBuilder('color')
      .leftJoinAndSelect('color.store', 'store')
      .select(['color', 'store.name', 'store.id'])
      .where('color.id= :id', { id })
      .getOne();
    if (!color)
      throw new HttpException('Color not found', HttpStatus.NOT_FOUND);
    return color;
  }

  async findByUser(storeId: string) {
    const color = await this.ColorRepository.createQueryBuilder('color')
      .leftJoinAndSelect('color.store', 'store')
      .select(['color', 'store.name', 'store.id'])
      .where('color.storeId= :storeId', { storeId })
      .getMany();
    if (!color)
      throw new HttpException('Color not found', HttpStatus.NOT_FOUND);
    return color;
  }

  public async createColor(data: CreateColorDTO) {
    const color = await this.ColorRepository.createQueryBuilder('color')
      .select(['color'])
      .where('color.name= :name', { name: data.name })
      .orWhere('color.value= :value', { value: data.value })
      .getOne();
    if (color)
      throw new HttpException('Color was existed', HttpStatus.CONFLICT);
    const newColor = await this.ColorRepository.save({
      ...data,
      storeId: data.storeId,
    });
    return newColor;
  }

  async deleteColor(id: string, storeId: string) {
    const color = await this.findById(id);
    if (color && color.storeId === storeId) {
      if (!color) {
        throw new HttpException('Color not found', HttpStatus.NOT_FOUND); // Nếu không tìm thấy color
      }

      const deletedColor = await this.ColorRepository.remove(color);
      if (deletedColor[0])
        return {
          message: 'Color deleted successfully',
          status: HttpStatus.ACCEPTED,
        };
    }
    throw new HttpException('Color not found', HttpStatus.NOT_FOUND); // Nếu không tìm thấy color
  }
}
