import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillboardEntity } from './domain/billboard.entity';
import { Repository } from 'typeorm';
import { CreateBillboardDTO } from './dto/billboard.dto';

@Injectable()
export class BillboardService {
  constructor(
    @InjectRepository(BillboardEntity)
    private readonly BillboardRepository: Repository<BillboardEntity>,
  ) {}

  // Lấy tất cả bảng quảng cáo
  async findAll(): Promise<BillboardEntity[]> {
    return await this.BillboardRepository.createQueryBuilder('billboard')
      .leftJoinAndSelect('billboard.store', 'store')
      .leftJoinAndSelect('billboard.categories', 'categories')
      .select(['billboard', 'store.id', 'store.name', 'categories.name'])
      .getMany(); // Truy vấn tất cả các bản ghi
  }

  // Lấy bảng quảng cáo theo ID
  async findOne(id: string): Promise<any> {
    return await this.BillboardRepository.createQueryBuilder('billboard')
      .leftJoinAndSelect('billboard.store', 'store')
      .select(['billboard', 'store.id', 'store.name'])
      .where('billboard.id = :id', { id })
      .getOne(); // Truy vấn theo ID
  }

  public async createBillboard(data: CreateBillboardDTO) {
    console.log('🚀 ~ BillboardService ~ createBillboard ~ data:', data);
    const exist = await this.BillboardRepository.findOne({
      where: { label: data.label },
    });
    if (exist)
      throw new HttpException('Billboard was existed', HttpStatus.CONFLICT);
    return await this.BillboardRepository.save({
      storeId: data.storeId,
      ...data,
    });
  }

  async update(
    id: string,
    updateData: Partial<BillboardEntity>,
  ): Promise<BillboardEntity> {
    const billboard = await this.findOne(id);

    // Cập nhật các trường của bảng quảng cáo
    Object.assign(billboard, updateData);

    return this.BillboardRepository.save(billboard);
  }

  // Xóa bảng quảng cáo
  async remove(id: string): Promise<void> {
    const billboard = await this.findOne(id);

    await this.BillboardRepository.remove(billboard);
  }
}
