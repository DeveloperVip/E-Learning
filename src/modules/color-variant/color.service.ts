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

  public async findById(id: string) {
    const color = await this.ColorRepository.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!color)
      throw new HttpException('Color not found', HttpStatus.NOT_FOUND);
    return color;
  }

  public async createColor(data: CreateColorDTO) {
    const color = await this.ColorRepository.find({
      where: [{ name: data.name }, { value: data.value }],
    });
    if (color)
      throw new HttpException('Color was existed', HttpStatus.CONFLICT);
    const newColor = await this.ColorRepository.save({
      ...data,
      store: { id: data.storeId },
    });
    return newColor;
  }
}
