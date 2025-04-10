import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTables1744500000003 implements MigrationInterface {
    name = 'CreateNotificationTables1744500000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 通知（notifications）テーブルの作成
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" varchar PRIMARY KEY NOT NULL,
                "user_id" varchar NOT NULL,
                "title" varchar NOT NULL,
                "content" text NOT NULL,
                "notification_type" varchar NOT NULL,
                "related_entity_type" varchar,
                "related_entity_id" varchar,
                "is_read" boolean NOT NULL DEFAULT (0),
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // インデックスの作成
        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_is_read" ON "notifications" ("is_read")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_notification_type" ON "notifications" ("notification_type")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // インデックスの削除
        await queryRunner.query(`
            DROP INDEX "IDX_notifications_notification_type"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_notifications_is_read"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_notifications_user_id"
        `);

        // テーブルの削除
        await queryRunner.query(`
            DROP TABLE "notifications"
        `);
    }
}
