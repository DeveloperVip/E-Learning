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
    return this.BillboardRepository.find(); // Truy vấn tất cả các bản ghi
  }

  // Lấy bảng quảng cáo theo ID
  async findOne(id: string): Promise<BillboardEntity> {
    return this.BillboardRepository.findOne({
      where: { id },
      relations: ['store'],
    }); // Truy vấn theo ID
  }

  public async createBillboard(data: CreateBillboardDTO) {
    const exist = await this.BillboardRepository.findOne({
      where: { label: data.label },
    });
    if (exist)
      throw new HttpException('Billboard was existed', HttpStatus.CONFLICT);
    await this.BillboardRepository.save({
      ...data,
      store: { id: data.storeId },
    });
    throw new HttpException('Billboard created', HttpStatus.CREATED);
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
