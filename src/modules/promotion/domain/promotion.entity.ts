import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';
import { BrandEntity } from '@modules/brand/domain/brand.entity';
import { CategoryEntity } from '@modules/categories/domain/categories.entity';
import { ProducstEntity } from '@modules/products/domain/products.entity';
import { StoreEntity } from '@modules/store/domain/store.entity';

@Entity('promotions')
export class PromotionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'enum', enum: ['percent', 'fixed', 'free_shipping'] })
  type: 'percent' | 'fixed' | 'free_shipping';

  @Column({ type: 'numeric', nullable: true })
  discountValue: number; // Giá trị giảm (phần trăm hoặc cố định)

  @Column({ type: 'int', nullable: true })
  maxQuantity: number; // Giới hạn số lượng sản phẩm được áp dụng khuyến mại

  @Column({ type: 'int', default: 0 })
  appliedQuantity: number; // Số lượng đã áp dụng khuyến mại

  @Column({ type: 'boolean', default: false })
  isGlobal: boolean; // Khuyến mại áp dụng toàn cục

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Trạng thái của khuyến mại (hoạt động hay không)

  // Quan hệ với ProductVariant
  @ManyToMany(() => ProductVariantEntity, (variant) => variant.promotions, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariantEntity[];

  // Quan hệ với Product
  @ManyToOne(() => ProducstEntity, (product) => product.promotions, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: ProducstEntity;

  // Quan hệ với Brand
  @ManyToOne(() => BrandEntity, (brand) => brand.promotions, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @ManyToOne(() => StoreEntity, (store) => store.promotions, { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  // Quan hệ với Category
  @ManyToOne(() => CategoryEntity, (category) => category.promotions, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
