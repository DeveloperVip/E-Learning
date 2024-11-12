import { StoreEntity } from '@modules/store/domain/store.entity';
import { ISize } from './size.model';
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
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';

@Entity('sizes')
export class SizeEntity extends BaseEntity implements ISize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoreEntity, (store) => store.sizes)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(
    () => ProductVariantEntity,
    (productVariant) => productVariant.size,
    {
      cascade: true,
    },
  )
  productVariants: ProductVariantEntity[];

  // @Column({ name: 'store_id', type: 'uuid', nullable: false })
  // storeId: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

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
