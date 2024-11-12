import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductVariantEntity } from './variant.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(
    () => ProductVariantEntity,
    (productVariant) => productVariant.images,
  )
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariantEntity;
}
