import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandEntity } from './domain/brand.entity';
import { CreateBrandDTO } from './dto/create.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  // Tạo mới Brand
  public async createBrand(createBrandDTO: CreateBrandDTO) {
    console.log(
      '🚀 ~ BrandService ~ createBrand ~ createBrand:',
      createBrandDTO,
    );
    const existingBrand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.store', 'store')
      .select(['brand', 'store.name', 'store.id'])
      .where('brand.name = :name', { name: createBrandDTO.name })
      .getOne();
    console.log(
      '🚀 ~ BrandService ~ createBrand ~ existingBrand:',
      existingBrand,
    );
    if (existingBrand) {
      throw new HttpException('Brand already exists', HttpStatus.CONFLICT);
    }
    const brand = this.brandRepository.create(createBrandDTO);
    return await this.brandRepository.save(brand);
  }

  // Lấy thông tin Brand theo ID
  public async getBrandById(id: string) {
    const brand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.store', 'store')
      .select(['brand', 'store.name', 'store.id'])
      .where('brand.id = :id', { id: id })
      .getOne();
    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }
    return brand;
  }

  // Lấy tất cả các Brand
  public async getAllBrands() {
    const existingBrand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.store', 'store')
      .select(['brand', 'store.name', 'store.id'])
      .getMany();
    if (!existingBrand) {
      throw new HttpException('No brand', HttpStatus.NOT_FOUND);
    }
    return existingBrand;
  }

  // Xóa Brand theo ID
  public async deleteBrand(id: string) {
    const brand = await this.getBrandById(id);
    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }
    await this.brandRepository.remove(brand);
    return { message: 'Brand deleted successfully' };
  }
}
