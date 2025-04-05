// cypress/e2e/partner_crud.spec.js
describe('パートナー企業 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理（実際のアプリケーションに合わせて調整）
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // パートナー一覧ページに移動
    cy.visit('/partners');
  });

  it('パートナー企業を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="name"]').type('テスト株式会社');
    cy.get('input[name="address"]').type('東京都渋谷区1-1-1');
    cy.get('input[name="phone"]').type('03-1234-5678');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="website"]').type('https://example.com');
    cy.get('select[name="status"]').select('候補');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('テスト株式会社').should('exist');
  });

  it('パートナー企業情報を更新できること', () => {
    // 既存のパートナーを選択
    cy.contains('テスト株式会社').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="name"]').clear().type('テスト株式会社（更新）');
    cy.get('input[name="phone"]').clear().type('03-8765-4321');
    cy.get('select[name="status"]').select('取引中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('テスト株式会社（更新）').should('exist');
  });

  it('パートナー企業を削除できること', () => {
    // 既存のパートナーを選択
    cy.contains('テスト株式会社（更新）').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('テスト株式会社（更新）').should('not.exist');
  });
});
