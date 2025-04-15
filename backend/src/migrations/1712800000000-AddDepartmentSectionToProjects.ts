import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDepartmentSectionToProjects1712800000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // Add departmentId and sectionId columns to projects table
            await queryRunner.query(`
                ALTER TABLE projects 
                ADD COLUMN departmentId INT NULL,
                ADD COLUMN sectionId INT NULL
            `);
            
            // Add foreign key constraints
            await queryRunner.query(`
                ALTER TABLE projects 
                ADD CONSTRAINT FK_projects_departments 
                FOREIGN KEY (departmentId) REFERENCES departments(id)
            `);
            
            await queryRunner.query(`
                ALTER TABLE projects 
                ADD CONSTRAINT FK_projects_sections 
                FOREIGN KEY (sectionId) REFERENCES sections(id)
            `);
        } catch (error) {
            // Projects table not found
            return;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            // Drop foreign key constraints
            await queryRunner.query(`
                ALTER TABLE projects 
                DROP CONSTRAINT FK_projects_sections
            `);
            
            await queryRunner.query(`
                ALTER TABLE projects 
                DROP CONSTRAINT FK_projects_departments
            `);
            
            // Drop columns
            await queryRunner.query(`
                ALTER TABLE projects 
                DROP COLUMN sectionId,
                DROP COLUMN departmentId
            `);
        } catch (error) {
            // Projects table not found
            return;
        }
    }
}
