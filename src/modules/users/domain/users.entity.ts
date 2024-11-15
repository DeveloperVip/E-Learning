import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUser } from './users.model';
import { Matches, MaxLength, MinLength } from 'class-validator';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { OrderEntity } from '@modules/order/domain/order.entity';
import { CartEntity } from '@modules/cart/domain/cart.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name', nullable: false, type: 'varchar' })
  userName: string;

  @Column({ name: 'full_name', nullable: false, type: 'varchar' })
  fullName: string;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ name: 'confirmation_code', type: 'numeric', default: 0 })
  confirmationCode: number;
  @Column({ name: 'is_confirmed', type: 'boolean' })
  isConfirmed: boolean;

  @Column({ nullable: false, type: 'varchar' })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,} $/)
  password: string;

  @OneToMany(() => StoreEntity, (store) => store.user, {
    cascade: true,
  })
  store: StoreEntity[];

  @OneToMany(() => OrderEntity, (order) => order.orderItems, {
    cascade: true,
  })
  order: OrderEntity[];

  @OneToMany(() => CartEntity, (carts) => carts.user, {
    cascade: true,
  })
  carts: CartEntity[];
}
