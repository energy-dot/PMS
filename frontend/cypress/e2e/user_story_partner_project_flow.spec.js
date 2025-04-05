// cypress/e2e/user_story_partner_project_flow.spec.js
describe('ユーザーストーリー: パートナー企業登録から案件アサインまで', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードに移動していることを確認
    cy.url().should('include', '/dashboard');
  });

  it('パートナー企業の登録から案件アサインまでの一連の流れをテストする', () => {
    // 1. パートナー企業の登録
    cy.contains('パートナー管理').click();
    cy.url().should('include', '/partners');
    cy.contains('新規登録').click();
    
    // パートナー情報入力
    const partnerName = 'テストパートナー株式会社' + Date.now();
    cy.get('input[name="name"]').type(partnerName);
    cy.get('input[name="address"]').type('東京都渋谷区1-1-1');
    cy.get('input[name="phone"]').type('03-1234-5678');
    cy.get('input[name="email"]').type('test-partner@example.com');
    cy.get('input[name="website"]').type('https://example.com');
    cy.get('select[name="status"]').select('取引中');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(partnerName).should('exist');
    
    // 2. 窓口担当者の登録
    cy.contains(partnerName).click();
    cy.contains('窓口担当者').click();
    cy.contains('新規登録').click();
    
    // 窓口担当者情報入力
    const contactName = '担当太郎';
    cy.get('input[name="name"]').type(contactName);
    cy.get('input[name="email"]').type('tantou@example.com');
    cy.get('input[name="phone"]').type('090-1234-5678');
    cy.get('input[name="position"]').type('営業部長');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(contactName).should('exist');
    
    // 3. 案件の登録
    cy.contains('案件管理').click();
    cy.url().should('include', '/projects');
    cy.contains('新規登録').click();
    
    // 案件情報入力
    const projectName = 'テストプロジェクト' + Date.now();
    cy.get('input[name="name"]').type(projectName);
    cy.get('textarea[name="description"]').type('これはテスト用の案件です');
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('select[name="status"]').select('募集中');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(projectName).should('exist');
    
    // 4. 要員の登録
    cy.contains('要員管理').click();
    cy.url().should('include', '/staff');
    cy.contains('新規登録').click();
    
    // 要員情報入力
    const staffName = '山田太郎' + Date.now();
    cy.get('input[name="name"]').type(staffName);
    cy.get('select[name="partnerId"]').select(partnerName);
    cy.get('input[name="email"]').type('yamada@example.com');
    cy.get('input[name="phone"]').type('090-1234-5678');
    cy.get('select[name="skillLevel"]').select('中級');
    cy.get('input[name="hourlyRate"]').type('5000');
    
    // 保存
    cy.contains('保存').click();
    cy.contains(staffName).should('exist');
    
    // 5. 契約の登録（要員を案件にアサイン）
    cy.contains('契約管理').click();
    cy.url().should('include', '/contracts');
    cy.contains('新規登録').click();
    
    // 契約情報入力
    cy.get('select[name="staffId"]').select(staffName);
    cy.get('select[name="projectId"]').select(projectName);
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('input[name="rate"]').type('5000');
    cy.get('select[name="status"]').select('契約中');
    
    // 保存
    cy.contains('保存').click();
    
    // 契約が登録されていることを確認
    cy.contains(staffName).should('exist');
    cy.contains(projectName).should('exist');
    
    // 6. ダッシュボードで確認
    cy.contains('ダッシュボード').click();
    cy.url().should('include', '/dashboard');
    
    // KPIが更新されていることを確認
    cy.contains('パートナー会社数').parent().should('contain', '1');
    cy.contains('案件数').parent().should('contain', '1');
    cy.contains('稼働中要員数').parent().should('contain', '1');
  });
});
