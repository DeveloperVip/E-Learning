import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TableProduct1731379889045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'isArchived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isFeatured',
            type: 'boolean',
            default: false,
          },
          {
            name: 'store_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'brand_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'categories_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_deleted',
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
        ],
      }),
      true,
    );

    // Foreign Key for store_id
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Foreign Key for brand_id
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['brand_id'],
        referencedTableName: 'brands',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Foreign Key for categories_id
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['categories_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const foreignKeys = await queryRunner.getTable('products');

    // Drop Foreign Key for store_id
    const storeForeignKey = foreignKeys.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('store_id') !== -1,
    );
    if (storeForeignKey)
      await queryRunner.dropForeignKey('products', storeForeignKey);

    // Drop Foreign Key for brand_id
    const brandForeignKey = foreignKeys.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('brand_id') !== -1,
    );
    if (brandForeignKey)
      await queryRunner.dropForeignKey('products', brandForeignKey);

    // Drop Foreign Key for categories_id
    const categoryForeignKey = foreignKeys.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('categories_id') !== -1,
    );
    if (categoryForeignKey)
      await queryRunner.dropForeignKey('products', categoryForeignKey);

    // Drop the table
    await queryRunner.dropTable('products');
  }
}
