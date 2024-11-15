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
import { IStore } from './store.model';
import { UserEntity } from '@modules/users/domain/users.entity';
import { ProducstEntity } from '@modules/products/domain/products.entity';
import { BillboardEntity } from '@modules/billboard/domain/billboard.entity';
import { CategoryEntity } from '@modules/categories/domain/categories.entity';
import { BrandEntity } from '@modules/brand/domain/brand.entity';
import { ColorEntity } from '@modules/color-variant/domain/color.entity';
import { SizeEntity } from '@modules/size-variant/domain/size.entity';
import { ProductVariantEntity } from '@modules/products-variant/domain/variant.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity implements IStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.store)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ProducstEntity, (product) => product.store, {
    cascade: true,
  })
  products: ProducstEntity[];

  @OneToMany(() => BillboardEntity, (billboard) => billboard.store, {
    cascade: true,
  })
  billboards: BillboardEntity[];

  @OneToMany(() => CategoryEntity, (categories) => categories.store, {
    cascade: true,
  })
  categories: CategoryEntity[];

  @OneToMany(() => ColorEntity, (color) => color.store, {
    cascade: true,
  })
  colors: ColorEntity[];

  @OneToMany(
    () => ProductVariantEntity,
    (productvariant) => productvariant.store,
    {
      cascade: true,
    },
  )
  productVariants: ProductVariantEntity[];

  @OneToMany(() => SizeEntity, (sizes) => sizes.store, {
    cascade: true,
  })
  sizes: SizeEntity[];

  @OneToMany(() => BrandEntity, (brand) => brand.store, {
    cascade: true,
  })
  brands: BrandEntity[];

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
