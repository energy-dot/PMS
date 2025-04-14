// partner.spec.js - パートナー管理機能のテスト

describe('パートナー管理テスト', () => {
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
    
    // 単一パートナー取得のAPIモック
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
    
    // パートナー作成のAPIモック
    cy.intercept('POST', '/api/partners', (req) => {
      const newPartner = {
        id: '4',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newPartner
      });
    }).as('createPartner');
    
    // パートナー更新のAPIモック
    cy.intercept('PUT', '/api/partners/*', (req) => {
      const id = req.url.split('/').pop();
      const updatedPartner = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 200,
        body: updatedPartner
      });
    }).as('updatePartner');
    
    // 反社チェック情報登録のAPIモック
    cy.intercept('POST', '/api/partners/*/antisocial-checks', (req) => {
      const partnerId = req.url.split('/')[3];
      const newCheck = {
        id: '1',
        partnerId,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newCheck
      });
    }).as('createAntisocialCheck');
  });

  it('PARTNER-001: 新規パートナー登録', () => {
    // パートナー一覧画面にアクセス
    cy.visit('/partners');
    cy.wait('@getPartners');
    
    // 「新規パートナー登録」ボタンをクリック
    cy.contains('新規パートナー登録').click();
    
    // 必須項目を入力
    cy.get('input[name="name"]').type('テストパートナー株式会社');
    cy.get('input[name="address"]').type('東京都新宿区新宿1-1-1');
    cy.get('input[name="phone"]').type('03-1111-2222');
    
    // オプション項目を入力
    cy.get('input[name="email"]').type('info@testpartner.example.com');
    cy.get('input[name="website"]').type('https://testpartner.example.com');
    cy.get('select[name="businessCategory"]').select('システム開発');
    cy.get('input[name="establishedYear"]').type('2020');
    cy.get('input[name="employeeCount"]').type('50');
    cy.get('input[name="annualRevenue"]').type('2億円');
    cy.get('textarea[name="remarks"]').type('テスト用パートナー');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createPartner');
    
    // 成功メッセージが表示されることを確認
    cy.contains('パートナーが正常に登録されました').should('be.visible');
    
    // パートナー一覧に新しいパートナーが表示されることを確認
    cy.contains('テストパートナー株式会社').should('be.visible');
  });

  it('PARTNER-002: パートナー情報編集', () => {
    // パートナー一覧画面にアクセス
    cy.visit('/partners');
    cy.wait('@getPartners');
    
    // 編集したいパートナーの「編集」ボタンをクリック
    cy.contains('tr', '株式会社テックパートナー').find('button').contains('編集').click();
    
    // 情報を変更
    cy.get('input[name="phone"]').clear().type('03-9999-8888');
    cy.get('input[name="email"]').clear().type('new-info@techpartner.example.com');
    cy.get('textarea[name="remarks"]').clear().type('情報を更新しました');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@updatePartner');
    
    // 成功メッセージが表示されることを確認
    cy.contains('パートナー情報が正常に更新されました').should('be.visible');
    
    // 変更された情報が反映されていることを確認
    cy.contains('03-9999-8888').should('be.visible');
  });

  it('PARTNER-003: パートナー検索', () => {
    // パートナー一覧画面にアクセス
    cy.visit('/partners');
    cy.wait('@getPartners');
    
    // 検索フィールドに検索キーワードを入力
    cy.get('input[placeholder*="検索"]').type('テック');
    
    // 検索ボタンをクリック
    cy.contains('button', '検索').click();
    
    // 検索条件に合致するパートナーのみが表示されることを確認
    cy.contains('株式会社テックパートナー').should('be.visible');
    cy.contains('インフラソリューション株式会社').should('not.exist');
    cy.contains('デザインクリエイト株式会社').should('not.exist');
  });

  it('PARTNER-004: パートナー詳細表示', () => {
    // パートナー一覧画面にアクセス
    cy.visit('/partners');
    cy.wait('@getPartners');
    
    // 詳細を表示したいパートナーの名前をクリック
    cy.contains('株式会社テックパートナー').click();
    cy.wait('@getPartner');
    
    // パートナーの詳細情報が表示されることを確認
    cy.contains('株式会社テックパートナー').should('be.visible');
    cy.contains('東京都渋谷区神宮前5-52-2').should('be.visible');
    cy.contains('03-1234-5678').should('be.visible');
    cy.contains('info@techpartner.example.com').should('be.visible');
    cy.contains('https://techpartner.example.com').should('be.visible');
    cy.contains('システム開発').should('be.visible');
    cy.contains('2010年').should('be.visible');
    cy.contains('120名').should('be.visible');
    cy.contains('5億円').should('be.visible');
    cy.contains('大規模開発案件の実績あり').should('be.visible');
    
    // 関連情報（反社チェック、基本契約、営業窓口など）が表示されることを確認
    cy.contains('反社チェック').should('be.visible');
    cy.contains('基本契約').should('be.visible');
    cy.contains('営業窓口').should('be.visible');
  });

  it('PARTNER-005: 反社チェック情報登録', () => {
    // パートナー詳細画面にアクセス
    cy.visit('/partners/2');
    cy.wait('@getPartner');
    
    // 「反社チェック」タブをクリック
    cy.contains('反社チェック').click();
    
    // 「新規チェック登録」ボタンをクリック
    cy.contains('新規チェック登録').click();
    
    // チェック情報を入力
    cy.get('input[name="checkDate"]').type('2023-09-15');
    cy.get('select[name="result"]').select('問題なし');
    cy.get('textarea[name="remarks"]').type('インターネット検索および信用調査機関の情報を確認。問題は見つからなかった。');
    
    // 「保存」ボタンをクリック
    cy.contains('保存').click();
    cy.wait('@createAntisocialCheck');
    
    // 成功メッセージが表示されることを確認
    cy.contains('反社チェック情報が正常に登録されました').should('be.visible');
    
    // チェック履歴に新しいエントリが表示されることを確認
    cy.contains('2023-09-15').should('be.visible');
    cy.contains('問題なし').should('be.visible');
  });
});
