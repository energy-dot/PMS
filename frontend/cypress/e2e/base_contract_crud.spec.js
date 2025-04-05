// cypress/e2e/base_contract_crud.spec.js
describe('基本契約管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // パートナー一覧ページに移動
    cy.visit('/partners');
    
    // テスト用パートナーを選択
    cy.contains('テスト株式会社').click();
    
    // 基本契約管理ページに移動
    cy.contains('基本契約管理').click();
  });

  it('基本契約情報を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="contractNumber"]').type('CT-2025-001');
    cy.get('input[name="startDate"]').type('2025-04-01');
    cy.get('input[name="endDate"]').type('2026-03-31');
    cy.get('select[name="status"]').select('有効');
    cy.get('select[name="autoRenewal"]').select('あり');
    cy.get('input[name="notificationDate"]').type('2026-01-31');
    cy.get('textarea[name="remarks"]').type('テスト用基本契約');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('CT-2025-001').should('exist');
    cy.contains('有効').should('exist');
  });

  it('基本契約情報を更新できること', () => {
    // 既存の基本契約情報を選択
    cy.contains('CT-2025-001').parent('tr').find('button').contains('編集').click();
    
    // 情報を更新
    cy.get('textarea[name="remarks"]').clear().type('テスト用基本契約（更新）');
    cy.get('input[name="endDate"]').clear().type('2026-06-30');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('テスト用基本契約（更新）').should('exist');
    cy.contains('2026-06-30').should('exist');
  });

  it('基本契約情報を削除できること', () => {
    // 既存の基本契約情報を選択して削除
    cy.contains('CT-2025-001').parent('tr').find('button').contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('CT-2025-001').should('not.exist');
  });
});
