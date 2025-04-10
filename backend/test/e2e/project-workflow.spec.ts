import { test, expect } from '@playwright/test';

test.describe('案件ワークフローE2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    // テスト前の準備：ログイン処理
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // ダッシュボードが表示されることを確認
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  test('新規案件の作成から承認までのワークフロー', async ({ page }) => {
    // 1. 案件一覧ページに移動
    await page.click('a[href="/projects"]');
    await expect(page).toHaveURL('http://localhost:3000/projects');
    
    // 2. 新規案件作成ボタンをクリック
    await page.click('button:has-text("新規案件作成")');
    await expect(page.locator('h2')).toContainText('新規案件作成');
    
    // 3. 案件情報を入力
    await page.fill('input[name="name"]', 'E2Eテスト用案件');
    await page.fill('textarea[name="description"]', 'これはE2Eテスト用の案件です');
    await page.selectOption('select[name="status"]', '計画中');
    await page.fill('input[name="startDate"]', '2025-05-01');
    await page.fill('input[name="endDate"]', '2025-12-31');
    await page.fill('input[name="budget"]', '10000000');
    
    // 4. 案件を保存
    await page.click('button:has-text("保存")');
    
    // 5. 案件一覧に戻り、作成した案件が表示されることを確認
    await expect(page).toHaveURL('http://localhost:3000/projects');
    await expect(page.locator('table')).toContainText('E2Eテスト用案件');
    
    // 6. 作成した案件の詳細ページに移動
    await page.click('tr:has-text("E2Eテスト用案件") a:has-text("詳細")');
    await expect(page.locator('h1')).toContainText('E2Eテスト用案件');
    
    // 7. 案件承認ワークフロータブに移動
    await page.click('button:has-text("承認ワークフロー")');
    
    // 8. 承認申請ボタンをクリック
    await page.click('button:has-text("承認申請")');
    await expect(page.locator('div.modal')).toBeVisible();
    
    // 9. 承認申請フォームに入力
    await page.fill('textarea[name="remarks"]', '案件の承認をお願いします');
    await page.click('button:has-text("申請")');
    
    // 10. 承認ステータスが「承認待ち」に変更されることを確認
    await expect(page.locator('div.status-badge')).toContainText('承認待ち');
    
    // 11. 承認者アカウントに切り替え（ログアウト→ログイン）
    await page.click('button:has-text("ログアウト")');
    await page.fill('input[name="username"]', 'manager');
    await page.fill('input[name="password"]', 'manager123');
    await page.click('button[type="submit"]');
    
    // 12. 承認待ちタスク一覧に移動
    await page.click('a[href="/approvals"]');
    await expect(page).toHaveURL('http://localhost:3000/approvals');
    
    // 13. 承認待ちの案件が表示されることを確認
    await expect(page.locator('table')).toContainText('E2Eテスト用案件');
    
    // 14. 承認処理を実行
    await page.click('tr:has-text("E2Eテスト用案件") button:has-text("承認")');
    await expect(page.locator('div.modal')).toBeVisible();
    await page.fill('textarea[name="remarks"]', '承認します');
    await page.click('button:has-text("承認する")');
    
    // 15. 案件詳細ページに移動して承認ステータスを確認
    await page.click('a[href="/projects"]');
    await page.click('tr:has-text("E2Eテスト用案件") a:has-text("詳細")');
    await page.click('button:has-text("承認ワークフロー")');
    
    // 16. 承認ステータスが「承認済み」に変更されていることを確認
    await expect(page.locator('div.status-badge')).toContainText('承認済み');
    
    // 17. 承認履歴が記録されていることを確認
    await expect(page.locator('table.approval-history')).toContainText('承認します');
  });

  test('案件の却下と再申請のワークフロー', async ({ page }) => {
    // 1. 案件一覧ページに移動
    await page.click('a[href="/projects"]');
    await expect(page).toHaveURL('http://localhost:3000/projects');
    
    // 2. 新規案件作成ボタンをクリック
    await page.click('button:has-text("新規案件作成")');
    await expect(page.locator('h2')).toContainText('新規案件作成');
    
    // 3. 案件情報を入力
    await page.fill('input[name="name"]', '却下テスト用案件');
    await page.fill('textarea[name="description"]', 'これは却下テスト用の案件です');
    await page.selectOption('select[name="status"]', '計画中');
    await page.fill('input[name="startDate"]', '2025-06-01');
    await page.fill('input[name="endDate"]', '2025-12-31');
    await page.fill('input[name="budget"]', '5000000');
    
    // 4. 案件を保存
    await page.click('button:has-text("保存")');
    
    // 5. 案件詳細ページに移動
    await page.click('tr:has-text("却下テスト用案件") a:has-text("詳細")');
    await expect(page.locator('h1')).toContainText('却下テスト用案件');
    
    // 6. 案件承認ワークフロータブに移動
    await page.click('button:has-text("承認ワークフロー")');
    
    // 7. 承認申請ボタンをクリック
    await page.click('button:has-text("承認申請")');
    await expect(page.locator('div.modal')).toBeVisible();
    
    // 8. 承認申請フォームに入力
    await page.fill('textarea[name="remarks"]', '案件の承認をお願いします');
    await page.click('button:has-text("申請")');
    
    // 9. 承認ステータスが「承認待ち」に変更されることを確認
    await expect(page.locator('div.status-badge')).toContainText('承認待ち');
    
    // 10. 承認者アカウントに切り替え（ログアウト→ログイン）
    await page.click('button:has-text("ログアウト")');
    await page.fill('input[name="username"]', 'manager');
    await page.fill('input[name="password"]', 'manager123');
    await page.click('button[type="submit"]');
    
    // 11. 承認待ちタスク一覧に移動
    await page.click('a[href="/approvals"]');
    await expect(page).toHaveURL('http://localhost:3000/approvals');
    
    // 12. 承認待ちの案件が表示されることを確認
    await expect(page.locator('table')).toContainText('却下テスト用案件');
    
    // 13. 却下処理を実行
    await page.click('tr:has-text("却下テスト用案件") button:has-text("却下")');
    await expect(page.locator('div.modal')).toBeVisible();
    await page.fill('textarea[name="rejectionReason"]', '予算が不足しています。再検討してください。');
    await page.click('button:has-text("却下する")');
    
    // 14. 申請者アカウントに切り替え（ログアウト→ログイン）
    await page.click('button:has-text("ログアウト")');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 15. 案件詳細ページに移動して承認ステータスを確認
    await page.click('a[href="/projects"]');
    await page.click('tr:has-text("却下テスト用案件") a:has-text("詳細")');
    await page.click('button:has-text("承認ワークフロー")');
    
    // 16. 承認ステータスが「差戻し」に変更されていることを確認
    await expect(page.locator('div.status-badge')).toContainText('差戻し');
    
    // 17. 却下理由が表示されていることを確認
    await expect(page.locator('div.rejection-reason')).toContainText('予算が不足しています');
    
    // 18. 案件情報を修正
    await page.click('button:has-text("基本情報")');
    await page.click('button:has-text("編集")');
    await page.fill('input[name="budget"]', '8000000');
    await page.click('button:has-text("保存")');
    
    // 19. 再申請
    await page.click('button:has-text("承認ワークフロー")');
    await page.click('button:has-text("再申請")');
    await expect(page.locator('div.modal')).toBeVisible();
    await page.fill('textarea[name="remarks"]', '予算を増額しました。再度承認をお願いします。');
    await page.click('button:has-text("申請")');
    
    // 20. 承認ステータスが「承認待ち」に変更されることを確認
    await expect(page.locator('div.status-badge')).toContainText('承認待ち');
  });

  test('案件の応募者管理機能', async ({ page }) => {
    // 1. 案件一覧ページに移動
    await page.click('a[href="/projects"]');
    await expect(page).toHaveURL('http://localhost:3000/projects');
    
    // 2. 既存の案件の詳細ページに移動
    await page.click('tr:has-text("E2Eテスト用案件") a:has-text("詳細")');
    await expect(page.locator('h1')).toContainText('E2Eテスト用案件');
    
    // 3. 応募者管理タブに移動
    await page.click('button:has-text("応募者管理")');
    
    // 4. 新規応募登録ボタンをクリック
    await page.click('button:has-text("新規応募登録")');
    await expect(page.locator('div.modal')).toBeVisible();
    
    // 5. 応募情報を入力
    await page.selectOption('select[name="staffId"]', { label: 'テスト太郎' });
    await page.fill('input[name="applicationDate"]', '2025-04-15');
    await page.fill('textarea[name="remarks"]', 'E2Eテスト用の応募です');
    
    // 6. 応募を登録
    await page.click('button:has-text("登録")');
    
    // 7. 応募者一覧に登録した応募者が表示されることを確認
    await expect(page.locator('table.applications-table')).toContainText('テスト太郎');
    
    // 8. 応募者の詳細を表示
    await page.click('tr:has-text("テスト太郎") button:has-text("詳細")');
    await expect(page.locator('div.modal')).toBeVisible();
    
    // 9. 面接記録を追加
    await page.click('button:has-text("面接記録追加")');
    await page.fill('input[name="interviewDate"]', '2025-04-20');
    await page.fill('input[name="interviewers"]', '面接官A, 面接官B');
    await page.selectOption('select[name="result"]', '合格');
    await page.fill('textarea[name="feedback"]', '技術力が高く、コミュニケーション能力も良好');
    await page.click('button:has-text("記録")');
    
    // 10. 面接記録が追加されたことを確認
    await expect(page.locator('table.interview-records')).toContainText('合格');
    
    // 11. 応募ステータスを更新
    await page.selectOption('select[name="status"]', '採用');
    await page.click('button:has-text("ステータス更新")');
    
    // 12. モーダルを閉じる
    await page.click('button:has-text("閉じる")');
    
    // 13. 応募者一覧で更新されたステータスを確認
    await expect(page.locator('tr:has-text("テスト太郎") td.status')).toContainText('採用');
  });
});
