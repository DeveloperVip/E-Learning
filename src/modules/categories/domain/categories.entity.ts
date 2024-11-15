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
import { BillboardEntity } from '@modules/billboard/domain/billboard.entity';
import { ProducstEntity } from '@modules/products/domain/products.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @Column({ name: 'billboard_id', type: 'uuid' })
  billboardId: string;

  @ManyToOne(() => StoreEntity, (store) => store.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => BillboardEntity, (billboard) => billboard.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billboard_id' })
  billboard: BillboardEntity;

  @OneToMany(() => ProducstEntity, (product) => product.categories, {
    onDelete: 'CASCADE',
  })
  products: ProducstEntity[];

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
