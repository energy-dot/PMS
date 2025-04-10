import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class AddTestData1744500000005 implements MigrationInterface {
    name = 'AddTestData1744500000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // テスト用応募者データの追加
        const applicationIds = [];
        for (let i = 1; i <= 5; i++) {
            const applicationId = uuidv4();
            applicationIds.push(applicationId);
            
            await queryRunner.query(`
                INSERT INTO applications (
                    id, name, email, phone, position, status, source, 
                    resume_url, skills, experience_years, expected_salary, 
                    availability_date, notes, created_at, updated_at
                ) VALUES (
                    '${applicationId}', 
                    '応募者${i}', 
                    'applicant${i}@example.com', 
                    '090-1234-${1000 + i}', 
                    'エンジニア', 
                    '${i <= 2 ? '新規応募' : i <= 4 ? '面接中' : '内定'}', 
                    'リファラル', 
                    'https://example.com/resume${i}.pdf', 
                    'Java, Spring Boot, React${i % 2 === 0 ? ", TypeScript" : ""}', 
                    ${3 + i}, 
                    ${400 + i * 10}0000, 
                    '2025-0${i}-01', 
                    'テスト応募者データ${i}', 
                    datetime('now'), 
                    datetime('now')
                )
            `);
        }

        // テスト用面接記録データの追加
        for (let i = 0; i < 3; i++) {
            const applicationId = applicationIds[i];
            
            await queryRunner.query(`
                INSERT INTO interview_records (
                    id, application_id, interview_date, interviewer, interview_type, 
                    evaluation, notes, created_at, updated_at
                ) VALUES (
                    '${uuidv4()}', 
                    '${applicationId}', 
                    datetime('now', '-${i} days'), 
                    '面接官${i + 1}', 
                    '${i === 0 ? '一次面接' : i === 1 ? '二次面接' : '最終面接'}', 
                    ${3 + i}, 
                    '面接記録${i + 1}。候補者は${i === 0 ? '基本的なスキルを持っている' : i === 1 ? 'チームワークに優れている' : '技術的に非常に優秀'}。', 
                    datetime('now'), 
                    datetime('now')
                )
            `);
        }

        // テスト用申請履歴データの追加
        const projectIds = await this.getProjectIds(queryRunner);
        const userIds = await this.getUserIds(queryRunner);
        
        if (projectIds.length > 0 && userIds.length > 0) {
            for (let i = 0; i < Math.min(3, projectIds.length); i++) {
                const projectId = projectIds[i];
                const requesterId = userIds[0];
                const approverId = userIds.length > 1 ? userIds[1] : userIds[0];
                
                await queryRunner.query(`
                    INSERT INTO request_histories (
                        id, project_id, requester_id, approver_id, 
                        request_type, status, request_date, response_date, 
                        request_reason, response_comment, created_at, updated_at
                    ) VALUES (
                        '${uuidv4()}', 
                        '${projectId}', 
                        '${requesterId}', 
                        '${approverId}', 
                        '案件申請', 
                        '${i === 0 ? '承認待ち' : i === 1 ? '承認済み' : '差戻し'}', 
                        datetime('now', '-${i + 1} days'), 
                        ${i === 0 ? 'NULL' : `datetime('now', '-${i} days')`}, 
                        '案件の承認をお願いします。重要度: ${i === 0 ? '高' : i === 1 ? '中' : '低'}', 
                        ${i === 0 ? 'NULL' : `'${i === 1 ? '承認します。問題ありません。' : '一部修正が必要です。'}'`}, 
                        datetime('now'), 
                        datetime('now')
                    )
                `);
            }
        }

        // テスト用通知データの追加
        if (userIds.length > 0) {
            const notificationTypes = ['案件申請', '承認完了', '差戻し', '新規応募', '面接設定'];
            const notificationContents = [
                '新しい案件申請が届いています。確認してください。',
                '申請した案件が承認されました。',
                '申請した案件が差し戻されました。修正してください。',
                '新しい応募者が登録されました。確認してください。',
                '面接が設定されました。準備をお願いします。'
            ];
            
            for (let i = 0; i < 5; i++) {
                const userId = userIds[i % userIds.length];
                
                await queryRunner.query(`
                    INSERT INTO notifications (
                        id, user_id, title, content, is_read, 
                        notification_type, related_id, created_at, updated_at
                    ) VALUES (
                        '${uuidv4()}', 
                        '${userId}', 
                        '${notificationTypes[i]}通知', 
                        '${notificationContents[i]}', 
                        ${i < 2 ? 1 : 0}, 
                        '${notificationTypes[i]}', 
                        '${uuidv4()}', 
                        datetime('now', '-${5 - i} days'), 
                        datetime('now')
                    )
                `);
            }
        }

        // テスト用評価データの追加
        if (userIds.length >= 2) {
            const staffId = userIds[0];
            const evaluatorId = userIds.length > 1 ? userIds[1] : userIds[0];
            const projectId = projectIds.length > 0 ? projectIds[0] : null;
            
            const evaluationId = uuidv4();
            
            await queryRunner.query(`
                INSERT INTO evaluations (
                    id, staff_id, evaluator_id, project_id, evaluation_date, 
                    technical_skill, communication_skill, problem_solving, 
                    teamwork, leadership, overall_rating, strengths, 
                    areas_to_improve, comments, created_at, updated_at
                ) VALUES (
                    '${evaluationId}', 
                    '${staffId}', 
                    '${evaluatorId}', 
                    ${projectId ? `'${projectId}'` : 'NULL'}, 
                    datetime('now', '-30 days'), 
                    4, 
                    3, 
                    4, 
                    5, 
                    3, 
                    4, 
                    '技術的な知識が豊富で、問題解決能力が高い。チームワークも優れている。', 
                    'リーダーシップスキルをさらに向上させることで、チームをより効果的に導くことができるだろう。', 
                    '全体的に優秀なエンジニアであり、今後の成長が期待できる。', 
                    datetime('now'), 
                    datetime('now')
                )
            `);
            
            // 評価スキルデータの追加
            const skills = [
                { name: 'Java', level: 4 },
                { name: 'Spring Boot', level: 4 },
                { name: 'React', level: 3 },
                { name: 'TypeScript', level: 3 },
                { name: 'SQL', level: 4 }
            ];
            
            for (const skill of skills) {
                await queryRunner.query(`
                    INSERT INTO evaluation_skills (
                        id, evaluation_id, skill_name, skill_level, created_at, updated_at
                    ) VALUES (
                        '${uuidv4()}', 
                        '${evaluationId}', 
                        '${skill.name}', 
                        ${skill.level}, 
                        datetime('now'), 
                        datetime('now')
                    )
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 評価スキルデータの削除
        await queryRunner.query(`DELETE FROM evaluation_skills`);
        
        // 評価データの削除
        await queryRunner.query(`DELETE FROM evaluations`);
        
        // 通知データの削除
        await queryRunner.query(`DELETE FROM notifications`);
        
        // 申請履歴データの削除
        await queryRunner.query(`DELETE FROM request_histories`);
        
        // 面接記録データの削除
        await queryRunner.query(`DELETE FROM interview_records`);
        
        // 応募者データの削除
        await queryRunner.query(`DELETE FROM applications`);
    }

    // プロジェクトIDを取得するヘルパーメソッド
    private async getProjectIds(queryRunner: QueryRunner): Promise<string[]> {
        const projects = await queryRunner.query(`SELECT id FROM projects LIMIT 5`);
        return projects.map(project => project.id);
    }

    // ユーザーIDを取得するヘルパーメソッド
    private async getUserIds(queryRunner: QueryRunner): Promise<string[]> {
        const users = await queryRunner.query(`SELECT id FROM users LIMIT 5`);
        return users.map(user => user.id);
    }
}
