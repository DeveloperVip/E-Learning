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
  ManyToMany,
} from 'typeorm';
import { ProducstEntity } from '@modules/products/domain/products.entity';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { ColorEntity } from '@modules/color-variant/domain/color.entity';
import { SizeEntity } from '@modules/size-variant/domain/size.entity';
import { ImageEntity } from './image.entity';
import { OrderItemEntity } from '@modules/order-items/domain/orderItem.entity';
import { PromotionEntity } from '@modules/promotion/domain/promotion.entity';

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

  @Column({ name: 'size_id', type: 'uuid' })
  sizeId: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'enum', enum: ['fixed', 'percent'], default: 'fixed' })
  promotionType: 'fixed' | 'percent'; // Loại khuyến mãi

  @Column({ type: 'numeric', default: 0 })
  promotionValue: number; // Giá trị khuyến mãi

  @Column({ type: 'numeric', default: 0 })
  discountPrice: number; // Giá sau khuyến mãi

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

  @ManyToMany(() => PromotionEntity, (promotion) => promotion.productVariant, {
    cascade: true,
  })
  promotions: PromotionEntity[];

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
