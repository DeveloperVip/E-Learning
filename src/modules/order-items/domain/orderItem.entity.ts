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

// Define the possible states of the OrderItem
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

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.IN_CART,
  })
  status: OrderItemStatus;

  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId: string | null;

  @Column({ name: 'cart_id', type: 'uuid', nullable: true })
  cartId: string | null;

  @Column({ type: 'numeric', default: 0 })
  price: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ name: 'promotion', type: 'int', nullable: true })
  promotion: number;

  @Column({ name: 'expired', type: 'boolean', default: false })
  expired: boolean;

  @Column({ name: 'choosen', type: 'boolean', default: false })
  choosen: boolean;

  // Add a new column for shipping fee
  @Column({ name: 'shipping_fee', type: 'numeric', default: 0 })
  shippingFee: number; // Shipping fee for this item

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
