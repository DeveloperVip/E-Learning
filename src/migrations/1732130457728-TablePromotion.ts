import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TablePromotion1732130457728 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'promotions' table
    await queryRunner.createTable(
      new Table({
        name: 'promotions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()', // Assuming PostgreSQL
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'startDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'endDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['percent', 'fixed', 'free_shipping'],
            isNullable: false,
          },
          {
            name: 'discountValue',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'maxQuantity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'appliedQuantity',
            type: 'int',
            default: 0,
          },
          {
            name: 'isGlobal',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'product_variant_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'brand_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'store_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
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
      true, // If true, it will create the table if it doesn't exist
    );

    // Create foreign keys for relationships
    await queryRunner.createForeignKey(
      'promotions',
      new TableForeignKey({
        columnNames: ['product_variant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product_variants',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'promotions',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'promotions',
      new TableForeignKey({
        columnNames: ['brand_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'brands',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'promotions',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'stores',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'promotions',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const table = await queryRunner.getTable('promotions');
    const foreignKeys = table.foreignKeys;
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('promotions', foreignKey);
    }

    // Drop 'promotions' table
    await queryRunner.dropTable('promotions');
  }
}
