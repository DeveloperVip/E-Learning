import { OrderItemEntity } from '@modules/order-items/domain/orderItem.entity';
import { UserEntity } from '@modules/users/domain/users.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  // ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('carts')
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderitem) => orderitem.cart)
  orderItems: OrderItemEntity[];

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  total: number;

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
