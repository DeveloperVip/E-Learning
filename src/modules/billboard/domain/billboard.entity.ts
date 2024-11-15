import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IBillboard } from './billboard.model';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { CategoryEntity } from '@modules/categories/domain/categories.entity';

@Entity('billboards')
export class BillboardEntity extends BaseEntity implements IBillboard {
  @Column({ name: 'store_id', type: 'uuid', nullable: false })
  storeId: string;

  @PrimaryGeneratedColumn('uuid') // Sử dụng UUID cho ID của bảng billboard
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  label: string; // Tên của billboard

  @ManyToOne(() => StoreEntity, (store) => store.billboards)
  @JoinColumn({ name: 'store_id' }) // Chỉ định tên cột khóa ngoại trong bảng billboard
  store: StoreEntity; // Mối quan hệ với Store

  @OneToMany(() => CategoryEntity, (categories) => categories.billboard)
  categories: CategoryEntity[];

  @Column({ type: 'varchar', nullable: false })
  imageUrl: string; // Đường dẫn tới hình ảnh của billboard

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
