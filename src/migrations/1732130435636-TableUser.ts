import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUser1732130435636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'users' table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()', // Assuming PostgreSQL
          },
          {
            name: 'user_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'confirmation_code',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'is_confirmed',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'user', 'store'],
            default: "'user'", // Default to 'user'
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

    // Add foreign keys for related tables if needed (e.g., user has related tables like store, order, etc.)
    // This part assumes you have foreign keys pointing to this users table (e.g., store, order, etc.)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop 'users' table in case of rollback
    await queryRunner.dropTable('users');
  }
}
