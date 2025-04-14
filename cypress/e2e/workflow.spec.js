// workflow.spec.js - 統合ワークフローテスト

describe('統合ワークフローテスト', () => {
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
    
    // 各種APIモック
    // パートナー関連
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
    
    cy.intercept('POST', '/api/partners/*/contact-persons', (req) => {
      const partnerId = req.url.split('/')[3];
      const newPerson = {
        id: '1',
        partnerId,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newPerson
      });
    }).as('createContactPerson');
    
    // 要員関連
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
    
    // 案件関連
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
    
    // 応募関連
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
    
    // 契約関連
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
    
    // 評価関連
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
    
    cy.intercept('POST', '/api/evaluations', (req) => {
      const newEvaluation = {
        id: '4',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply({
        statusCode: 201,
        body: newEvaluation
      });
    }).as('createEvaluation');
    
    // 部門・セクション関連
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
  });

  it('FLOW-001: パートナー登録から要員登録までの流れ', () => {
    // 1. 新規パートナーを登録する
    cy.visit('/partners');
    cy.wait('@getPartners');
    
    cy.contains('新規パートナー登録').click();
    
    cy.get('input[name="name"]').type('ワークフローテスト株式会社');
    cy.get('input[name="address"]').type('東京都新宿区新宿1-1-1');
    cy.get('input[name="phone"]').type('03-1111-2222');
    cy.get('input[name="email"]').type('info@workflowtest.example.com');
    cy.get('input[name="website"]').type('https://workflowtest.example.com');
    cy.get('select[name="businessCategory"]').select('システム開発');
    cy.get('input[name="establishedYear"]').type('2018');
    cy.get('input[name="employeeCount"]').type('45');
    cy.get('input[name="annualRevenue"]').type('2億円');
    cy.get('textarea[name="remarks"]').type('統合テスト用パートナー');
    
    cy.contains('保存').click();
    cy.wait('@createPartner');
    
    cy.contains('パートナーが正常に登録されました').should('be.visible');
    
    // 2. パートナー詳細画面で反社チェック情報を登録する
    cy.contains('ワークフローテスト株式会社').click();
    
    cy.contains('反社チェック').click();
    cy.contains('新規チェック登録').click();
    
    cy.get('input[name="checkDate"]').type('2023-09-15');
    cy.get('select[name="result"]').select('問題なし');
    cy.get('textarea[name="remarks"]').type('インターネット検索および信用調査機関の情報を確認。問題は見つからなかった。');
    
    cy.contains('保存').click();
    cy.wait('@createAntisocialCheck');
    
    cy.contains('反社チェック情報が正常に登録されました').should('be.visible');
    
    // 3. パートナー詳細画面で営業窓口担当者を追加する
    cy.contains('営業窓口').click();
    cy.contains('新規担当者登録').click();
    
    cy.get('input[name="name"]').type('営業 太郎');
    cy.get('input[name="position"]').type('営業部長');
    cy.get('input[name="email"]').type('eigyo@workflowtest.example.com');
    cy.get('input[name="phone"]').type('090-1111-2222');
    
    cy.contains('保存').click();
    cy.wait('@createContactPerson');
    
    cy.contains('担当者が正常に登録されました').should('be.visible');
    
    // 4. パートナーに紐づく新規要員を登録する
    cy.visit('/staff');
    cy.wait('@getStaff');
    
    cy.contains('新規要員登録').click();
    
    cy.wait('@getPartners');
    cy.get('select[name="partnerId"]').select('ワークフローテスト株式会社');
    
    cy.get('input[name="name"]').type('統合 太郎');
    cy.get('input[name="email"]').type('taro@workflowtest.example.com');
    cy.get('input[name="phone"]').type('090-2222-3333');
    cy.get('select[name="status"]').select('待機中');
    cy.get('select[name="departmentId"]').select('システム開発部');
    cy.get('select[name="sectionId"]').select('開発1課');
    
    // 5. 要員のスキル情報を登録する
    cy.contains('スキル追加').click();
    cy.get('input[name="skills[0]"]').type('Java');
    cy.get('select[name="skillLevels[0]"]').select('4');
    
    cy.contains('スキル追加').click();
    cy.get('input[name="skills[1]"]').type('Spring Boot');
    cy.get('select[name="skillLevels[1]"]').select('3');
    
    cy.contains('スキル追加').click();
    cy.get('input[name="skills[2]"]').type('React');
    cy.get('select[name="skillLevels[2]"]').select('4');
    
    cy.get('input[name="experience"]').type('6');
    cy.get('textarea[name="resume"]').type('Webアプリケーション開発経験6年。Java/Spring Boot、Reactでの開発実績多数。');
    cy.get('textarea[name="remarks"]').type('統合テスト用要員データ');
    
    cy.contains('保存').click();
    cy.wait('@createStaff');
    
    cy.contains('要員が正常に登録されました').should('be.visible');
    cy.contains('統合 太郎').should('be.visible');
  });

  it('FLOW-002: 案件作成から承認までの流れ', () => {
    // 1. 新規案件を登録する
    cy.visit('/projects');
    cy.wait('@getProjects');
    
    cy.contains('新規案件登録').click();
    
    cy.get('input[name="name"]').type('統合テスト用案件');
    cy.get('select[name="departmentId"]').select('システム開発部');
    cy.get('select[name="sectionId"]').select('開発1課');
    cy.get('input[name="startDate"]').type('2023-11-01');
    cy.get('input[name="endDate"]').type('2024-04-30');
    
    cy.get('textarea[name="description"]').type('統合テスト用の案件です。Webアプリケーション開発プロジェクト。');
    cy.get('textarea[name="requiredSkills"]').type('Java, Spring Boot, React, AWS');
    cy.get('input[name="requiredNumber"]').type('3');
    cy.get('input[name="budget"]').type('6000万円');
    cy.get('input[name="location"]').type('東京都新宿区');
    cy.get('input[name="workingHours"]').type('9:00-18:00');
    cy.get('input[name="isRemote"]').check();
    cy.get('textarea[name="remarks"]').type('リモートワーク可、週1回のオンサイト必須');
    
    cy.contains('保存').click();
    cy.wait('@createProject');
    
    cy.contains('案件が正常に登録されました').should('be.visible');
    
    // 2. 案件の承認申請を行う
    cy.contains('統合テスト用案件').click();
    
    cy.contains('承認申請').click();
    cy.contains('この案件を承認申請しますか？').should('be.visible');
    cy.contains('はい').click();
    cy.wait('@submitApproval');
    
    cy.contains('承認申請が完了しました').should('be.visible');
    cy.contains('承認待ち').should('be.visible');
    
    // 3. 承認権限を持つユーザーでログインする（すでにadminでログイン済み）
    
    // 4. 案件を承認する
    cy.visit('/approvals');
    cy.wait('@getProjects');
    
    cy.contains('tr', '統合テスト用案件').find('button').contains('詳細').click();
    
    cy.contains('承認').click();
    cy.contains('この案件を承認しますか？').should('be.visible');
    cy.contains('はい').click();
    cy.wait('@approveProject');
    
    cy.contains('案件が承認されました').should('be.visible');
    cy.contains('募集中').should('be.visible');
  });

  it('FLOW-003: 案件公開から応募、選考、契約までの流れ', () => {
    // 1. 案件に対して応募を登録する
    cy.visit('/projects/1');
    cy.wait('@getProjects');
    
    cy.contains('応募登録').click();
    
    cy.wait('@getPartners');
    cy.get('select[name="partnerId"]').select('ワークフローテスト株式会社');
    
    cy.get('input[name="applicantName"]').type('応募 花子');
    cy.get('input[name="applicantEmail"]').type('hanako@workflowtest.example.com');
    cy.get('input[name="applicantPhone"]').type('090-3333-4444');
    
    cy.get('input[name="skills"]').type('Java, Spring Boot, Oracle, AWS');
    cy.get('input[name="experience"]').type('7');
    cy.get('input[name="expectedRate"]').type('850000');
    cy.get('input[name="availableFrom"]').type('2023-10-15');
    cy.get('textarea[name="remarks"]').type('週2回のオンサイト対応可能');
    
    cy.contains('保存').click();
    cy.wait('@createApplication');
    
    cy.contains('応募が正常に登録されました').should('be.visible');
    
    // 2. 応募ステータスを「選考中」に更新する
    cy.visit('/applications');
    cy.wait('@getApplications');
    
    cy.contains('tr', '応募 花子').find('button').contains('ステータス変更').click();
    
    cy.get('select[name="status"]').select('選考中');
    
    cy.contains('保存').click();
    cy.wait('@updateApplication');
    
    cy.contains('応募ステータスが正常に更新されました').should('be.visible');
    
    // 3. 面接記録を登録する
    cy.contains('tr', '応募 花子').find('button').contains('詳細').click();
    
    cy.contains('面接記録登録').click();
    
    cy.get('input[name="interviewDate"]').type('2023-09-25T14:00');
    cy.get('select[name="interviewType"]').select('1次面接');
    cy.get('input[name="interviewers"]').type('山田部長、佐藤課長');
    cy.get('textarea[name="feedback"]').type('技術力は高く、コミュニケーションも良好。プロジェクト経験も豊富。2次面接へ進めることを推奨。');
    cy.get('select[name="result"]').select('合格');
    
    cy.contains('保存').click();
    cy.wait('@createInterviewRecord');
    
    cy.contains('面接記録が正常に登録されました').should('be.visible');
    
    // 4. 応募ステータスを「内定」に更新する
    cy.contains('ステータス変更').click();
    
    cy.get('select[name="status"]').select('内定');
    
    cy.contains('保存').click();
    cy.wait('@updateApplication');
    
    cy.contains('応募ステータスが正常に更新されました').should('be.visible');
    
    // 5. 契約を登録する
    cy.visit('/contracts');
    cy.wait('@getContracts');
    
    cy.contains('新規契約登録').click();
    
    cy.wait('@getProjects');
    cy.get('select[name="projectId"]').select('基幹システム刷新プロジェクト');
    
    cy.wait('@getStaff');
    cy.get('select[name="staffId"]').select('統合 太郎');
    
    cy.get('input[name="startDate"]').type('2023-10-15');
    cy.get('input[name="endDate"]').type('2024-03-31');
    cy.get('input[name="rate"]').type('850000');
    cy.get('select[name="contractType"]').select('準委任');
    
    cy.get('input[name="workLocation"]').type('東京都千代田区');
    cy.get('input[name="workingHours"]').type('9:00-18:00');
    cy.get('input[name="isRemote"]').check();
    cy.get('textarea[name="remarks"]').type('週2回オンサイト、他リモート');
    cy.get('input[name="paymentTerms"]').type('月末締め翌月末払い');
    
    cy.contains('保存').click();
    cy.wait('@createContract');
    
    cy.contains('契約が正常に登録されました').should('be.visible');
  });

  it('FLOW-004: 契約開始から評価、契約更新までの流れ', () => {
    // 1. 要員の評価を登録する
    cy.visit('/staff/4'); // 統合 太郎の詳細画面
    cy.wait('@getStaff');
    
    cy.contains('評価').click();
    cy.contains('新規評価登録').click();
    
    cy.get('select[name="projectId"]').select('基幹システム刷新プロジェクト');
    cy.get('input[name="evaluationDate"]').type('2023-12-31');
    cy.get('select[name="technicalSkill"]').select('4');
    cy.get('select[name="communicationSkill"]').select('4');
    cy.get('select[name="problemSolving"]').select('5');
    cy.get('select[name="teamwork"]').select('4');
    cy.get('select[name="deliveryQuality"]').select('4');
    cy.get('textarea[name="strengths"]').type('技術力が高く、問題解決能力に優れている。チームへの貢献度も高い。');
    cy.get('textarea[name="areasForImprovement"]').type('ドキュメント作成スキルの向上が望まれる。');
    cy.get('textarea[name="comments"]').type('全体的に非常に良好なパフォーマンスを発揮している。今後も継続して起用したい人材。');
    
    cy.contains('保存').click();
    cy.wait('@createEvaluation');
    
    cy.contains('評価が正常に登録されました').should('be.visible');
    
    // 2. 契約を更新する
    cy.visit('/contracts');
    cy.wait('@getContracts');
    
    cy.contains('tr', '統合 太郎').contains('tr', '基幹システム刷新プロジェクト').find('button').contains('詳細').click();
    
    cy.contains('契約更新').click();
    
    cy.get('input[name="startDate"]').type('2024-04-01');
    cy.get('input[name="endDate"]').type('2024-09-30');
    cy.get('input[name="rate"]').clear().type('880000');
    cy.get('textarea[name="remarks"]').clear().type('契約更新。週1回オンサイト、他リモート');
    
    cy.contains('保存').click();
    cy.wait('@createContract');
    
    cy.contains('契約が更新されました').should('be.visible');
  });

  it('ERROR-001: 必須項目未入力でのフォーム送信', () => {
    // パートナー登録画面で必須項目を空のままにする
    cy.visit('/partners');
    cy.wait('@getPartners');
    
    cy.contains('新規パートナー登録').click();
    
    // 名前を入力せずに保存ボタンをクリック
    cy.contains('保存').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('名前は必須項目です').should('be.visible');
    
    // フォームが送信されないことを確認（APIリクエストが発生しない）
    cy.get('@createPartner.all').should('have.length', 0);
  });

  it('ERROR-002: 不正なデータ形式での入力', () => {
    // 要員登録画面で不正な形式のメールアドレスを入力
    cy.visit('/staff');
    cy.wait('@getStaff');
    
    cy.contains('新規要員登録').click();
    
    cy.wait('@getPartners');
    cy.get('select[name="partnerId"]').select('株式会社テックパートナー');
    
    cy.get('input[name="name"]').type('テスト要員');
    cy.get('input[name="email"]').type('invalid-email');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('有効なメールアドレスを入力してください').should('be.visible');
    
    // フォームが送信されないことを確認（APIリクエストが発生しない）
    cy.get('@createStaff.all').should('have.length', 0);
  });

  it('ERROR-003: 権限外の操作実行', () => {
    // 一般ユーザーでログイン状態にする
    cy.window().then((win) => {
      win.localStorage.setItem('pms_auth_token', 'mock-jwt-token-3');
      win.localStorage.setItem('pms_user_data', JSON.stringify({
        id: '3',
        username: 'user',
        email: 'user@example.com',
        role: 'user',
        name: '一般ユーザー'
      }));
    });
    
    // 承認権限が必要な操作を実行しようとする
    cy.visit('/projects/3');
    
    // 承認ボタンが表示されないことを確認
    cy.contains('承認').should('not.exist');
    
    // URL操作で承認アクションを実行しようとする
    cy.intercept('POST', '/api/projects/3/approve', {
      statusCode: 403,
      body: {
        message: 'この操作を実行する権限がありません'
      }
    }).as('unauthorizedApprove');
    
    // 直接APIを呼び出そうとする（実際のUIでは不可能だが、テストとして）
    cy.request({
      method: 'POST',
      url: '/api/projects/3/approve',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body.message).to.eq('この操作を実行する権限がありません');
    });
  });

  it('ERROR-004: ネットワーク接続エラー', () => {
    // ネットワーク接続エラーをシミュレート
    cy.intercept('GET', '/api/partners*', {
      forceNetworkError: true
    }).as('networkError');
    
    // パートナー一覧画面にアクセス
    cy.visit('/partners');
    
    // エラーメッセージが表示されることを確認
    cy.contains('ネットワークエラーが発生しました').should('be.visible');
    cy.contains('接続を確認して再試行してください').should('be.visible');
    
    // リトライボタンが表示されることを確認
    cy.contains('再試行').should('be.visible');
    
    // リトライボタンをクリック
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
    }).as('getPartnersRetry');
    
    cy.contains('再試行').click();
    cy.wait('@getPartnersRetry');
    
    // データが正常に表示されることを確認
    cy.contains('株式会社テックパートナー').should('be.visible');
  });
});
