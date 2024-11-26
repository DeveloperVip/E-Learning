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
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  LINKED_WALLET = 'linked_wallet',
}

export enum OrderStatus {
  IN_PROGRESS = 'in_progress', // Đang giao hàng
  DELIVERED = 'delivered', // Giao hàng thành công
  NOT_PAID = 'not_paid', // Chưa thanh toán
  CANCEL = 'cancel', // Đơn hàng bị hủy
}

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  vat?: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NOT_PAID,
  })
  status: OrderStatus;

  @Column({ type: 'numeric', default: 0, nullable: true })
  phone: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  total: number;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'order_code', type: 'varchar', default: null })
  orderCode: string;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  shippingFee: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({ name: 'promotion', type: 'decimal', precision: 20, scale: 2 })
  promotion: number;

  @ManyToOne(() => UserEntity, (user) => user.store)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

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
