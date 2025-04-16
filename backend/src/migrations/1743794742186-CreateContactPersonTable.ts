import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateContactPersonTable1743794742186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contact_persons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'partnerId',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'position',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'department',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mobilePhone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            default: "'営業担当'",
          },
          {
            name: 'remarks',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'preferredContactMethod',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'contact_persons',
      new TableForeignKey({
        columnNames: ['partnerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partners',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('contact_persons');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('partnerId') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('contact_persons', foreignKey);
      }
    }
    await queryRunner.dropTable('contact_persons');
  }
}
