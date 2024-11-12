import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './domain/store.entity';
import { Repository } from 'typeorm';
import { StoreCreateDTO } from './dto/store.dto';
import { UpdateStoreDto } from './dto/update.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly StorageRespository: Repository<StoreEntity>,
  ) {}

  //find store by id
  public async findById(id: string) {
    const store = this.StorageRespository.findOne({ where: { id: id } });
    if (!store) {
      throw new HttpException(`Store not found`, HttpStatus.NOT_FOUND);
    }
    return store;
  }

  //find all store
  public async findAll() {
    const store = this.StorageRespository.find();
    if (!store) throw new HttpException('Not have store', HttpStatus.NOT_FOUND);
    return store;
  }

  //create store
  public async CreateStore(data: StoreCreateDTO) {
    const existStore = this.StorageRespository.find({
      where: { name: data.name },
    });
    if (existStore) {
      return new HttpException('Store was existed', HttpStatus.CONFLICT);
    }
    return await this.StorageRespository.save({
      name: data.name,
      userId: data.userId,
      createAt: new Date(),
    });
  }

  //update store
  public async UpdateStore(data: UpdateStoreDto) {
    // Tìm store theo id
    const store = await this.StorageRespository.findOne({
      where: { id: data.id },
    });
    if (!store) {
      throw new HttpException(`Store not found`, HttpStatus.NOT_FOUND);
    }

    // Cập nhật thông tin store
    store.updateAt = new Date();
    Object.assign(store, data);
    // Lưu bản ghi đã được cập nhật
    return await this.StorageRespository.save(store);
  }

  //delete store
  public async DeleteStore(storeData) {
    if (storeData.userId) {
      throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);
    }

    // Tìm store theo id
    const store = await this.StorageRespository.findOne({
      where: { id: storeData.id },
      relations: ['products'],
    });

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    await this.StorageRespository.remove(store);

    throw new HttpException(
      'Store and related products deleted successfully',
      HttpStatus.ACCEPTED,
    );
  }
}
