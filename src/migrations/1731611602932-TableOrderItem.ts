import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TableOrderItem1731611602932 implements MigrationInterface {
  private foreignKeyOrder = new TableForeignKey({
    columnNames: ['order_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'orders',
    onDelete: 'CASCADE', // If the order is deleted, delete the order items as well
  });

  private foreignKeyProduct = new TableForeignKey({
    columnNames: ['product_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'productVariants',
    onDelete: 'SET NULL',
  });

  private foreignKeyCart = new TableForeignKey({
    columnNames: ['cart_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'carts',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orderItems',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'cart_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'numeric',
            default: '0',
          },
          {
            name: 'amount',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['in cart', 'ordering', 'paid'],
            default: "'in cart'",
          },
          {
            name: 'create_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'update_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key for 'order_id' column
    await queryRunner.createForeignKey('orderItems', this.foreignKeyOrder);

    // Add foreign key for 'product_id' column
    await queryRunner.createForeignKey('orderItems', this.foreignKeyProduct);

    // Add foreign key for 'cart_id' column
    await queryRunner.createForeignKey('orderItems', this.foreignKeyCart);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.dropForeignKey('orderItems', this.foreignKeyOrder);
    await queryRunner.dropForeignKey('orderItems', this.foreignKeyProduct);
    await queryRunner.dropForeignKey('orderItems', this.foreignKeyCart);

    // Drop the 'orderItems' table
    await queryRunner.dropTable('orderItems');
  }
}
