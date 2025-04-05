// cypress/e2e/contract_crud.spec.js
describe('個別契約管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // 契約一覧ページに移動
    cy.visit('/contracts');
  });

  it('個別契約を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('select[name="staffId"]').select('山田太郎'); // 要員を選択
    cy.get('select[name="projectId"]').select('テスト案件'); // 案件を選択
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('input[name="rate"]').type('5000');
    cy.get('select[name="status"]').select('契約中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認（契約IDが表示されることを確認）
    cy.contains('山田太郎').should('exist');
    cy.contains('テスト案件').should('exist');
  });

  it('個別契約情報を更新できること', () => {
    // 既存の契約を選択（山田太郎のテスト案件契約）
    cy.contains('tr', '山田太郎').contains('テスト案件').parent('tr').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="endDate"]').clear().type('2026-03-31');
    cy.get('input[name="rate"]').clear().type('5500');
    cy.get('textarea[name="notes"]').type('契約期間と単価を更新');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('2026-03-31').should('exist');
    cy.contains('5,500').should('exist');
  });

  it('個別契約を削除できること', () => {
    // 既存の契約を選択
    cy.contains('tr', '山田太郎').contains('テスト案件').parent('tr').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('tr', '山田太郎').contains('テスト案件').should('not.exist');
  });
});
