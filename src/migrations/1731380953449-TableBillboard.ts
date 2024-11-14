import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBillboardTable1624567891234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'billboard' table
    await queryRunner.createTable(
      new Table({
        name: 'billboards',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'label',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'imageUrl',
            type: 'varchar',
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
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add the foreign key to 'store_id'
    await queryRunner.createForeignKey(
      'billboards',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE', // or 'SET NULL' depending on your use case
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key before dropping the table
    const table = await queryRunner.getTable('billboards');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('store_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('billboards', foreignKey);
    }

    // Drop the 'billboard' table
    await queryRunner.dropTable('billboards');
  }
}
