import { UserEntity } from '@modules/users/domain/users.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('linked_wallets')
export class LinkedWalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'card_number', type: 'varchar', nullable: false })
  cardNumber: string; // Lưu số thẻ đã được mã hóa hoặc ẩn đi

  @Column({ name: 'card_holder_name', type: 'varchar', nullable: false })
  cardHolderName: string; // Tên chủ thẻ

  @Column({ name: 'expiry_date', type: 'varchar', nullable: false })
  expiryDate: string; // Ngày hết hạn (MM/YYYY)

  @Column({ name: 'bank_name', type: 'varchar', nullable: true })
  bankName: string; // Tên ngân hàng (nếu có)

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean; // Xác định thẻ mặc định

  @ManyToOne(() => UserEntity, (user) => user.linkedWallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
