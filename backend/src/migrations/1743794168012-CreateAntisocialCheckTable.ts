import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAntisocialCheckTable1743794168012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'antisocial_checks',
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
            name: 'checkDate',
            type: 'timestamp',
          },
          {
            name: 'checkedBy',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'checkMethod',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'result',
            type: 'varchar',
            default: "'要確認'",
          },
          {
            name: 'expiryDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'documentFile',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'remarks',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
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
      'antisocial_checks',
      new TableForeignKey({
        columnNames: ['partnerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partners',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('antisocial_checks');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('partnerId') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('antisocial_checks', foreignKey);
      }
    }
    await queryRunner.dropTable('antisocial_checks');
  }
}
