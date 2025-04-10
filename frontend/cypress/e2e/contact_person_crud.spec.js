// cypress/e2e/contact_person_crud.spec.js
describe('営業窓口管理 CRUD操作', () => {
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
    
    // 営業窓口管理ページに移動
    cy.contains('営業窓口管理').click();
  });

  it('営業窓口担当者を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規担当者登録').click();
    
    // フォームに入力
    cy.get('input[name="name"]').type('山田太郎');
    cy.get('select[name="type"]').select('営業担当');
    cy.get('input[name="position"]').type('営業部長');
    cy.get('input[name="department"]').type('営業部');
    cy.get('input[name="email"]').type('yamada@example.com');
    cy.get('input[name="phone"]').type('03-1234-5678');
    cy.get('input[name="mobilePhone"]').type('090-1234-5678');
    cy.get('textarea[name="remarks"]').type('テスト用担当者');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('山田太郎').should('exist');
    cy.contains('営業部長').should('exist');
  });

  it('営業窓口担当者情報を更新できること', () => {
    // 既存の担当者情報を選択
    cy.contains('山田太郎').parent('tr').find('button').contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="position"]').clear().type('営業次長');
    cy.get('input[name="email"]').clear().type('yamada_new@example.com');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('山田太郎').should('exist');
    cy.contains('営業次長').should('exist');
  });

  it('営業窓口担当者を削除できること', () => {
    // 既存の担当者情報を選択して削除
    cy.contains('山田太郎').parent('tr').find('button').contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('山田太郎').should('not.exist');
  });
});
