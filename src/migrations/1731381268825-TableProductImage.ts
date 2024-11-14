import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateImageTable1630503939444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'image' table
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'url',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'product_variant_id',
            type: 'uuid',
          },
          {
            name: 'store_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add foreign key to link the image to a product variant
    await queryRunner.createForeignKey(
      'images',
      new TableForeignKey({
        columnNames: ['product_variant_id'],
        referencedTableName: 'variants', // Ensure 'variant' is the correct name of the table for ProductVariantEntity
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sizes',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key
    const table = await queryRunner.getTable('images');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_variant_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('images', foreignKey);
    }

    // Drop the 'image' table
    await queryRunner.dropTable('images');
  }
}
