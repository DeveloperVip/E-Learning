import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SizeEntity } from './domain/size.entity';
import { Repository } from 'typeorm';
import { CreateSizeDTO } from './dto/size.dto';
import { DeleteSizeDTO } from './dto/deleted.dto';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(SizeEntity)
    private readonly SizeRepository: Repository<SizeEntity>,
  ) {}

  public async getSizeById(id: string) {
    const size = await this.SizeRepository.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!size) throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
    return size;
  }

  public async getSizeAll() {
    return this.SizeRepository.find();
  }

  public async createSize(data: CreateSizeDTO) {
    const size = this.SizeRepository.findOne({ where: { name: data.name } });
    if (size) throw new HttpException('Size existed', HttpStatus.CONFLICT);
    const newSize = await this.SizeRepository.save({
      ...data,
      store: { id: data.storeId },
    });
    if (newSize) throw new HttpException('Size created', HttpStatus.CREATED);
  }

  public async deleteSize(data: DeleteSizeDTO) {
    // Kiểm tra nếu storeId không tồn tại
    if (!data.storeId) {
      throw new HttpException('Store ID not provided', HttpStatus.BAD_REQUEST);
    }

    const size = await this.SizeRepository.findOne({
      where: { id: data.id, store: { id: data.storeId } },
    });

    if (!size) {
      throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
    }

    await this.SizeRepository.remove(size);

    return { message: 'Size deleted successfully' };
  }
}
