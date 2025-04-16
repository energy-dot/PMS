import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStaffEvaluationTables1744500000004 implements MigrationInterface {
  name = 'CreateStaffEvaluationTables1744500000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 評価（evaluations）テーブルの作成
    await queryRunner.query(`
            CREATE TABLE "evaluations" (
                "id" varchar PRIMARY KEY NOT NULL,
                "staff_id" varchar NOT NULL,
                "evaluator_id" varchar NOT NULL,
                "project_id" varchar,
                "evaluation_date" datetime NOT NULL,
                "technical_skill" integer NOT NULL,
                "communication_skill" integer NOT NULL,
                "problem_solving" integer NOT NULL,
                "teamwork" integer NOT NULL,
                "leadership" integer NOT NULL,
                "overall_rating" integer NOT NULL,
                "strengths" text,
                "areas_to_improve" text,
                "comments" text,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_evaluations_staff_id" FOREIGN KEY ("staff_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_evaluations_evaluator_id" FOREIGN KEY ("evaluator_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_evaluations_project_id" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `);

    // インデックスの作成
    await queryRunner.query(`
            CREATE INDEX "IDX_evaluations_staff_id" ON "evaluations" ("staff_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_evaluations_evaluator_id" ON "evaluations" ("evaluator_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_evaluations_project_id" ON "evaluations" ("project_id")
        `);

    // 評価スキル（evaluation_skills）テーブルの作成
    await queryRunner.query(`
            CREATE TABLE "evaluation_skills" (
                "id" varchar PRIMARY KEY NOT NULL,
                "evaluation_id" varchar NOT NULL,
                "skill_name" varchar NOT NULL,
                "skill_level" integer NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_evaluation_skills_evaluation_id" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

    // インデックスの作成
    await queryRunner.query(`
            CREATE INDEX "IDX_evaluation_skills_evaluation_id" ON "evaluation_skills" ("evaluation_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // インデックスの削除
    await queryRunner.query(`
            DROP INDEX "IDX_evaluation_skills_evaluation_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_evaluations_project_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_evaluations_evaluator_id"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_evaluations_staff_id"
        `);

    // テーブルの削除
    await queryRunner.query(`
            DROP TABLE "evaluation_skills"
        `);

    await queryRunner.query(`
            DROP TABLE "evaluations"
        `);
  }
}
