import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vat_invoices')
export class VatInvoiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name', type: 'varchar', nullable: false })
  companyName: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({ name: 'tax_code', type: 'varchar', nullable: false })
  taxCode: string;

  @Column({ name: 'company_address', type: 'varchar', nullable: false })
  companyAddress: string;

  @Column({ name: 'order_id', type: 'uuid', nullable: false })
  orderId: string;

  @Column({ name: 'vat', type: 'decimal', precision: 5, scale: 2, default: 0 })
  vat: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
