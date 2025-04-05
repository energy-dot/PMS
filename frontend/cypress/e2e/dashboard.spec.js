// cypress/e2e/dashboard.spec.js
describe('ダッシュボード機能', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードページに移動
    cy.visit('/dashboard');
  });

  it('ダッシュボードに主要KPIが表示されること', () => {
    // 主要KPIの表示確認
    cy.contains('パートナー会社数').should('exist');
    cy.contains('案件数').should('exist');
    cy.contains('稼働中要員数').should('exist');
  });

  it('ダッシュボードから各機能ページに遷移できること', () => {
    // パートナー一覧へ遷移
    cy.contains('パートナー管理').click();
    cy.url().should('include', '/partners');
    cy.go('back');
    
    // 案件一覧へ遷移
    cy.contains('案件管理').click();
    cy.url().should('include', '/projects');
    cy.go('back');
    
    // 要員一覧へ遷移
    cy.contains('要員管理').click();
    cy.url().should('include', '/staff');
    cy.go('back');
    
    // 契約一覧へ遷移
    cy.contains('契約管理').click();
    cy.url().should('include', '/contracts');
  });
});
