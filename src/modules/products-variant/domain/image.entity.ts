import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductVariantEntity } from './variant.entity';
// import { StoreEntity } from '@modules/store/domain/store.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  url: string;

  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @Column({ name: 'product_variant_id', type: 'varchar' })
  productVariantId: string;

  @ManyToOne(
    () => ProductVariantEntity,
    (productVariant) => productVariant.images,
  )
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariantEntity;

  // @ManyToOne(() => StoreEntity, (store) => store.products)
  // @JoinColumn({ name: 'store_id' })
  // store: StoreEntity;
}
