import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddDepartmentSectionToProjects1712800000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // departmentIdカラムがまだ存在しない場合のみ追加（既存データとの互換性確保）
        const projectsTable = await queryRunner.getTable('projects');
        if (!projectsTable) {
            console.log('Projects table not found');
            return;
        }
        
        const departmentIdColumn = projectsTable.findColumnByName('department_id');
        
        if (!departmentIdColumn) {
            // departmentIdカラムを追加
            await queryRunner.addColumn('projects', new TableColumn({
                name: 'department_id',
                type: 'varchar',
                isNullable: true,
            }));

            // 外部キー制約の追加
            await queryRunner.createForeignKey('projects', new TableForeignKey({
                columnNames: ['department_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'departments',
                onDelete: 'SET NULL'
            }));
        }

        // sectionIdカラムがまだ存在しない場合のみ追加
        const sectionIdColumn = projectsTable.findColumnByName('section_id');
        
        if (!sectionIdColumn) {
            // sectionIdカラムを追加
            await queryRunner.addColumn('projects', new TableColumn({
                name: 'section_id',
                type: 'varchar',
                isNullable: true,
            }));
            
            // 外部キー制約の追加
            await queryRunner.createForeignKey('projects', new TableForeignKey({
                columnNames: ['section_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'sections',
                onDelete: 'SET NULL'
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('projects');
        if (!table) {
            console.log('Projects table not found');
            return;
        }
        
        // 外部キー制約の削除（sectionId）
        const sectionForeignKey = table.foreignKeys.find(fk => 
            fk.columnNames.indexOf('section_id') !== -1);
        if (sectionForeignKey) {
            await queryRunner.dropForeignKey('projects', sectionForeignKey);
        }
        
        // sectionIdカラムの削除
        await queryRunner.dropColumn('projects', 'section_id');
        
        // 外部キー制約の削除（departmentId）
        const departmentForeignKey = table.foreignKeys.find(fk => 
            fk.columnNames.indexOf('department_id') !== -1);
        if (departmentForeignKey) {
            await queryRunner.dropForeignKey('projects', departmentForeignKey);
        }
        
        // departmentIdカラムの削除
        await queryRunner.dropColumn('projects', 'department_id');
    }
}
