import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IProducts } from './products.model';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import { CategoryEntity } from '@modules/categories/domain/categories.entity';
import { BrandEntity } from '@modules/brand/domain/brand.entity';

@Entity('products')
export class ProducstEntity extends BaseEntity implements IProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  // @Column({ type: 'uuid', length: 255 })
  // storeId: string;

  @ManyToOne(() => StoreEntity, (store) => store.products)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: CategoryEntity;

  @ManyToOne(() => CategoryEntity, (categories) => categories.products)
  @JoinColumn({ name: 'categories_id' })
  categories: CategoryEntity;

  @OneToMany(
    () => ProductVariantEntity,
    (productVariant) => productVariant.product,
    {
      cascade: true,
    },
  )
  productVariants: ProductVariantEntity[];

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
