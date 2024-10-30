import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IProducts } from './products.model';

@Entity('products')
export class ProducstEntity extends BaseEntity implements IProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  origin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  color?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  size?: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'remaining_quantity', type: 'int' })
  remainingQuantity: number;

  @Column({ name: 'quantity_sold', type: 'int' })
  quantitySold: number;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageURL: string;

  @Column({ type: 'int' })
  price: number;
}
