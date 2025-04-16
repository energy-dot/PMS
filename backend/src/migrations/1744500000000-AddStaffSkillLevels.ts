import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStaffSkillLevels1744500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. スキルレベルを格納するためのJSONカラムを追加
    await queryRunner.query(`
            ALTER TABLE staff ADD COLUMN skillLevels TEXT DEFAULT '{}';
        `);

    // 2. 事業部と部への参照を追加
    await queryRunner.query(`
            ALTER TABLE staff ADD COLUMN departmentId TEXT;
        `);
    await queryRunner.query(`
            ALTER TABLE staff ADD COLUMN sectionId TEXT;
        `);

    // 3. スキルカテゴリテーブルの作成
    await queryRunner.query(`
            CREATE TABLE skill_category (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                createdAt DATETIME NOT NULL DEFAULT (datetime('now')),
                updatedAt DATETIME NOT NULL DEFAULT (datetime('now'))
            )
        `);

    // 4. スキルマスタテーブルの作成
    await queryRunner.query(`
            CREATE TABLE skill (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                categoryId TEXT,
                createdAt DATETIME NOT NULL DEFAULT (datetime('now')),
                updatedAt DATETIME NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (categoryId) REFERENCES skill_category(id)
            )
        `);

    // 5. 基本的なスキルカテゴリとスキルのシードデータ挿入
    // カテゴリ
    await queryRunner.query(`
            INSERT INTO skill_category (id, name, description) VALUES 
            ('cat-prog', 'プログラミング言語', 'プログラミング言語に関するスキル'),
            ('cat-fw', 'フレームワーク', 'フレームワークに関するスキル'),
            ('cat-db', 'データベース', 'データベースに関するスキル'),
            ('cat-infra', 'インフラ', 'インフラストラクチャに関するスキル'),
            ('cat-tool', '開発ツール', '開発ツールに関するスキル')
        `);

    // スキル
    await queryRunner.query(`
            INSERT INTO skill (id, name, categoryId) VALUES 
            ('skill-js', 'JavaScript', 'cat-prog'),
            ('skill-ts', 'TypeScript', 'cat-prog'),
            ('skill-java', 'Java', 'cat-prog'),
            ('skill-py', 'Python', 'cat-prog'),
            ('skill-cs', 'C#', 'cat-prog'),
            ('skill-go', 'Go', 'cat-prog'),
            
            ('skill-react', 'React', 'cat-fw'),
            ('skill-vue', 'Vue.js', 'cat-fw'),
            ('skill-angular', 'Angular', 'cat-fw'),
            ('skill-spring', 'Spring Boot', 'cat-fw'),
            ('skill-django', 'Django', 'cat-fw'),
            ('skill-nest', 'NestJS', 'cat-fw'),
            
            ('skill-mysql', 'MySQL', 'cat-db'),
            ('skill-pg', 'PostgreSQL', 'cat-db'),
            ('skill-mongo', 'MongoDB', 'cat-db'),
            ('skill-oracle', 'Oracle', 'cat-db'),
            
            ('skill-aws', 'AWS', 'cat-infra'),
            ('skill-azure', 'Azure', 'cat-infra'),
            ('skill-gcp', 'GCP', 'cat-infra'),
            ('skill-docker', 'Docker', 'cat-infra'),
            ('skill-k8s', 'Kubernetes', 'cat-infra'),
            
            ('skill-git', 'Git', 'cat-tool'),
            ('skill-ci', 'CI/CD', 'cat-tool'),
            ('skill-jira', 'Jira', 'cat-tool')
        `);

    // 6. 既存のステータスオプションを拡張（既存データとの互換性を保つ）
    // ここでは直接変更せず、デフォルト値を変更するだけにとどめます
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS skill`);
    await queryRunner.query(`DROP TABLE IF EXISTS skill_category`);
    await queryRunner.query(`ALTER TABLE staff DROP COLUMN skillLevels`);
    await queryRunner.query(`ALTER TABLE staff DROP COLUMN departmentId`);
    await queryRunner.query(`ALTER TABLE staff DROP COLUMN sectionId`);
  }
}
