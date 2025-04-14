// cypress/support/mock-server.js
// モックサーバーの設定

// APIレスポンスのモック設定
export const setupMockServer = () => {
  // 認証関連のモック
  cy.intercept('POST', '/api/auth/login', (req) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            name: '管理者ユーザー'
          },
          token: 'mock-jwt-token-1'
        }
      });
    } else if (username === 'manager' && password === 'manager123') {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: '2',
            username: 'manager',
            email: 'manager@example.com',
            role: 'manager',
            name: 'マネージャーユーザー'
          },
          token: 'mock-jwt-token-2'
        }
      });
    } else if (username === 'user' && password === 'user123') {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: '3',
            username: 'user',
            email: 'user@example.com',
            role: 'user',
            name: '一般ユーザー'
          },
          token: 'mock-jwt-token-3'
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
  }).as('login');

  // パートナー関連のモック
  cy.intercept('GET', '/api/partners*', (req) => {
    cy.fixture('partners').then((partners) => {
      req.reply({
        statusCode: 200,
        body: {
          data: partners,
          total: partners.length,
          page: 1,
          limit: 10
        }
      });
    });
  }).as('getPartners');
  
  cy.intercept('GET', '/api/partners/*', (req) => {
    const id = req.url.split('/').pop();
    cy.fixture('partners').then((partners) => {
      const partner = partners.find(p => p.id === id);
      if (partner) {
        req.reply({
          statusCode: 200,
          body: partner
        });
      } else {
        req.reply({
          statusCode: 404,
          body: { message: 'パートナーが見つかりません' }
        });
      }
    });
  }).as('getPartner');
  
  // 案件関連のモック
  cy.intercept('GET', '/api/projects*', (req) => {
    cy.fixture('projects').then((projects) => {
      req.reply({
        statusCode: 200,
        body: {
          data: projects,
          total: projects.length,
          page: 1,
          limit: 10
        }
      });
    });
  }).as('getProjects');
  
  cy.intercept('GET', '/api/projects/*', (req) => {
    const id = req.url.split('/').pop();
    cy.fixture('projects').then((projects) => {
      const project = projects.find(p => p.id === id);
      if (project) {
        req.reply({
          statusCode: 200,
          body: project
        });
      } else {
        req.reply({
          statusCode: 404,
          body: { message: '案件が見つかりません' }
        });
      }
    });
  }).as('getProject');
  
  // 要員関連のモック
  cy.intercept('GET', '/api/staff*', (req) => {
    cy.fixture('staff').then((staff) => {
      req.reply({
        statusCode: 200,
        body: {
          data: staff,
          total: staff.length,
          page: 1,
          limit: 10
        }
      });
    });
  }).as('getStaff');
  
  cy.intercept('GET', '/api/staff/*', (req) => {
    const id = req.url.split('/').pop();
    cy.fixture('staff').then((staffList) => {
      const staff = staffList.find(s => s.id === id);
      if (staff) {
        req.reply({
          statusCode: 200,
          body: staff
        });
      } else {
        req.reply({
          statusCode: 404,
          body: { message: '要員が見つかりません' }
        });
      }
    });
  }).as('getStaffMember');
  
  // 契約関連のモック
  cy.intercept('GET', '/api/contracts*', (req) => {
    cy.fixture('contracts').then((contracts) => {
      req.reply({
        statusCode: 200,
        body: {
          data: contracts,
          total: contracts.length,
          page: 1,
          limit: 10
        }
      });
    });
  }).as('getContracts');
  
  // 応募関連のモック
  cy.intercept('GET', '/api/applications*', (req) => {
    cy.fixture('applications').then((applications) => {
      req.reply({
        statusCode: 200,
        body: {
          data: applications,
          total: applications.length,
          page: 1,
          limit: 10
        }
      });
    });
  }).as('getApplications');
  
  // 評価関連のモック
  cy.intercept('GET', '/api/evaluations*', (req) => {
    cy.fixture('evaluations').then((evaluations) => {
      req.reply({
        statusCode: 200,
        body: {
          data: evaluations,
          total: evaluations.length,
          page: 1,
          limit: 10
        }
      });
    });
  }).as('getEvaluations');
  
  // 部門・セクション関連のモック
  cy.intercept('GET', '/api/departments*', {
    statusCode: 200,
    body: [
      { id: '1', name: 'システム開発部' },
      { id: '2', name: 'デジタルマーケティング部' },
      { id: '3', name: '情報システム部' }
    ]
  }).as('getDepartments');
  
  cy.intercept('GET', '/api/sections*', {
    statusCode: 200,
    body: [
      { id: '1', name: '開発1課', departmentId: '1' },
      { id: '2', name: '開発2課', departmentId: '1' },
      { id: '3', name: 'マーケティング1課', departmentId: '2' },
      { id: '4', name: 'マーケティング2課', departmentId: '2' },
      { id: '5', name: 'インフラ課', departmentId: '3' }
    ]
  }).as('getSections');
  
  // HTML要素のモック
  cy.intercept('GET', '/', {
    statusCode: 200,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <title>パートナー要員管理システム</title>
        </head>
        <body>
          <div id="root">
            <h1>パートナー要員管理システム</h1>
            <p>モックHTMLページ</p>
          </div>
        </body>
      </html>
    `
  }).as('getRoot');
  
  cy.intercept('GET', '/login', {
    statusCode: 200,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ログイン - パートナー要員管理システム</title>
        </head>
        <body>
          <div id="root">
            <h1>ログイン</h1>
            <form>
              <input name="username" placeholder="ユーザー名" />
              <input name="password" type="password" placeholder="パスワード" />
              <button type="submit">ログイン</button>
            </form>
          </div>
        </body>
      </html>
    `
  }).as('getLoginPage');
  
  cy.intercept('GET', '/dashboard', {
    statusCode: 200,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ダッシュボード - パートナー要員管理システム</title>
        </head>
        <body>
          <div id="root">
            <header>
              <h1>ダッシュボード</h1>
              <div class="user-info">管理者ユーザー</div>
            </header>
            <main>
              <div class="dashboard-content">
                <h2>システム概要</h2>
                <p>パートナー要員管理システムへようこそ</p>
              </div>
            </main>
          </div>
        </body>
      </html>
    `
  }).as('getDashboardPage');
};
