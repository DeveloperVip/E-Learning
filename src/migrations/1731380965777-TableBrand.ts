import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBrandTable1624567891234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'brands' table
    await queryRunner.createTable(
      new Table({
        name: 'brands',
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
            isNullable: false,
          },
          {
            name: 'store_id',
            type: 'uuid',
            isNullable: false,
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
            name: 'store_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Add foreign key for 'store_id'
    await queryRunner.createForeignKey(
      'brands',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key before dropping the table
    const table = await queryRunner.getTable('brands');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('store_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('brands', foreignKey);
    }

    // Drop the 'brands' table
    await queryRunner.dropTable('brands');
  }
}
