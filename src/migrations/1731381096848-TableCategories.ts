import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCategoryTable1630503939443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'categories' table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
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
          {
            name: 'billboard_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Add foreign key for 'store_id'
    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for 'billboard_id'
    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['billboard_id'],
        referencedTableName: 'billboards',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign keys before dropping the table
    const table = await queryRunner.getTable('categories');
    const foreignKeyStore = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('store_id') !== -1,
    );
    const foreignKeyBillboard = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('billboard_id') !== -1,
    );
    if (foreignKeyStore) {
      await queryRunner.dropForeignKey('categories', foreignKeyStore);
    }
    if (foreignKeyBillboard) {
      await queryRunner.dropForeignKey('categories', foreignKeyBillboard);
    }

    // Drop the 'categories' table
    await queryRunner.dropTable('categories');
  }
}
