import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDepartmentSectionTables1743815123456 implements MigrationInterface {
  name = 'CreateDepartmentSectionTables1743815123456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 事業部テーブル作成
    await queryRunner.query(`
      CREATE TABLE "departments" (
        "id" varchar PRIMARY KEY NOT NULL,
        "code" varchar NOT NULL,
        "name" varchar NOT NULL,
        "display_order" integer NOT NULL DEFAULT (0),
        "is_active" boolean NOT NULL DEFAULT (1),
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // 事業部コード一意制約
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_DEPARTMENT_CODE" ON "departments" ("code")
    `);

    // 部テーブル作成
    await queryRunner.query(`
      CREATE TABLE "sections" (
        "id" varchar PRIMARY KEY NOT NULL,
        "department_id" varchar NOT NULL,
        "code" varchar NOT NULL,
        "name" varchar NOT NULL,
        "display_order" integer NOT NULL DEFAULT (0),
        "is_active" boolean NOT NULL DEFAULT (1),
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_SECTION_DEPARTMENT" FOREIGN KEY ("department_id") REFERENCES "departments" ("id")
      )
    `);

    // 部コード一意制約
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_SECTION_CODE" ON "sections" ("code")
    `);

    // 部の事業部IDインデックス
    await queryRunner.query(`
      CREATE INDEX "IDX_SECTION_DEPARTMENT" ON "sections" ("department_id")
    `);

    // プロジェクトテーブルに事業部と部の外部キーを追加
    await queryRunner.query(`
      ALTER TABLE "projects" ADD COLUMN "department_id" varchar
    `);

    await queryRunner.query(`
      ALTER TABLE "projects" ADD COLUMN "section_id" varchar
    `);
    
    // プロジェクトの事業部IDインデックス
    await queryRunner.query(`
      CREATE INDEX "IDX_PROJECT_DEPARTMENT" ON "projects" ("department_id")
    `);

    // プロジェクトの部IDインデックス
    await queryRunner.query(`
      CREATE INDEX "IDX_PROJECT_SECTION" ON "projects" ("section_id")
    `);

    // マスターデータ挿入：事業部
    await queryRunner.query(`
      INSERT INTO "departments" ("id", "code", "name", "display_order") VALUES
      ('1', 'DEV', '開発事業部', 10),
      ('2', 'SALES', '営業事業部', 20),
      ('3', 'ADMIN', '管理部門', 30),
      ('4', 'INFRA', 'インフラ事業部', 40),
      ('5', 'DX', 'DX推進事業部', 50)
    `);

    // マスターデータ挿入：部（開発事業部）
    await queryRunner.query(`
      INSERT INTO "sections" ("id", "department_id", "code", "name", "display_order") VALUES
      ('1', '1', 'DEV_WEB', 'Web開発部', 10),
      ('2', '1', 'DEV_APP', 'アプリ開発部', 20),
      ('3', '1', 'DEV_AI', 'AI開発部', 30)
    `);

    // マスターデータ挿入：部（営業事業部）
    await queryRunner.query(`
      INSERT INTO "sections" ("id", "department_id", "code", "name", "display_order") VALUES
      ('4', '2', 'SALES_EAST', '東日本営業部', 10),
      ('5', '2', 'SALES_WEST', '西日本営業部', 20),
      ('6', '2', 'SALES_PARTNER', 'パートナー営業部', 30)
    `);

    // マスターデータ挿入：部（管理部門）
    await queryRunner.query(`
      INSERT INTO "sections" ("id", "department_id", "code", "name", "display_order") VALUES
      ('7', '3', 'ADMIN_HR', '人事部', 10),
      ('8', '3', 'ADMIN_FIN', '財務部', 20),
      ('9', '3', 'ADMIN_GEN', '総務部', 30)
    `);

    // マスターデータ挿入：部（インフラ事業部）
    await queryRunner.query(`
      INSERT INTO "sections" ("id", "department_id", "code", "name", "display_order") VALUES
      ('10', '4', 'INFRA_NW', 'ネットワーク部', 10),
      ('11', '4', 'INFRA_SV', 'サーバー部', 20),
      ('12', '4', 'INFRA_SEC', 'セキュリティ部', 30)
    `);

    // マスターデータ挿入：部（DX推進事業部）
    await queryRunner.query(`
      INSERT INTO "sections" ("id", "department_id", "code", "name", "display_order") VALUES
      ('13', '5', 'DX_CONS', 'DXコンサルティング部', 10),
      ('14', '5', 'DX_DATA', 'データ分析部', 20),
      ('15', '5', 'DX_CLOUD', 'クラウド推進部', 30)
    `);

    // 既存のプロジェクト部署データを事業部・部に移行するためのデモ用クエリ
    // 実際の環境では、既存データの詳細な分析に基づいて適切な移行スクリプトを作成する必要があります
    await queryRunner.query(`
      UPDATE "projects" 
      SET "department_id" = CASE 
          WHEN "department" LIKE '%開発%' THEN '1'
          WHEN "department" LIKE '%営業%' THEN '2'
          WHEN "department" LIKE '%管理%' THEN '3'
          WHEN "department" LIKE '%インフラ%' THEN '4'
          WHEN "department" LIKE '%DX%' THEN '5'
          ELSE NULL
        END,
        "section_id" = CASE 
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
          ELSE NULL
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // プロジェクトからの外部キー削除
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_SECTION"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_DEPARTMENT"`);
    
    // 部と外部キー削除
    await queryRunner.query(`DROP INDEX "IDX_SECTION_DEPARTMENT"`);
    await queryRunner.query(`DROP INDEX "IDX_SECTION_CODE"`);
    await queryRunner.query(`DROP TABLE "sections"`);
    
    // 事業部削除
    await queryRunner.query(`DROP INDEX "IDX_DEPARTMENT_CODE"`);
    await queryRunner.query(`DROP TABLE "departments"`);
    
    // プロジェクトテーブルから列削除
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "section_id"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "department_id"`);
  }
}
