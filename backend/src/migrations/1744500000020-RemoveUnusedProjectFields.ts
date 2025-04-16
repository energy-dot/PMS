import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveUnusedProjectFields1744500000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 未使用フィールドの削除
    await queryRunner.dropColumn('projects', 'approval_status');
    await queryRunner.dropColumn('projects', 'approver_id');
    await queryRunner.dropColumn('projects', 'approval_date');
    await queryRunner.dropColumn('projects', 'required_experience');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ロールバック時に削除したフィールドを復元
    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'approval_status',
        type: 'varchar',
        isNullable: true,
        default: "'承認待ち'",
      }),
    );

    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'approver_id',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'approval_date',
        type: 'datetime',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'required_experience',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
