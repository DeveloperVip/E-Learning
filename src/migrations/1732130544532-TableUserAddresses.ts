import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TableUserAddresses1732130544532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'userAddresses' table
    await queryRunner.createTable(
      new Table({
        name: 'userAddresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()', // Assuming PostgreSQL
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },
          {
            name: 'district',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'ward',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'specific_address',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'address_type',
            type: 'enum',
            enum: ['private', 'company'],
            isNullable: false,
            default: "'private'",
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
            isNullable: false,
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

    // Create foreign key for 'user_id' column referencing 'users' table
    await queryRunner.createForeignKey(
      'userAddresses',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('userAddresses');
    const foreignKeys = table.foreignKeys;
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('userAddresses', foreignKey);
    }

    // Drop 'userAddresses' table
    await queryRunner.dropTable('userAddresses');
  }
}
