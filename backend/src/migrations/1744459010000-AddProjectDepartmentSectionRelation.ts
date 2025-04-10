import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectDepartmentSectionRelation1744459010000 implements MigrationInterface {
    name = 'AddProjectDepartmentSectionRelation1744459010000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // departmentId カラムがすでに存在するか確認
        const hasDepartmentId = await queryRunner.hasColumn('projects', 'department_id');
        if (!hasDepartmentId) {
            await queryRunner.query(`
                ALTER TABLE "projects" 
                ADD COLUMN "department_id" varchar NULL
            `);
        }

        // sectionId カラムがすでに存在するか確認
        const hasSectionId = await queryRunner.hasColumn('projects', 'section_id');
        if (!hasSectionId) {
            await queryRunner.query(`
                ALTER TABLE "projects" 
                ADD COLUMN "section_id" varchar NULL
            `);
        }

        // 外部キー制約の追加
        await queryRunner.query(`
            CREATE INDEX "IDX_projects_department_id" ON "projects" ("department_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_projects_section_id" ON "projects" ("section_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // インデックスの削除
        await queryRunner.query(`
            DROP INDEX "IDX_projects_section_id"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_projects_department_id"
        `);

        // カラムの削除
        await queryRunner.query(`
            ALTER TABLE "projects" 
            DROP COLUMN "section_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "projects" 
            DROP COLUMN "department_id"
        `);
    }
}
