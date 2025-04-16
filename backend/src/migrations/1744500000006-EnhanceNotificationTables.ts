import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnhanceNotificationTables1744500000006 implements MigrationInterface {
  name = 'EnhanceNotificationTables1744500000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 通知テーブルの拡張
    await queryRunner.query(`
            ALTER TABLE "notifications" ADD COLUMN "priority" varchar DEFAULT ('normal')
        `);

    await queryRunner.query(`
            ALTER TABLE "notifications" ADD COLUMN "expiration_date" datetime
        `);

    await queryRunner.query(`
            ALTER TABLE "notifications" ADD COLUMN "action_url" varchar
        `);

    // 新しいインデックスの作成
    await queryRunner.query(`
            CREATE INDEX "IDX_notifications_priority" ON "notifications" ("priority")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_notifications_created_at" ON "notifications" ("created_at")
        `);

    // 通知設定テーブルの作成
    await queryRunner.query(`
            CREATE TABLE "notification_settings" (
                "id" varchar PRIMARY KEY NOT NULL,
                "user_id" varchar NOT NULL,
                "notification_type" varchar NOT NULL,
                "email_enabled" boolean NOT NULL DEFAULT (1),
                "in_app_enabled" boolean NOT NULL DEFAULT (1),
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_notification_settings_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "UQ_notification_settings_user_type" UNIQUE ("user_id", "notification_type")
            )
        `);

    // 通知設定テーブルのインデックスの作成
    await queryRunner.query(`
            CREATE INDEX "IDX_notification_settings_user_id" ON "notification_settings" ("user_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 通知設定テーブルのインデックスの削除
    await queryRunner.query(`
            DROP INDEX "IDX_notification_settings_user_id"
        `);

    // 通知設定テーブルの削除
    await queryRunner.query(`
            DROP TABLE "notification_settings"
        `);

    // 新しいインデックスの削除
    await queryRunner.query(`
            DROP INDEX "IDX_notifications_created_at"
        `);

    await queryRunner.query(`
            DROP INDEX "IDX_notifications_priority"
        `);

    // 追加したカラムの削除
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "action_url"
        `);

    await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "expiration_date"
        `);

    await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "priority"
        `);
  }
}
