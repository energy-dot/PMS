// application.spec.js - 応募管理機能のテスト

describe('応募管理テスト', () => {
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
    
    // パートナー一覧のAPIモック
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
    
    // 応募一覧のAPIモック
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
    
    // 単一応募取得のAPIモック
    cy.intercept('GET', '/api/applications/*', (req) => {
      const id = req.url.split('/').pop();
      cy.fixture('applications').then((applications) => {
        const application = applications.find(a => a.id === id);
        if (application) {
          req.reply({
            statusCode: 200,
            body: application
          });
        } else {
          req.reply({
            statusCode: 404,
            body: { message: '応募が見つかりません' }
          });
        }
      });
    }).as('getApplication');
    
    // 応募作成のAPIモック
    cy.intercept('POST', '/api/applications', (req) => {
      const newApplication = {
        id: '4',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newApplication
      });
    }).as('createApplication');
    
    // 応募更新のAPIモック
    cy.intercept('PUT', '/api/applications/*', (req) => {
      const id = req.url.split('/').pop();
      const updatedApplication = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 200,
        body: updatedApplication
      });
    }).as('updateApplication');
    
    // 面接記録登録のAPIモック
    cy.intercept('POST', '/api/applications/*/interview-records', (req) => {
      const applicationId = req.url.split('/')[3];
      const newRecord = {
        id: '1',
        applicationId,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newRecord
      });
    }).as('createInterviewRecord');
  });

  it('APPLICATION-001: 新規応募登録', () => {
    // 案件詳細画面にアクセス
    cy.visit('/projects/1');
    cy.wait('@getProject');
    
    // 「応募登録」ボタンをクリック
    cy.contains('応募登録').click();
    
    // パートナー会社を選択
    cy.wait('@getPartners');
    cy.get('select[name="partnerId"]').select('デザインクリエイト株式会社');
    
    // 応募要員情報を入力
    cy.get('input[name="applicantName"]').type('山本健太');
    cy.get('input[name="applicantEmail"]').type('yamamoto@designcreate.example.com');
    cy.get('input[name="applicantPhone"]').type('090-1111-2222');
    
    // スキル情報を入力
    cy.get('input[name="skills"]').type('Java, Spring Boot, React');
    cy.get('input[name="experience"]').type('7');
    cy.get('input[name="expectedRate"]').type('820000');
    cy.get('input[name="availableFrom"]').type('2023-11-01');
    cy.get('textarea[name="remarks"]').type('フルリモート希望');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createApplication');
    
    // 成功メッセージが表示されることを確認
    cy.contains('応募が正常に登録されました').should('be.visible');
    
    // 案件の応募一覧に新しい応募が表示されることを確認
    cy.contains('山本健太').should('be.visible');
  });

  it('APPLICATION-002: 応募ステータス更新', () => {
    // 応募一覧画面にアクセス
    cy.visit('/applications');
    cy.wait('@getApplications');
    
    // 更新したい応募の「ステータス変更」ボタンをクリック
    cy.contains('tr', '田中健太').find('button').contains('ステータス変更').click();
    
    // 新しいステータスを選択
    cy.get('select[name="status"]').select('内定');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updateApplication');
    
    // 成功メッセージが表示されることを確認
    cy.contains('応募ステータスが正常に更新されました').should('be.visible');
    
    // 更新されたステータスが応募一覧に反映されることを確認
    cy.contains('tr', '田中健太').contains('内定').should('be.visible');
  });

  it('APPLICATION-003: 応募検索', () => {
    // 応募一覧画面にアクセス
    cy.visit('/applications');
    cy.wait('@getApplications');
    
    // 検索フィールドに検索キーワードを入力
    cy.get('input[placeholder*="検索"]').type('田中');
    
    // 検索ボタンをクリック
    cy.contains('button', '検索').click();
    
    // 検索条件に合致する応募のみが表示されることを確認
    cy.contains('田中健太').should('be.visible');
    cy.contains('中村美咲').should('not.exist');
    cy.contains('伊藤誠').should('not.exist');
  });

  it('APPLICATION-004: 応募詳細表示', () => {
    // 応募一覧画面にアクセス
    cy.visit('/applications');
    cy.wait('@getApplications');
    
    // 詳細を表示したい応募の「詳細」ボタンをクリック
    cy.contains('tr', '田中健太').find('button').contains('詳細').click();
    cy.wait('@getApplication');
    
    // 応募の詳細情報が表示されることを確認
    cy.contains('田中健太').should('be.visible');
    cy.contains('tanaka@designcreate.example.com').should('be.visible');
    cy.contains('090-9876-5432').should('be.visible');
    cy.contains('選考中').should('be.visible');
    cy.contains('Java, Spring Boot, MySQL, Docker').should('be.visible');
    cy.contains('6年').should('be.visible');
    cy.contains('780,000円').should('be.visible');
    cy.contains('2023-05-01').should('be.visible');
    cy.contains('リモートワーク希望').should('be.visible');
  });

  it('APPLICATION-005: 選考結果登録', () => {
    // 応募詳細画面にアクセス
    cy.visit('/applications/1');
    cy.wait('@getApplication');
    
    // 「面接記録登録」ボタンをクリック
    cy.contains('面接記録登録').click();
    
    // 面接情報を入力
    cy.get('input[name="interviewDate"]').type('2023-09-20T10:00');
    cy.get('select[name="interviewType"]').select('2次面接');
    cy.get('input[name="interviewers"]').type('山田部長、佐藤課長');
    cy.get('textarea[name="feedback"]').type('技術力は高く、コミュニケーションも良好。チームへの適合性も問題なし。採用を推薦。');
    cy.get('select[name="result"]').select('合格');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createInterviewRecord');
    
    // 成功メッセージが表示されることを確認
    cy.contains('面接記録が正常に登録されました').should('be.visible');
    
    // 面接記録が表示されることを確認
    cy.contains('2023-09-20').should('be.visible');
    cy.contains('2次面接').should('be.visible');
    cy.contains('山田部長、佐藤課長').should('be.visible');
    cy.contains('合格').should('be.visible');
    
    // ステータス変更ボタンをクリック
    cy.contains('ステータス変更').click();
    
    // 新しいステータスを選択
    cy.get('select[name="status"]').select('内定');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updateApplication');
    
    // 成功メッセージが表示されることを確認
    cy.contains('応募ステータスが正常に更新されました').should('be.visible');
    
    // 更新されたステータスが表示されることを確認
    cy.contains('内定').should('be.visible');
  });
});
