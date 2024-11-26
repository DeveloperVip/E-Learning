import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUser } from './users.model';
import { Matches, MaxLength, MinLength } from 'class-validator';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { OrderEntity } from '@modules/order/domain/order.entity';
import { CartEntity } from '@modules/cart/domain/cart.entity';
import { UserAddressEntity } from '@modules/user-addresses/domain/address.entity';
import { LinkedWalletEntity } from '@modules/wallet/domain/wallet.entity';

// Enum for roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  STORE = 'store',
}

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

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ nullable: false, type: 'varchar' })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole; // User role column

  @OneToMany(() => StoreEntity, (store) => store.user, {
    cascade: true,
  })
  store: StoreEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user, {
    cascade: true,
  })
  order: OrderEntity[];

  @OneToMany(() => UserAddressEntity, (addresses) => addresses.user, {
    cascade: true,
  })
  addresses: UserAddressEntity[];

  @OneToMany(() => LinkedWalletEntity, (wallet) => wallet.user, {
    cascade: true,
  })
  linkedWallets: LinkedWalletEntity[];

  @OneToOne(() => CartEntity, (carts) => carts.user, {
    cascade: true,
  })
  carts: CartEntity[];
}
