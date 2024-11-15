import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TableOrder1731611596514 implements MigrationInterface {
  private foreignKey = new TableForeignKey({
    columnNames: ['user_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE',
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'orders' table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['in_progress', 'delivered', 'not_paid'],
            default: "'not_paid'",
          },
          {
            name: 'phone',
            type: 'numeric',
            default: '0',
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 20,
            scale: 2,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'order_code',
            type: 'varchar',
            default: null,
          },
          {
            name: 'payment_method',
            type: 'enum',
            enum: ['cash', 'bank_transfer', 'linked_wallet'],
            default: `'cash'`,
          },
          {
            name: 'promotion',
            type: 'decimal',
            precision: 20,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key for 'user_id' column
    await queryRunner.createForeignKey('orders', this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    await queryRunner.dropForeignKey('orders', this.foreignKey);

    // Drop the 'orders' table
    await queryRunner.dropTable('orders');
  }
}
