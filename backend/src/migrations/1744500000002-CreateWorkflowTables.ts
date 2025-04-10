import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkflowTables1744500000002 implements MigrationInterface {
    name = 'CreateWorkflowTables1744500000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 申請履歴（request_histories）テーブルの作成
        await queryRunner.query(`
            CREATE TABLE "request_histories" (
                "id" varchar PRIMARY KEY NOT NULL,
                "project_id" varchar NOT NULL,
                "requester_id" varchar NOT NULL,
                "request_type" varchar NOT NULL,
                "request_status" varchar NOT NULL DEFAULT '承認待ち',
                "request_date" datetime NOT NULL,
                "approver_id" varchar,
                "approval_date" datetime,
                "rejection_reason" text,
                "remarks" text,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_request_histories_project_id" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_request_histories_requester_id" FOREIGN KEY ("requester_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_request_histories_approver_id" FOREIGN KEY ("approver_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `);

        // インデックスの作成
        await queryRunner.query(`
            CREATE INDEX "IDX_request_histories_project_id" ON "request_histories" ("project_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_request_histories_requester_id" ON "request_histories" ("requester_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_request_histories_request_status" ON "request_histories" ("request_status")
        `);

        // プロジェクトテーブルに承認関連のカラムを追加
        await queryRunner.query(`
            ALTER TABLE "projects" 
            ADD COLUMN "approval_status" varchar DEFAULT '下書き'
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            ADD COLUMN "approver_id" varchar
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            ADD COLUMN "approval_date" datetime
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            ADD COLUMN "rejection_reason" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // プロジェクトテーブルから追加したカラムを削除
        await queryRunner.query(`
            ALTER TABLE "projects" 
            DROP COLUMN "rejection_reason"
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            DROP COLUMN "approval_date"
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            DROP COLUMN "approver_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            DROP COLUMN "approval_status"
        `);

        // インデックスの削除
        await queryRunner.query(`
            DROP INDEX "IDX_request_histories_request_status"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_request_histories_requester_id"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_request_histories_project_id"
        `);

        // テーブルの削除
        await queryRunner.query(`
            DROP TABLE "request_histories"
        `);
    }
}
