// cypress/e2e/user_story_contract_management.spec.js
describe('ユーザーストーリー: 契約管理と更新フロー', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードに移動していることを確認
    cy.url().should('include', '/dashboard');
  });

  it('契約の作成から更新、終了までの一連の流れをテストする', () => {
    // 1. パートナー企業の登録
    cy.contains('パートナー管理').click();
    cy.url().should('include', '/partners');
    cy.contains('新規登録').click();
    
    // パートナー情報入力
    const partnerName = 'テスト契約パートナー' + Date.now();
    cy.get('input[name="name"]').type(partnerName);
    cy.get('input[name="address"]').type('東京都新宿区1-1-1');
    cy.get('input[name="phone"]').type('03-9876-5432');
    cy.get('input[name="email"]').type('contract-partner@example.com');
    cy.get('select[name="status"]').select('取引中');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(partnerName).should('exist');
    
    // 2. 案件の登録
    cy.contains('案件管理').click();
    cy.url().should('include', '/projects');
    cy.contains('新規登録').click();
    
    // 案件情報入力
    const projectName = '契約テストプロジェクト' + Date.now();
    cy.get('input[name="name"]').type(projectName);
    cy.get('textarea[name="description"]').type('これは契約テスト用の案件です');
    cy.get('input[name="startDate"]').type('2025-06-01');
    cy.get('input[name="endDate"]').type('2026-05-31');
    cy.get('select[name="status"]').select('進行中');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(projectName).should('exist');
    
    // 3. 要員の登録
    cy.contains('要員管理').click();
    cy.url().should('include', '/staff');
    cy.contains('新規登録').click();
    
    // 要員情報入力
    const staffName = '契約太郎' + Date.now();
    cy.get('input[name="name"]').type(staffName);
    cy.get('select[name="partnerId"]').select(partnerName);
    cy.get('input[name="email"]').type('keiyaku@example.com');
    cy.get('input[name="phone"]').type('090-8765-4321');
    cy.get('select[name="skillLevel"]').select('上級');
    cy.get('input[name="hourlyRate"]').type('6000');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(staffName).should('exist');
    
    // 4. 契約の登録
    cy.contains('契約管理').click();
    cy.url().should('include', '/contracts');
    cy.contains('新規登録').click();
    
    // 契約情報入力
    cy.get('select[name="staffId"]').select(staffName);
    cy.get('select[name="projectId"]').select(projectName);
    cy.get('input[name="startDate"]').type('2025-06-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('input[name="rate"]').type('6000');
    cy.get('select[name="status"]').select('契約中');
    
    // 保存
    cy.contains('保存').click();
    
    // 契約が登録されていることを確認
    cy.contains(staffName).should('exist');
    cy.contains(projectName).should('exist');
    
    // 5. 契約の更新
    cy.contains('tr', staffName).contains(projectName).parent('tr').click();
    cy.contains('編集').click();
    
    // 契約情報の更新
    cy.get('input[name="endDate"]').clear().type('2026-03-31');
    cy.get('input[name="rate"]').clear().type('6500');
    cy.get('textarea[name="notes"]').type('契約期間延長と単価アップ');
    
    // 保存
    cy.contains('保存').click();
    
    // 更新が反映されていることを確認
    cy.contains('2026-03-31').should('exist');
    cy.contains('6,500').should('exist');
    
    // 6. 契約の終了
    cy.contains('tr', staffName).contains(projectName).parent('tr').click();
    cy.contains('編集').click();
    
    // 契約終了処理
    cy.get('select[name="status"]').select('終了');
    cy.get('textarea[name="notes"]').clear().type('プロジェクト早期完了のため契約終了');
    
    // 保存
    cy.contains('保存').click();
    
    // 終了が反映されていることを確認
    cy.contains('終了').should('exist');
    
    // 7. ダッシュボードで確認
    cy.contains('ダッシュボード').click();
    cy.url().should('include', '/dashboard');
    
    // 契約終了により稼働中要員数が減少していることを確認
    cy.contains('稼働中要員数').parent().should('contain', '0');
  });
});
