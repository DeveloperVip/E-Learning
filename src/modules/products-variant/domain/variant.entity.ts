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
// import { StoreEntity } from '@modules/store/domain/store.entity';
import { ColorEntity } from '@modules/color-variant/domain/color.entity';
import { SizeEntity } from '@modules/size-variant/domain/size.entity';
import { ImageEntity } from './image.entity';
import { StoreEntity } from '@modules/store/domain/store.entity';

@Entity('variants')
export class ProductVariantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  //   @Column({ type: 'varchar', length: 255, nullable: true })
  //   origin?: string;

  @Column({ name: 'remaining_quantity', type: 'int' })
  remainingQuantity: number;

  @Column({ name: 'quantity_sold', type: 'int' })
  quantitySold: number;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => ProducstEntity, (product) => product.productVariants)
  @JoinColumn({ name: 'product_id' })
  product: ProducstEntity;

  @ManyToOne(() => ColorEntity, (color) => color.productVariants)
  @JoinColumn({ name: 'color_id' })
  color: ColorEntity;

  @ManyToOne(() => SizeEntity, (size) => size.productVariants)
  @JoinColumn({ name: 'size_id' })
  size: SizeEntity;

  //   @ManyToOne(() => Storage, (storage) => storage.variants)
  //   @JoinColumn({ name: 'storageId' })
  //   storage: Storage;

  @ManyToOne(() => StoreEntity, (store) => store.productVariants)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => ImageEntity, (image) => image.productVariant, {
    cascade: true,
  })
  images: ImageEntity[];

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
