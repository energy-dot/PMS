import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMasterDataTable1744500000007 implements MigrationInterface {
    name = 'CreateMasterDataTable1744500000007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // マスターデータテーブルの作成
        await queryRunner.query(`
            CREATE TABLE "master_data" (
                "id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "description" text,
                "type" varchar NOT NULL,
                "category" varchar,
                "display_order" integer NOT NULL DEFAULT (0),
                "is_active" boolean NOT NULL DEFAULT (1),
                "metadata" text,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

        // インデックスの作成
        await queryRunner.query(`
            CREATE INDEX "IDX_master_data_type" ON "master_data" ("type")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_master_data_category" ON "master_data" ("category")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_master_data_is_active" ON "master_data" ("is_active")
        `);

        // 初期データの挿入 - スキル
        await queryRunner.query(`
            INSERT INTO "master_data" ("id", "name", "description", "type", "category", "display_order", "is_active")
            VALUES 
                ('${this.generateUUID()}', 'Java', 'プログラミング言語', 'skills', 'プログラミング言語', 1, 1),
                ('${this.generateUUID()}', 'JavaScript', 'プログラミング言語', 'skills', 'プログラミング言語', 2, 1),
                ('${this.generateUUID()}', 'Python', 'プログラミング言語', 'skills', 'プログラミング言語', 3, 1),
                ('${this.generateUUID()}', 'React', 'フロントエンドフレームワーク', 'skills', 'フレームワーク', 1, 1),
                ('${this.generateUUID()}', 'Spring Boot', 'バックエンドフレームワーク', 'skills', 'フレームワーク', 2, 1),
                ('${this.generateUUID()}', 'Django', 'バックエンドフレームワーク', 'skills', 'フレームワーク', 3, 1),
                ('${this.generateUUID()}', 'MySQL', 'リレーショナルデータベース', 'skills', 'データベース', 1, 1),
                ('${this.generateUUID()}', 'PostgreSQL', 'リレーショナルデータベース', 'skills', 'データベース', 2, 1),
                ('${this.generateUUID()}', 'MongoDB', 'NoSQLデータベース', 'skills', 'データベース', 3, 1),
                ('${this.generateUUID()}', 'AWS', 'クラウドプラットフォーム', 'skills', 'クラウド', 1, 1),
                ('${this.generateUUID()}', 'Azure', 'クラウドプラットフォーム', 'skills', 'クラウド', 2, 1),
                ('${this.generateUUID()}', 'GCP', 'クラウドプラットフォーム', 'skills', 'クラウド', 3, 1)
        `);

        // 初期データの挿入 - 役職
        await queryRunner.query(`
            INSERT INTO "master_data" ("id", "name", "description", "type", "display_order", "is_active")
            VALUES 
                ('${this.generateUUID()}', '開発担当者', 'プロジェクトで要員の選考・評価を行う担当者', 'roles', 1, 1),
                ('${this.generateUUID()}', 'パートナー管理担当者', 'パートナー会社との契約管理や案件募集を行う担当者', 'roles', 2, 1),
                ('${this.generateUUID()}', '管理者', 'システム全体を管理する担当者', 'roles', 3, 1),
                ('${this.generateUUID()}', '閲覧者', '情報の閲覧のみが可能なユーザー', 'roles', 4, 1)
        `);

        // 初期データの挿入 - 契約形態
        await queryRunner.query(`
            INSERT INTO "master_data" ("id", "name", "description", "type", "display_order", "is_active")
            VALUES 
                ('${this.generateUUID()}', '準委任', '業務の遂行を委託する契約形態', 'contractTypes', 1, 1),
                ('${this.generateUUID()}', '派遣', '労働者派遣事業者から労働者を派遣してもらう契約形態', 'contractTypes', 2, 1),
                ('${this.generateUUID()}', '請負', '特定の業務の完了を約束する契約形態', 'contractTypes', 3, 1)
        `);

        // 初期データの挿入 - 案件ステータス
        await queryRunner.query(`
            INSERT INTO "master_data" ("id", "name", "description", "type", "display_order", "is_active")
            VALUES 
                ('${this.generateUUID()}', '下書き', '案件情報を作成中の状態', 'projectStatuses', 1, 1),
                ('${this.generateUUID()}', '承認待ち', 'パートナー管理担当者の承認待ちの状態', 'projectStatuses', 2, 1),
                ('${this.generateUUID()}', '募集中', 'パートナー会社への募集を行っている状態', 'projectStatuses', 3, 1),
                ('${this.generateUUID()}', '選考中', '応募者の選考を行っている状態', 'projectStatuses', 4, 1),
                ('${this.generateUUID()}', '充足', '必要人数が確保された状態', 'projectStatuses', 5, 1),
                ('${this.generateUUID()}', '終了', 'プロジェクトが完了した状態', 'projectStatuses', 6, 1),
                ('${this.generateUUID()}', '中止', '案件が中止された状態', 'projectStatuses', 7, 1),
                ('${this.generateUUID()}', '差し戻し', '承認申請が差し戻された状態', 'projectStatuses', 8, 1)
        `);

        // 初期データの挿入 - 応募ステータス
        await queryRunner.query(`
            INSERT INTO "master_data" ("id", "name", "description", "type", "display_order", "is_active")
            VALUES 
                ('${this.generateUUID()}', '新規応募', '新しく応募があった状態', 'applicationStatuses', 1, 1),
                ('${this.generateUUID()}', '書類選考中', '書類選考を行っている状態', 'applicationStatuses', 2, 1),
                ('${this.generateUUID()}', '書類NG', '書類選考で不合格となった状態', 'applicationStatuses', 3, 1),
                ('${this.generateUUID()}', '書類OK', '書類選考を通過した状態', 'applicationStatuses', 4, 1),
                ('${this.generateUUID()}', '面談調整中', '面談の日程調整を行っている状態', 'applicationStatuses', 5, 1),
                ('${this.generateUUID()}', '面談設定済', '面談の日程が確定した状態', 'applicationStatuses', 6, 1),
                ('${this.generateUUID()}', '面談NG', '面談で不合格となった状態', 'applicationStatuses', 7, 1),
                ('${this.generateUUID()}', '面談OK', '面談を通過した状態', 'applicationStatuses', 8, 1),
                ('${this.generateUUID()}', '内定', '採用が内定した状態', 'applicationStatuses', 9, 1),
                ('${this.generateUUID()}', '採用', '正式に採用が決定した状態', 'applicationStatuses', 10, 1),
                ('${this.generateUUID()}', '見送り', '採用を見送った状態', 'applicationStatuses', 11, 1),
                ('${this.generateUUID()}', '辞退', '応募者が辞退した状態', 'applicationStatuses', 12, 1)
        `);

        // 初期データの挿入 - 評価項目
        await queryRunner.query(`
            INSERT INTO "master_data" ("id", "name", "description", "type", "display_order", "is_active")
            VALUES 
                ('${this.generateUUID()}', 'スキル合致度', '案件に必要なスキルをどの程度持っているか', 'evaluationItems', 1, 1),
                ('${this.generateUUID()}', '成果物品質', '成果物の品質が要求レベルを満たしているか', 'evaluationItems', 2, 1),
                ('${this.generateUUID()}', 'コミュニケーション能力', 'チーム内外とのコミュニケーションは円滑か', 'evaluationItems', 3, 1),
                ('${this.generateUUID()}', '勤怠', '出勤率や時間厳守の姿勢はどうか', 'evaluationItems', 4, 1),
                ('${this.generateUUID()}', '協調性', 'チームでの協調性やチームワークはどうか', 'evaluationItems', 5, 1)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // インデックスの削除
        await queryRunner.query(`
            DROP INDEX "IDX_master_data_is_active"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_master_data_category"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_master_data_type"
        `);

        // テーブルの削除
        await queryRunner.query(`
            DROP TABLE "master_data"
        `);
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
