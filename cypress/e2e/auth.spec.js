// auth.spec.js - 認証機能のテスト

describe('認証機能テスト', () => {
  beforeEach(() => {
    // テスト前にローカルストレージをクリア
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // モックサーバーのセットアップ
    cy.intercept('POST', '/api/auth/login', (req) => {
      const { username, password } = req.body;
      
      // テストユーザーデータを読み込み
      cy.fixture('users').then((users) => {
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          req.reply({
            statusCode: 200,
            body: {
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name
              },
              token: 'mock-jwt-token-' + user.id
            }
          });
        } else {
          req.reply({
            statusCode: 401,
            body: {
              message: 'ユーザー名またはパスワードが正しくありません'
            }
          });
        }
      });
    });
  });

  it('AUTH-001: 有効な認証情報でログイン', () => {
    cy.visit('/login');
    
    // ログインフォームが表示されていることを確認
    cy.get('form').should('be.visible');
    
    // 有効なユーザー名とパスワードを入力
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    
    // ログインボタンをクリック
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードにリダイレクトされることを確認
    cy.url().should('include', '/dashboard');
    
    // ユーザー情報がヘッダーに表示されることを確認
    cy.get('header').contains('管理者ユーザー').should('be.visible');
  });

  it('AUTH-002: 無効な認証情報でログイン', () => {
    cy.visit('/login');
    
    // ログインフォームが表示されていることを確認
    cy.get('form').should('be.visible');
    
    // 無効なユーザー名とパスワードを入力
    cy.get('input[name="username"]').type('invalid');
    cy.get('input[name="password"]').type('invalid');
    
    // ログインボタンをクリック
    cy.get('button[type="submit"]').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('ユーザー名またはパスワードが正しくありません').should('be.visible');
    
    // ログイン画面に留まることを確認
    cy.url().should('include', '/login');
  });

  it('AUTH-003: ログアウト', () => {
    // 事前にログイン状態にする
    cy.window().then((win) => {
      win.localStorage.setItem('pms_auth_token', 'mock-jwt-token-1');
      win.localStorage.setItem('pms_user_data', JSON.stringify({
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        name: '管理者ユーザー'
      }));
    });
    
    // ダッシュボードにアクセス
    cy.visit('/dashboard');
    
    // ユーザーメニューをクリック
    cy.get('header').contains('管理者ユーザー').click();
    
    // ログアウトオプションをクリック
    cy.contains('ログアウト').click();
    
    // ログイン画面にリダイレクトされることを確認
    cy.url().should('include', '/login');
    
    // ローカルストレージからトークンが削除されていることを確認
    cy.window().then((win) => {
      expect(win.localStorage.getItem('pms_auth_token')).to.be.null;
      expect(win.localStorage.getItem('pms_user_data')).to.be.null;
    });
  });

  it('AUTH-004: 認証トークン期限切れ', () => {
    // 期限切れのトークンをセット
    cy.window().then((win) => {
      win.localStorage.setItem('pms_auth_token', 'expired-token');
      win.localStorage.setItem('pms_user_data', JSON.stringify({
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        name: '管理者ユーザー'
      }));
    });
    
    // 認証が必要なページにアクセス
    cy.visit('/dashboard');
    
    // 401エラーをシミュレート
    cy.intercept('GET', '/api/**', {
      statusCode: 401,
      body: {
        message: '認証トークンが無効または期限切れです'
      }
    });
    
    // APIリクエストを発生させる
    cy.get('body').click();
    
    // ログイン画面にリダイレクトされることを確認
    cy.url().should('include', '/login');
  });
});
