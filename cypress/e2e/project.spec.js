// project.spec.js - 案件管理機能のテスト

describe('案件管理テスト', () => {
  beforeEach(() => {
    // テスト前にログイン状態にする
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
    
    // 案件一覧のAPIモック
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
    
    // 単一案件取得のAPIモック
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
    
    // 案件作成のAPIモック
    cy.intercept('POST', '/api/projects', (req) => {
      const newProject = {
        id: '4',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newProject
      });
    }).as('createProject');
    
    // 案件更新のAPIモック
    cy.intercept('PUT', '/api/projects/*', (req) => {
      const id = req.url.split('/').pop();
      const updatedProject = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 200,
        body: updatedProject
      });
    }).as('updateProject');
    
    // 案件承認申請のAPIモック
    cy.intercept('POST', '/api/projects/*/submit-approval', (req) => {
      const id = req.url.split('/')[3];
      req.reply({
        statusCode: 200,
        body: {
          id,
          status: '承認待ち',
          approvalStatus: '承認待ち',
          updatedAt: new Date().toISOString()
        }
      });
    }).as('submitApproval');
    
    // 案件承認処理のAPIモック
    cy.intercept('POST', '/api/projects/*/approve', (req) => {
      const id = req.url.split('/')[3];
      req.reply({
        statusCode: 200,
        body: {
          id,
          status: '募集中',
          approvalStatus: '承認済み',
          approvedBy: '1',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }).as('approveProject');
    
    // 案件差し戻しのAPIモック
    cy.intercept('POST', '/api/projects/*/reject', (req) => {
      const id = req.url.split('/')[3];
      req.reply({
        statusCode: 200,
        body: {
          id,
          status: '差し戻し',
          approvalStatus: '差し戻し',
          rejectionReason: req.body.reason,
          updatedAt: new Date().toISOString()
        }
      });
    }).as('rejectProject');
    
    // 部門一覧のAPIモック
    cy.intercept('GET', '/api/departments*', {
      statusCode: 200,
      body: [
        { id: '1', name: 'システム開発部' },
        { id: '2', name: 'デジタルマーケティング部' },
        { id: '3', name: '情報システム部' }
      ]
    }).as('getDepartments');
    
    // セクション一覧のAPIモック
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
  });

  it('PROJECT-001: 新規案件登録', () => {
    // 案件一覧画面にアクセス
    cy.visit('/projects');
    cy.wait('@getProjects');
    
    // 「新規案件登録」ボタンをクリック
    cy.contains('新規案件登録').click();
    
    // 必須項目を入力
    cy.get('input[name="name"]').type('テスト案件');
    cy.get('select[name="departmentId"]').select('システム開発部');
    cy.get('select[name="sectionId"]').select('開発1課');
    cy.get('input[name="startDate"]').type('2023-10-01');
    cy.get('input[name="endDate"]').type('2024-03-31');
    
    // オプション項目を入力
    cy.get('textarea[name="description"]').type('テスト用の案件です');
    cy.get('textarea[name="requiredSkills"]').type('Java, Spring Boot, React');
    cy.get('input[name="requiredNumber"]').type('3');
    cy.get('input[name="budget"]').type('5000万円');
    cy.get('input[name="location"]').type('東京都新宿区');
    cy.get('input[name="workingHours"]').type('9:00-18:00');
    cy.get('input[name="isRemote"]').check();
    cy.get('textarea[name="remarks"]').type('リモートワーク可');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createProject');
    
    // 成功メッセージが表示されることを確認
    cy.contains('案件が正常に登録されました').should('be.visible');
    
    // 案件一覧に新しい案件が表示されることを確認
    cy.contains('テスト案件').should('be.visible');
  });

  it('PROJECT-002: 案件情報編集', () => {
    // 案件一覧画面にアクセス
    cy.visit('/projects');
    cy.wait('@getProjects');
    
    // 編集したい案件の「編集」ボタンをクリック
    cy.contains('tr', '基幹システム刷新プロジェクト').find('button').contains('編集').click();
    
    // 情報を変更
    cy.get('textarea[name="description"]').clear().type('説明を更新しました');
    cy.get('input[name="budget"]').clear().type('9000万円');
    cy.get('textarea[name="remarks"]').clear().type('リモートワーク可、週1回のオンサイト必須に変更');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updateProject');
    
    // 成功メッセージが表示されることを確認
    cy.contains('案件情報が正常に更新されました').should('be.visible');
    
    // 変更された情報が反映されていることを確認
    cy.contains('説明を更新しました').should('be.visible');
  });

  it('PROJECT-003: 案件検索', () => {
    // 案件一覧画面にアクセス
    cy.visit('/projects');
    cy.wait('@getProjects');
    
    // 検索フィールドに検索キーワードを入力
    cy.get('input[placeholder*="検索"]').type('基幹');
    
    // 検索ボタンをクリック
    cy.contains('button', '検索').click();
    
    // 検索条件に合致する案件のみが表示されることを確認
    cy.contains('基幹システム刷新プロジェクト').should('be.visible');
    cy.contains('ECサイトリニューアル').should('not.exist');
    cy.contains('社内ポータル開発').should('not.exist');
  });

  it('PROJECT-004: 案件詳細表示', () => {
    // 案件一覧画面にアクセス
    cy.visit('/projects');
    cy.wait('@getProjects');
    
    // 詳細を表示したい案件の名前をクリック
    cy.contains('基幹システム刷新プロジェクト').click();
    cy.wait('@getProject');
    
    // 案件の詳細情報が表示されることを確認
    cy.contains('基幹システム刷新プロジェクト').should('be.visible');
    cy.contains('システム開発部').should('be.visible');
    cy.contains('老朽化した基幹システムの刷新プロジェクト').should('be.visible');
    cy.contains('2023-04-01').should('be.visible');
    cy.contains('2024-03-31').should('be.visible');
    cy.contains('募集中').should('be.visible');
    cy.contains('Java, Spring Boot, Oracle, AWS').should('be.visible');
    cy.contains('5年以上のJava開発経験').should('be.visible');
    cy.contains('8000万円').should('be.visible');
    cy.contains('東京都千代田区').should('be.visible');
    cy.contains('9:00-18:00').should('be.visible');
    cy.contains('リモートワーク可').should('be.visible');
  });

  it('PROJECT-005: 案件承認申請', () => {
    // 承認待ちの案件詳細画面にアクセス
    cy.visit('/projects/3');
    cy.wait('@getProject');
    
    // 「承認申請」ボタンをクリック
    cy.contains('承認申請').click();
    
    // 確認ダイアログで「はい」をクリック
    cy.contains('この案件を承認申請しますか？').should('be.visible');
    cy.contains('はい').click();
    cy.wait('@submitApproval');
    
    // 成功メッセージが表示されることを確認
    cy.contains('承認申請が完了しました').should('be.visible');
    
    // 案件のステータスが更新されていることを確認
    cy.contains('承認待ち').should('be.visible');
  });

  it('PROJECT-006: 案件承認処理', () => {
    // 承認権限を持つユーザーでログイン状態にする
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
    
    // 承認待ち案件一覧画面にアクセス
    cy.visit('/approvals');
    cy.wait('@getProjects');
    
    // 承認したい案件の「詳細」ボタンをクリック
    cy.contains('tr', '社内ポータル開発').find('button').contains('詳細').click();
    cy.wait('@getProject');
    
    // 案件内容を確認
    cy.contains('社内ポータル開発').should('be.visible');
    
    // 「承認」ボタンをクリック
    cy.contains('承認').click();
    
    // 確認ダイアログで「はい」をクリック
    cy.contains('この案件を承認しますか？').should('be.visible');
    cy.contains('はい').click();
    cy.wait('@approveProject');
    
    // 成功メッセージが表示されることを確認
    cy.contains('案件が承認されました').should('be.visible');
    
    // 案件のステータスが更新されていることを確認
    cy.contains('募集中').should('be.visible');
  });

  it('PROJECT-007: 案件差し戻し', () => {
    // 承認権限を持つユーザーでログイン状態にする
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
    
    // 承認待ち案件一覧画面にアクセス
    cy.visit('/approvals');
    cy.wait('@getProjects');
    
    // 差し戻したい案件の「詳細」ボタンをクリック
    cy.contains('tr', '社内ポータル開発').find('button').contains('詳細').click();
    cy.wait('@getProject');
    
    // 「差し戻し」ボタンをクリック
    cy.contains('差し戻し').click();
    
    // 差し戻し理由を入力
    cy.get('textarea[name="rejectionReason"]').type('予算の詳細が不足しています。見積もりを詳細化してください。');
    
    // 確認ダイアログで「送信」をクリック
    cy.contains('送信').click();
    cy.wait('@rejectProject');
    
    // 成功メッセージが表示されることを確認
    cy.contains('案件が差し戻されました').should('be.visible');
    
    // 案件のステータスが更新されていることを確認
    cy.contains('差し戻し').should('be.visible');
  });
});
