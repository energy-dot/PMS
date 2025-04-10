// cypress/e2e/project_crud.spec.js
describe('案件管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // 案件一覧ページに移動
    cy.visit('/projects');
  });

  it('案件を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="name"]').type('テスト案件');
    cy.get('textarea[name="description"]').type('これはテスト案件の説明です。');
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('select[name="status"]').select('募集中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('テスト案件').should('exist');
  });

  it('案件情報を更新できること', () => {
    // 既存の案件を選択
    cy.contains('テスト案件').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="name"]').clear().type('テスト案件（更新）');
    cy.get('textarea[name="description"]').clear().type('これは更新されたテスト案件の説明です。');
    cy.get('select[name="status"]').select('進行中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('テスト案件（更新）').should('exist');
  });

  it('案件を削除できること', () => {
    // 既存の案件を選択
    cy.contains('テスト案件（更新）').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('テスト案件（更新）').should('not.exist');
  });
});
