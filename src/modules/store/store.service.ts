import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './domain/store.entity';
import { Repository } from 'typeorm';
import { StoreCreateDTO } from './dto/store.dto';
import { UpdateStoreDto } from './dto/update.dto';

@Injectable()
export class StoreService {
  private logger = new Logger(StoreService.name);

  constructor(
    @InjectRepository(StoreEntity)
    private readonly StorageRepository: Repository<StoreEntity>,
  ) {}

  // Find store by ID
  public async findById(id: string) {
    try {
      const store = await this.StorageRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.user', 'user')
        .select(['store', 'user.id', 'user.email', 'user.userName'])
        .where('store.id = :id', { id })
        .getOne();

      if (!store) {
        throw new HttpException(
          `Store with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return store;
    } catch (error) {
      this.logger.error(`Failed to find store by ID ${id}`, error.stack);
      throw new HttpException(
        `Failed to retrieve store with ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Find all stores
  public async findAll() {
    try {
      const stores = await this.StorageRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.user', 'user')
        .select(['store', 'user.id', 'user.email', 'user.userName'])
        .getMany();

      if (stores.length === 0) {
        throw new HttpException('No stores found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Retrieved ${stores.length} stores`);
      return stores;
    } catch {
      throw new HttpException(
        'Failed to retrieve stores',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create a new store
  public async createStore(data: StoreCreateDTO) {
    try {
      const existingStore = await this.StorageRepository.findOne({
        where: { name: data.name },
      });

      if (existingStore) {
        throw new HttpException('Store already exists', HttpStatus.CONFLICT);
      }

      const newStore = this.StorageRepository.create({
        name: data.name,
        userId: data.userId,
        createAt: new Date(),
      });

      const savedStore = await this.StorageRepository.save(newStore);
      this.logger.log(`Created new store with ID ${savedStore.id}`);
      return savedStore;
    } catch (error) {
      this.logger.error('Failed to create store', error.stack);
      throw new HttpException(
        'Failed to create store',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a store
  public async updateStore(data: UpdateStoreDto) {
    try {
      const store = await this.StorageRepository.findOne({
        where: { id: data.id },
      });

      if (!store) {
        throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(store, data);
      store.updateAt = new Date();

      const updatedStore = await this.StorageRepository.save(store);
      this.logger.log(`Updated store with ID ${updatedStore.id}`);
      return updatedStore;
    } catch {
      throw new HttpException(
        'Failed to update store',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a store
  public async deleteStore(storeData) {
    try {
      if (!storeData.userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const store = await this.StorageRepository.findOne({
        where: { id: storeData.id },
        relations: ['products'],
      });

      if (!store) {
        throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
      }

      await this.StorageRepository.remove(store);
      this.logger.log(`Deleted store with ID ${store.id}`);
      return { message: 'Store and related products deleted successfully' };
    } catch {
      throw new HttpException(
        'Failed to delete store',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
