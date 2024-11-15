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
    const size: SizeEntity = await this.SizeRepository.createQueryBuilder(
      'size',
    )
      .leftJoinAndSelect('size.store', 'store')
      .select(['size', 'store.name', 'store.id'])
      .where('size.id= :id', { id })
      .getOne();
    if (!size) throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
    return size;
  }

  public async getSizeAll() {
    const size = await this.SizeRepository.createQueryBuilder('size')
      .leftJoinAndSelect('size.store', 'store')
      .select(['size', 'store.name', 'store.id'])
      .getMany();
    if (!size) throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
    return size;
  }

  async findByUser(storeId: string) {
    const size = await this.SizeRepository.createQueryBuilder('size')
      .leftJoinAndSelect('size.store', 'store')
      .select(['size', 'store.name', 'store.id'])
      .where('size.storeId= :storeId', { storeId })
      .getMany();
    if (!size) throw new HttpException('size not found', HttpStatus.NOT_FOUND);
    return size;
  }

  public async createSize(data: CreateSizeDTO) {
    const size = await this.SizeRepository.createQueryBuilder('size')
      .select(['size'])
      .where('size.name= :name', { name: data.name })
      .getOne();
    if (size) throw new HttpException('Size was existed', HttpStatus.CONFLICT);
    const newSize = await this.SizeRepository.save({
      ...data,
      storeId: data.storeId,
    });
    return newSize;
  }

  public async deleteSize(data: DeleteSizeDTO) {
    const size = await this.getSizeById(data.id);
    if (size && data.storeId === size.storeId) {
      const deletedSize = await this.SizeRepository.remove(size);
      if (deletedSize[0])
        return {
          message: 'size deleted successfully',
          status: HttpStatus.ACCEPTED,
        };
    }
    throw new HttpException('Size not found', HttpStatus.NOT_FOUND); // Nếu không tìm thấy color
  }
}
