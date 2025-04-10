// cypress/e2e/antisocial_check_crud.spec.js
describe('反社チェック管理 CRUD操作', () => {
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
    
    // 反社チェック管理ページに移動
    cy.contains('反社チェック管理').click();
  });

  it('反社チェック情報を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="checkDate"]').type('2025-04-01');
    cy.get('select[name="result"]').select('問題なし');
    cy.get('input[name="validUntil"]').type('2026-03-31');
    cy.get('textarea[name="remarks"]').type('テスト用反社チェック');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('2025-04-01').should('exist');
    cy.contains('問題なし').should('exist');
  });

  it('反社チェック情報を更新できること', () => {
    // 既存の反社チェック情報を選択
    cy.contains('2025-04-01').parent('tr').find('button').contains('編集').click();
    
    // 情報を更新
    cy.get('textarea[name="remarks"]').clear().type('テスト用反社チェック（更新）');
    cy.get('input[name="validUntil"]').clear().type('2026-06-30');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('テスト用反社チェック（更新）').should('exist');
  });

  it('反社チェック情報を削除できること', () => {
    // 既存の反社チェック情報を選択して削除
    cy.contains('2025-04-01').parent('tr').find('button').contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('2025-04-01').should('not.exist');
  });
});
