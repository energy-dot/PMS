import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApplicationTables1744500000001 implements MigrationInterface {
    name = 'CreateApplicationTables1744500000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 応募者（applications）テーブルの作成
        await queryRunner.query(`
            CREATE TABLE "applications" (
                "id" varchar PRIMARY KEY NOT NULL,
                "project_id" varchar NOT NULL,
                "partner_id" varchar NOT NULL,
                "contact_person_id" varchar,
                "applicant_name" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "nearest_station" varchar,
                "desired_rate" varchar,
                "skill_summary" text,
                "skill_sheet_url" varchar,
                "application_date" datetime NOT NULL,
                "application_source" varchar,
                "status" varchar NOT NULL DEFAULT '新規応募',
                "document_screener_id" varchar,
                "document_screening_comment" text,
                "final_result_notification_date" datetime,
                "remarks" text,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_applications_project_id" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_applications_partner_id" FOREIGN KEY ("partner_id") REFERENCES "partners" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_applications_contact_person_id" FOREIGN KEY ("contact_person_id") REFERENCES "contact_persons" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT "FK_applications_document_screener_id" FOREIGN KEY ("document_screener_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `);

        // 面談記録（interview_records）テーブルの作成
        await queryRunner.query(`
            CREATE TABLE "interview_records" (
                "id" varchar PRIMARY KEY NOT NULL,
                "application_id" varchar NOT NULL,
                "interview_date" datetime NOT NULL,
                "interviewer_id" varchar,
                "interview_format" varchar NOT NULL,
                "evaluation" varchar,
                "evaluation_comment" text,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_interview_records_application_id" FOREIGN KEY ("application_id") REFERENCES "applications" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_interview_records_interviewer_id" FOREIGN KEY ("interviewer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `);

        // インデックスの作成
        await queryRunner.query(`
            CREATE INDEX "IDX_applications_project_id" ON "applications" ("project_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_applications_partner_id" ON "applications" ("partner_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_applications_status" ON "applications" ("status")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_interview_records_application_id" ON "interview_records" ("application_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // インデックスの削除
        await queryRunner.query(`
            DROP INDEX "IDX_interview_records_application_id"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_applications_status"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_applications_partner_id"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_applications_project_id"
        `);

        // テーブルの削除
        await queryRunner.query(`
            DROP TABLE "interview_records"
        `);

        await queryRunner.query(`
            DROP TABLE "applications"
        `);
    }
}
