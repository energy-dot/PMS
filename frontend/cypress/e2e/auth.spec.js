// cypress/e2e/auth.spec.js
describe('認証機能', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('有効な認証情報でログインできること', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードにリダイレクトされることを確認
    cy.url().should('include', '/dashboard');
    cy.contains('ダッシュボード').should('exist');
  });

  it('無効な認証情報ではログインできないこと', () => {
    cy.get('input[name="username"]').type('invalid');
    cy.get('input[name="password"]').type('invalid');
    cy.get('button[type="submit"]').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('ユーザー名またはパスワードが正しくありません').should('exist');
    cy.url().should('include', '/login');
  });

  it('ログアウトが正常に機能すること', () => {
    // ログイン
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ログアウト
    cy.contains('ログアウト').click();
    
    // ログイン画面にリダイレクトされることを確認
    cy.url().should('include', '/login');
  });
});
