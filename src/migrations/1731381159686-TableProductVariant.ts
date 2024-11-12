import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductVariantTable1630503939443
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'variant' table
    await queryRunner.createTable(
      new Table({
        name: 'variants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'price',
            type: 'numeric',
          },
          {
            name: 'remaining_quantity',
            type: 'int',
          },
          {
            name: 'quantity_sold',
            type: 'int',
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_featured',
            type: 'boolean',
            default: false,
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
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'color_id',
            type: 'uuid',
          },
          {
            name: 'size_id',
            type: 'uuid',
          },
          {
            name: 'store_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Add foreign keys for the relationships
    await queryRunner.createForeignKey(
      'variants',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'variants',
      new TableForeignKey({
        columnNames: ['color_id'],
        referencedTableName: 'colors',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'variants',
      new TableForeignKey({
        columnNames: ['size_id'],
        referencedTableName: 'sizes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'variants',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign keys before dropping the table
    const table = await queryRunner.getTable('variants');
    const foreignKeyStore = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('store_id') !== -1,
    );
    const foreignKeyProduct = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_id') !== -1,
    );
    const foreignKeyColor = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('color_id') !== -1,
    );
    const foreignKeySize = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('size_id') !== -1,
    );

    if (foreignKeyProduct) {
      await queryRunner.dropForeignKey('variants', foreignKeyProduct);
    }
    if (foreignKeyStore) {
      await queryRunner.dropForeignKey('variants', foreignKeyStore);
    }
    if (foreignKeyColor) {
      await queryRunner.dropForeignKey('variants', foreignKeyColor);
    }
    if (foreignKeySize) {
      await queryRunner.dropForeignKey('variants', foreignKeySize);
    }

    // Drop the 'variant' table
    await queryRunner.dropTable('variants');
  }
}
