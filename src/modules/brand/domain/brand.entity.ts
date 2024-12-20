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
import { StoreEntity } from '@modules/store/domain/store.entity';
import { ProducstEntity } from '@modules/products/domain/products.entity';
import { PromotionEntity } from '@modules/promotion/domain/promotion.entity';

@Entity('brands')
export class BrandEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @ManyToOne(() => StoreEntity, (store) => store.brands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => ProducstEntity, (product) => product.brand, {
    onDelete: 'CASCADE',
  })
  products: ProducstEntity[];

  @OneToMany(() => PromotionEntity, (promotion) => promotion.brand, {
    cascade: true,
  })
  promotions: PromotionEntity[];

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
