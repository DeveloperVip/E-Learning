import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { ProducstEntity } from '@modules/products/domain/products.entity';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { ColorEntity } from '@modules/color-variant/domain/color.entity';
import { SizeEntity } from '@modules/size-variant/domain/size.entity';
import { ImageEntity } from './image.entity';
import { OrderItemEntity } from '@modules/order-items/domain/orderItem.entity';
@Entity('variants')
export class ProductVariantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', default: 0 })
  price: number;

  @Column({ name: 'remaining_quantity', type: 'int' })
  remainingQuantity: number;

  @Column({ name: 'quantity_sold', type: 'int' })
  quantitySold: number;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'color_id', type: 'uuid' })
  colorId: string;

  @Column({ name: 'size_id', type: 'uuid' }) // Corrected name from 'store_id' to 'size_id'
  sizeId: string;

  @ManyToOne(() => ProducstEntity, (product) => product.productVariants)
  @JoinColumn({ name: 'product_id' })
  product: ProducstEntity;

  @ManyToOne(() => ColorEntity, (color) => color.productVariants)
  @JoinColumn({ name: 'color_id' })
  color: ColorEntity;

  @ManyToOne(() => SizeEntity, (size) => size.productVariants)
  @JoinColumn({ name: 'size_id' })
  size: SizeEntity;

  @ManyToOne(() => StoreEntity, (store) => store.productVariants)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => ImageEntity, (image) => image.productVariant, {
    cascade: true,
  })
  images: ImageEntity[];

  @OneToMany(() => OrderItemEntity, (orderItems) => orderItems.product)
  orderItems: OrderItemEntity[];

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
