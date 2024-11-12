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
import { IColor } from './color.model';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';

@Entity('colors')
export class ColorEntity extends BaseEntity implements IColor {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => StoreEntity, (store) => store.colors, { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
  // @Column({ name: 'store_id', type: 'uuid' })
  // storeId: string;
  @Column({ name: 'name', type: 'varchar' })
  name: string;
  @Column({ name: 'value', type: 'varchar' })
  value: string;

  @OneToMany(
    () => ProductVariantEntity,
    (productVariant) => productVariant.color,
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
