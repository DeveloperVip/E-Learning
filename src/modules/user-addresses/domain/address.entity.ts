import { UserEntity } from '@modules/users/domain/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('userAddresses')
export class UserAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullName: string; // Họ và tên

  @Column({ name: 'phone', type: 'varchar', length: 15, nullable: false })
  phone: string; // Số điện thoại

  @Column({ name: 'district', type: 'varchar', nullable: false })
  district: string; // Quận/Huyện

  @Column({ name: 'ward', type: 'varchar', nullable: false })
  ward: string; // Phường/Xã

  @Column({ name: 'specific_address', type: 'text', nullable: false })
  specificAddress: string; // Địa chỉ cụ thể

  @Column({
    name: 'address_type',
    type: 'enum',
    enum: ['private', 'company'],
    default: 'private',
  })
  addressType: 'private' | 'company'; // Loại địa chỉ: Nhà riêng hoặc Công ty

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean; // Địa chỉ mặc định

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
