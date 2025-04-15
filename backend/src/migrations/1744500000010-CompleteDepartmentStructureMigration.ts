import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteDepartmentStructureMigration1744500000010 implements MigrationInterface {
  name = 'CompleteDepartmentStructureMigration1744500000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 最終的な移行処理 - 旧departmentカラムの値を使って、まだ設定されていないdepartmentIdとsectionIdを設定
    await queryRunner.query(`
      UPDATE "projects" 
      SET "department_id" = CASE 
          WHEN "department" LIKE '%開発%' THEN '1'
          WHEN "department" LIKE '%営業%' THEN '2'
          WHEN "department" LIKE '%管理%' THEN '3'
          WHEN "department" LIKE '%インフラ%' THEN '4'
          WHEN "department" LIKE '%DX%' THEN '5'
          ELSE '1'
        END
      WHERE "department_id" IS NULL
    `);

    await queryRunner.query(`
      UPDATE "projects" 
      SET "section_id" = CASE 
          WHEN "department" LIKE '%Web%' THEN '1'
          WHEN "department" LIKE '%アプリ%' THEN '2'
          WHEN "department" LIKE '%AI%' THEN '3'
          WHEN "department" LIKE '%東日本%' THEN '4'
          WHEN "department" LIKE '%西日本%' THEN '5'
          WHEN "department" LIKE '%パートナー%' THEN '6'
          WHEN "department" LIKE '%人事%' THEN '7'
          WHEN "department" LIKE '%財務%' THEN '8'
          WHEN "department" LIKE '%総務%' THEN '9'
          WHEN "department" LIKE '%ネットワーク%' THEN '10'
          WHEN "department" LIKE '%サーバー%' THEN '11'
          WHEN "department" LIKE '%セキュリティ%' THEN '12'
          WHEN "department" LIKE '%コンサル%' THEN '13'
          WHEN "department" LIKE '%データ%' THEN '14'
          WHEN "department" LIKE '%クラウド%' THEN '15'
          ELSE '1'
        END
      WHERE "section_id" IS NULL
    `);

    // department_idとsection_idをNOT NULL制約に変更
    await queryRunner.query(`
      ALTER TABLE "projects" 
      ALTER COLUMN "department_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "projects" 
      ALTER COLUMN "section_id" SET NOT NULL
    `);

    // 旧departmentカラムを削除
    await queryRunner.query(`
      ALTER TABLE "projects" 
      DROP COLUMN "department"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 旧departmentカラムを復元
    await queryRunner.query(`
      ALTER TABLE "projects" 
      ADD COLUMN "department" varchar
    `);

    // department_idとsection_idのNOT NULL制約を解除
    await queryRunner.query(`
      ALTER TABLE "projects" 
      ALTER COLUMN "department_id" DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "projects" 
      ALTER COLUMN "section_id" DROP NOT NULL
    `);

    // 旧departmentカラムに値を復元
    await queryRunner.query(`
      UPDATE "projects" p
      SET "department" = (
        SELECT d.name || ' ' || s.name
        FROM "departments" d
        JOIN "sections" s ON s.department_id = d.id
        WHERE d.id = p.department_id AND s.id = p.section_id
      )
    `);
  }
}
