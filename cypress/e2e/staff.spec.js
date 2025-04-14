// staff.spec.js - 要員管理機能のテスト

describe('要員管理テスト', () => {
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
    
    // 要員一覧のAPIモック
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
    
    // 単一要員取得のAPIモック
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
    
    // 要員作成のAPIモック
    cy.intercept('POST', '/api/staff', (req) => {
      const newStaff = {
        id: '4',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newStaff
      });
    }).as('createStaff');
    
    // 要員更新のAPIモック
    cy.intercept('PUT', '/api/staff/*', (req) => {
      const id = req.url.split('/').pop();
      const updatedStaff = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 200,
        body: updatedStaff
      });
    }).as('updateStaff');
    
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

  it('STAFF-001: 新規要員登録', () => {
    // 要員一覧画面にアクセス
    cy.visit('/staff');
    cy.wait('@getStaff');
    
    // 「新規要員登録」ボタンをクリック
    cy.contains('新規要員登録').click();
    
    // パートナー選択
    cy.wait('@getPartners');
    cy.get('select[name="partnerId"]').select('株式会社テックパートナー');
    
    // 必須項目を入力
    cy.get('input[name="name"]').type('テスト要員');
    
    // オプション項目を入力
    cy.get('input[name="email"]').type('test@techpartner.example.com');
    cy.get('input[name="phone"]').type('090-1234-5678');
    cy.get('select[name="status"]').select('待機中');
    cy.get('select[name="departmentId"]').select('システム開発部');
    cy.get('select[name="sectionId"]').select('開発1課');
    
    // スキル情報を入力
    cy.contains('スキル追加').click();
    cy.get('input[name="skills[0]"]').type('Java');
    cy.get('select[name="skillLevels[0]"]').select('4');
    
    cy.contains('スキル追加').click();
    cy.get('input[name="skills[1]"]').type('Spring Boot');
    cy.get('select[name="skillLevels[1]"]').select('3');
    
    cy.get('input[name="experience"]').type('5');
    cy.get('textarea[name="resume"]').type('Javaによる基幹システム開発経験5年');
    cy.get('textarea[name="remarks"]').type('テスト用要員データ');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createStaff');
    
    // 成功メッセージが表示されることを確認
    cy.contains('要員が正常に登録されました').should('be.visible');
    
    // 要員一覧に新しい要員が表示されることを確認
    cy.contains('テスト要員').should('be.visible');
  });

  it('STAFF-002: 要員情報編集', () => {
    // 要員一覧画面にアクセス
    cy.visit('/staff');
    cy.wait('@getStaff');
    
    // 編集したい要員の「編集」ボタンをクリック
    cy.contains('tr', '山田太郎').find('button').contains('編集').click();
    
    // 情報を変更
    cy.get('input[name="phone"]').clear().type('090-9999-8888');
    cy.get('input[name="experience"]').clear().type('9');
    cy.get('textarea[name="remarks"]').clear().type('情報を更新しました');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updateStaff');
    
    // 成功メッセージが表示されることを確認
    cy.contains('要員情報が正常に更新されました').should('be.visible');
    
    // 変更された情報が反映されていることを確認
    cy.contains('090-9999-8888').should('be.visible');
  });

  it('STAFF-003: 要員検索', () => {
    // 要員一覧画面にアクセス
    cy.visit('/staff');
    cy.wait('@getStaff');
    
    // 検索フィールドに検索キーワードを入力
    cy.get('input[placeholder*="検索"]').type('山田');
    
    // 検索ボタンをクリック
    cy.contains('button', '検索').click();
    
    // 検索条件に合致する要員のみが表示されることを確認
    cy.contains('山田太郎').should('be.visible');
    cy.contains('佐藤花子').should('not.exist');
    cy.contains('鈴木一郎').should('not.exist');
  });

  it('STAFF-004: 要員詳細表示', () => {
    // 要員一覧画面にアクセス
    cy.visit('/staff');
    cy.wait('@getStaff');
    
    // 詳細を表示したい要員の名前をクリック
    cy.contains('山田太郎').click();
    cy.wait('@getStaffMember');
    
    // 要員の詳細情報が表示されることを確認
    cy.contains('山田太郎').should('be.visible');
    cy.contains('yamada@techpartner.example.com').should('be.visible');
    cy.contains('090-1234-5678').should('be.visible');
    cy.contains('稼働中').should('be.visible');
    cy.contains('Java').should('be.visible');
    cy.contains('Spring Boot').should('be.visible');
    cy.contains('Oracle').should('be.visible');
    cy.contains('AWS').should('be.visible');
    cy.contains('8年').should('be.visible');
    cy.contains('コミュニケーション能力が高い').should('be.visible');
  });

  it('STAFF-005: スキル情報登録', () => {
    // 要員詳細画面にアクセス
    cy.visit('/staff/2');
    cy.wait('@getStaffMember');
    
    // 「スキル」セクションの「編集」ボタンをクリック
    cy.contains('スキル').parent().find('button').contains('編集').click();
    
    // 新しいスキルを追加
    cy.contains('スキル追加').click();
    cy.get('input[name="skills[4]"]').type('Terraform');
    cy.get('select[name="skillLevels[4]"]').select('4');
    
    // 既存のスキルレベルを更新
    cy.get('select[name="skillLevels[0]"]').select('5');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updateStaff');
    
    // 成功メッセージが表示されることを確認
    cy.contains('スキル情報が正常に更新されました').should('be.visible');
    
    // 更新されたスキル情報が表示されることを確認
    cy.contains('Terraform').should('be.visible');
    cy.contains('AWS: 5').should('be.visible');
  });

  it('STAFF-006: 要員評価登録', () => {
    // 要員詳細画面にアクセス
    cy.visit('/staff/3');
    cy.wait('@getStaffMember');
    
    // 「評価」タブをクリック
    cy.contains('評価').click();
    
    // 「新規評価登録」ボタンをクリック
    cy.contains('新規評価登録').click();
    
    // 評価情報を入力
    cy.get('select[name="projectId"]').select('ECサイトリニューアル');
    cy.get('input[name="evaluationDate"]').type('2023-09-30');
    cy.get('select[name="technicalSkill"]').select('4');
    cy.get('select[name="communicationSkill"]').select('3');
    cy.get('select[name="problemSolving"]').select('4');
    cy.get('select[name="teamwork"]').select('3');
    cy.get('select[name="deliveryQuality"]').select('4');
    cy.get('textarea[name="strengths"]').type('デザインスキルとフロントエンド開発の技術力が高い。');
    cy.get('textarea[name="areasForImprovement"]').type('チームメンバーとのコミュニケーションをより積極的に行うことが望ましい。');
    cy.get('textarea[name="comments"]').type('全体的に良好な成果を出している。');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    
    // 成功メッセージが表示されることを確認
    cy.contains('評価が正常に登録されました').should('be.visible');
    
    // 評価履歴に新しいエントリが表示されることを確認
    cy.contains('2023-09-30').should('be.visible');
    cy.contains('ECサイトリニューアル').should('be.visible');
    cy.contains('3.6').should('be.visible');
  });
});
