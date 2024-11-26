import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from './domain/address.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private readonly userAddressRepository: Repository<UserAddressEntity>,
  ) {}

  async create(
    userId: string,
    addressData: Partial<UserAddressEntity>,
  ): Promise<UserAddressEntity> {
    if (addressData.isDefault) {
      // Nếu địa chỉ mới là mặc định, cập nhật các địa chỉ khác của user thành không mặc định
      await this.userAddressRepository.update(
        { user: { id: userId } },
        { isDefault: false },
      );
    }
    const newAddress = this.userAddressRepository.create({
      ...addressData,
      user: { id: userId }, // Thêm liên kết với user
    });
    return this.userAddressRepository.save(newAddress);
  }

  async findAll(userId: string): Promise<UserAddressEntity[]> {
    return this.userAddressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' }, // Sắp xếp địa chỉ mặc định lên đầu
    });
  }

  async findOne(id: string): Promise<UserAddressEntity> {
    const address = await this.userAddressRepository.findOne({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    return address;
  }

  async update(
    id: string,
    updateData: Partial<UserAddressEntity>,
  ): Promise<UserAddressEntity> {
    const address = await this.findOne(id);

    if (updateData.isDefault) {
      // Nếu cập nhật địa chỉ thành mặc định, cần cập nhật các địa chỉ khác của user thành không mặc định
      await this.userAddressRepository.update(
        { user: { id: address.user.id } },
        { isDefault: false },
      );
    }

    Object.assign(address, updateData); // Gán dữ liệu mới
    return this.userAddressRepository.save(address);
  }

  async delete(id: string): Promise<void> {
    const address = await this.findOne(id);
    await this.userAddressRepository.remove(address);
  }
}
