import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class CreateInitialUsers1744500000008 implements MigrationInterface {
    name = 'CreateInitialUsers1744500000008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // パスワードのハッシュ化
        const salt = await bcrypt.genSalt();
        const adminPassword = await bcrypt.hash('admin123', salt);
        const developerPassword = await bcrypt.hash('dev123', salt);
        const partnerMgrPassword = await bcrypt.hash('partner123', salt);
        const viewerPassword = await bcrypt.hash('viewer123', salt);

        // 初期ユーザーデータの挿入
        await queryRunner.query(`
            INSERT INTO "user" (
                "id", 
                "username", 
                "full_name", 
                "email", 
                "password", 
                "role", 
                "department", 
                "is_active", 
                "last_login", 
                "created_at", 
                "updated_at"
            ) VALUES 
            (
                '${this.generateUUID()}', 
                'admin', 
                '管理者 太郎', 
                'admin@example.com', 
                '${adminPassword}', 
                'admin', 
                'システム管理部', 
                1, 
                NULL, 
                datetime('now'), 
                datetime('now')
            ),
            (
                '${this.generateUUID()}', 
                'developer1', 
                '開発 一郎', 
                'developer1@example.com', 
                '${developerPassword}', 
                'developer', 
                '開発第一部', 
                1, 
                NULL, 
                datetime('now'), 
                datetime('now')
            ),
            (
                '${this.generateUUID()}', 
                'partner_mgr1', 
                'パートナー 花子', 
                'partner_mgr1@example.com', 
                '${partnerMgrPassword}', 
                'partner_manager', 
                'パートナー管理部', 
                1, 
                NULL, 
                datetime('now'), 
                datetime('now')
            ),
            (
                '${this.generateUUID()}', 
                'viewer1', 
                '閲覧 三郎', 
                'viewer1@example.com', 
                '${viewerPassword}', 
                'viewer', 
                '経営企画部', 
                1, 
                NULL, 
                datetime('now'), 
                datetime('now')
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE username IN ('admin', 'developer1', 'partner_mgr1', 'viewer1')`);
    }

    // UUIDを生成するヘルパーメソッド
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
