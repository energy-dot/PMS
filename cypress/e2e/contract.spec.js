// contract.spec.js - 契約管理機能のテスト

describe('契約管理テスト', () => {
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
    
    // 契約一覧のAPIモック
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
    
    // 単一契約取得のAPIモック
    cy.intercept('GET', '/api/contracts/*', (req) => {
      const id = req.url.split('/').pop();
      cy.fixture('contracts').then((contracts) => {
        const contract = contracts.find(c => c.id === id);
        if (contract) {
          req.reply({
            statusCode: 200,
            body: contract
          });
        } else {
          req.reply({
            statusCode: 404,
            body: { message: '契約が見つかりません' }
          });
        }
      });
    }).as('getContract');
    
    // 契約作成のAPIモック
    cy.intercept('POST', '/api/contracts', (req) => {
      const newContract = {
        id: '4',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newContract
      });
    }).as('createContract');
    
    // 契約更新のAPIモック
    cy.intercept('PUT', '/api/contracts/*', (req) => {
      const id = req.url.split('/').pop();
      const updatedContract = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 200,
        body: updatedContract
      });
    }).as('updateContract');
    
    // 契約更新（延長）のAPIモック
    cy.intercept('POST', '/api/contracts/*/renew', (req) => {
      const id = req.url.split('/')[3];
      const renewedContract = {
        id: '5',
        originalContractId: id,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: renewedContract
      });
    }).as('renewContract');
    
    // 契約終了のAPIモック
    cy.intercept('POST', '/api/contracts/*/terminate', (req) => {
      const id = req.url.split('/')[3];
      req.reply({
        statusCode: 200,
        body: {
          id,
          status: '終了',
          terminationDate: req.body.terminationDate,
          terminationReason: req.body.terminationReason,
          updatedAt: new Date().toISOString()
        }
      });
    }).as('terminateContract');
  });

  it('CONTRACT-001: 新規契約登録', () => {
    // 契約一覧画面にアクセス
    cy.visit('/contracts');
    cy.wait('@getContracts');
    
    // 「新規契約登録」ボタンをクリック
    cy.contains('新規契約登録').click();
    
    // 案件を選択
    cy.wait('@getProjects');
    cy.get('select[name="projectId"]').select('基幹システム刷新プロジェクト');
    
    // 要員を選択
    cy.wait('@getStaff');
    cy.get('select[name="staffId"]').select('鈴木一郎');
    
    // 必須項目を入力
    cy.get('input[name="startDate"]').type('2023-10-01');
    cy.get('input[name="endDate"]').type('2024-03-31');
    cy.get('input[name="rate"]').type('800000');
    cy.get('select[name="contractType"]').select('準委任');
    
    // オプション項目を入力
    cy.get('input[name="workLocation"]').type('東京都千代田区');
    cy.get('input[name="workingHours"]').type('9:00-18:00');
    cy.get('input[name="isRemote"]').check();
    cy.get('textarea[name="remarks"]').type('週2回オンサイト、他リモート');
    cy.get('input[name="paymentTerms"]').type('月末締め翌月末払い');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createContract');
    
    // 成功メッセージが表示されることを確認
    cy.contains('契約が正常に登録されました').should('be.visible');
    
    // 契約一覧に新しい契約が表示されることを確認
    cy.contains('鈴木一郎').should('be.visible');
    cy.contains('基幹システム刷新プロジェクト').should('be.visible');
  });

  it('CONTRACT-002: 契約情報編集', () => {
    // 契約一覧画面にアクセス
    cy.visit('/contracts');
    cy.wait('@getContracts');
    
    // 編集したい契約の「編集」ボタンをクリック
    cy.contains('tr', '山田太郎').contains('tr', '基幹システム刷新プロジェクト').find('button').contains('編集').click();
    
    // 情報を変更
    cy.get('input[name="rate"]').clear().type('880000');
    cy.get('textarea[name="remarks"]').clear().type('週1回オンサイト、他リモートに変更');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updateContract');
    
    // 成功メッセージが表示されることを確認
    cy.contains('契約情報が正常に更新されました').should('be.visible');
    
    // 変更された情報が反映されていることを確認
    cy.contains('880,000円').should('be.visible');
  });

  it('CONTRACT-003: 契約検索', () => {
    // 契約一覧画面にアクセス
    cy.visit('/contracts');
    cy.wait('@getContracts');
    
    // 検索フィールドに検索キーワードを入力
    cy.get('input[placeholder*="検索"]').type('山田');
    
    // 検索ボタンをクリック
    cy.contains('button', '検索').click();
    
    // 検索条件に合致する契約のみが表示されることを確認
    cy.contains('山田太郎').should('be.visible');
    cy.contains('佐藤花子').should('not.exist');
    cy.contains('鈴木一郎').should('not.exist');
  });

  it('CONTRACT-004: 契約詳細表示', () => {
    // 契約一覧画面にアクセス
    cy.visit('/contracts');
    cy.wait('@getContracts');
    
    // 詳細を表示したい契約の「詳細」ボタンをクリック
    cy.contains('tr', '山田太郎').contains('tr', '基幹システム刷新プロジェクト').find('button').contains('詳細').click();
    cy.wait('@getContract');
    
    // 契約の詳細情報が表示されることを確認
    cy.contains('基幹システム刷新プロジェクト').should('be.visible');
    cy.contains('山田太郎').should('be.visible');
    cy.contains('2023-04-01').should('be.visible');
    cy.contains('2023-09-30').should('be.visible');
    cy.contains('850,000円').should('be.visible');
    cy.contains('準委任').should('be.visible');
    cy.contains('東京都千代田区').should('be.visible');
    cy.contains('9:00-18:00').should('be.visible');
    cy.contains('週2回オンサイト、他リモート').should('be.visible');
    cy.contains('月末締め翌月末払い').should('be.visible');
  });

  it('CONTRACT-005: 契約更新', () => {
    // 契約詳細画面にアクセス
    cy.visit('/contracts/1');
    cy.wait('@getContract');
    
    // 「契約更新」ボタンをクリック
    cy.contains('契約更新').click();
    
    // 新しい契約期間と条件を入力
    cy.get('input[name="startDate"]').type('2023-10-01');
    cy.get('input[name="endDate"]').type('2024-03-31');
    cy.get('input[name="rate"]').clear().type('880000');
    cy.get('textarea[name="remarks"]').clear().type('契約更新。週1回オンサイト、他リモート');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@renewContract');
    
    // 成功メッセージが表示されることを確認
    cy.contains('契約が更新されました').should('be.visible');
    
    // 更新履歴に新しいエントリが追加されることを確認
    cy.contains('2023-10-01 〜 2024-03-31').should('be.visible');
    cy.contains('880,000円').should('be.visible');
  });

  it('CONTRACT-006: 契約終了', () => {
    // 契約詳細画面にアクセス
    cy.visit('/contracts/2');
    cy.wait('@getContract');
    
    // 「契約終了」ボタンをクリック
    cy.contains('契約終了').click();
    
    // 終了日と理由を入力
    cy.get('input[name="terminationDate"]').type('2023-09-30');
    cy.get('textarea[name="terminationReason"]').type('プロジェクト早期完了のため');
    
    // 「確定」ボタンをクリック
    cy.contains('確定').click();
    cy.wait('@terminateContract');
    
    // 成功メッセージが表示されることを確認
    cy.contains('契約が終了処理されました').should('be.visible');
    
    // 契約のステータスが更新されていることを確認
    cy.contains('終了').should('be.visible');
    cy.contains('2023-09-30').should('be.visible');
    cy.contains('プロジェクト早期完了のため').should('be.visible');
  });
});
