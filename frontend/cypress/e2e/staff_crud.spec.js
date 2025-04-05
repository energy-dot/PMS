// cypress/e2e/staff_crud.spec.js
describe('要員管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // 要員一覧ページに移動
    cy.visit('/staff');
  });

  it('要員を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="name"]').type('山田太郎');
    cy.get('select[name="partnerId"]').select('テスト株式会社'); // パートナー企業を選択
    cy.get('input[name="email"]').type('yamada@example.com');
    cy.get('input[name="phone"]').type('090-1234-5678');
    cy.get('select[name="skillLevel"]').select('中級');
    cy.get('input[name="hourlyRate"]').type('5000');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('山田太郎').should('exist');
  });

  it('要員情報を更新できること', () => {
    // 既存の要員を選択
    cy.contains('山田太郎').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="name"]').clear().type('山田次郎');
    cy.get('input[name="email"]').clear().type('jiro@example.com');
    cy.get('select[name="skillLevel"]').select('上級');
    cy.get('input[name="hourlyRate"]').clear().type('6000');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('山田次郎').should('exist');
  });

  it('要員を削除できること', () => {
    // 既存の要員を選択
    cy.contains('山田次郎').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('山田次郎').should('not.exist');
  });
});
