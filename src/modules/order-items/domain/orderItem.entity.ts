import { CartEntity } from '@modules/cart/domain/cart.entity';
import { OrderEntity } from '@modules/order/domain/order.entity';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

// Định nghĩa các trạng thái của OrderItem
export enum OrderItemStatus {
  IN_CART = 'in cart',
  ORDERING = 'ordering',
  PAID = 'paid',
}

@Entity('orderItems')
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  // Cập nhật cột status để sử dụng enum
  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.IN_CART,
  })
  status: OrderItemStatus;

  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId: string | null;

  @Column({ name: 'card_id', type: 'uuid', nullable: true })
  cartId: string | null;

  @Column({ type: 'numeric', default: 0 })
  price: number;

  @Column({ type: 'int' })
  amount: number;

  @ManyToOne(() => ProductVariantEntity, (variant) => variant.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: ProductVariantEntity;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    cascade: true,
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.orderItems, {
    cascade: true,
  })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
