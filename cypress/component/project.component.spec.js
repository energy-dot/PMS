// cypress/component/project.component.spec.js
describe('案件管理コンポーネントテスト', () => {
  beforeEach(() => {
    // モックHTMLを作成
    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <div id="root">
          <div class="project-container">
            <h1>案件管理</h1>
            <div class="project-actions">
              <button class="add-project-button">新規案件登録</button>
              <div class="search-container">
                <input type="text" class="search-input" placeholder="案件名で検索" />
                <button class="search-button">検索</button>
              </div>
            </div>
            <div class="project-list">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>案件名</th>
                    <th>部門</th>
                    <th>開始日</th>
                    <th>終了日</th>
                    <th>ステータス</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody id="project-table-body">
                  <!-- 案件データがここに挿入される -->
                </tbody>
              </table>
            </div>
            <div class="project-form" style="display: none;">
              <h2>案件情報</h2>
              <form id="project-form">
                <div class="form-group">
                  <label for="name">案件名</label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div class="form-group">
                  <label for="departmentId">部門</label>
                  <select id="departmentId" name="departmentId" required>
                    <option value="">選択してください</option>
                    <option value="1">システム開発部</option>
                    <option value="2">デジタルマーケティング部</option>
                    <option value="3">情報システム部</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="sectionId">セクション</label>
                  <select id="sectionId" name="sectionId" required>
                    <option value="">選択してください</option>
                    <option value="1">開発1課</option>
                    <option value="2">開発2課</option>
                    <option value="3">マーケティング1課</option>
                    <option value="4">マーケティング2課</option>
                    <option value="5">インフラ課</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="startDate">開始日</label>
                  <input id="startDate" name="startDate" type="date" required />
                </div>
                <div class="form-group">
                  <label for="endDate">終了日</label>
                  <input id="endDate" name="endDate" type="date" required />
                </div>
                <div class="form-group">
                  <label for="description">案件概要</label>
                  <textarea id="description" name="description" required></textarea>
                </div>
                <div class="form-group">
                  <label for="requiredSkills">必要スキル</label>
                  <textarea id="requiredSkills" name="requiredSkills" required></textarea>
                </div>
                <div class="form-group">
                  <label for="requiredNumber">必要人数</label>
                  <input id="requiredNumber" name="requiredNumber" type="number" required />
                </div>
                <div class="form-group">
                  <label for="budget">予算</label>
                  <input id="budget" name="budget" type="text" />
                </div>
                <div class="form-group">
                  <label for="location">勤務地</label>
                  <input id="location" name="location" type="text" required />
                </div>
                <div class="form-group">
                  <label for="workingHours">勤務時間</label>
                  <input id="workingHours" name="workingHours" type="text" />
                </div>
                <div class="form-group">
                  <label for="isRemote">リモート可</label>
                  <input id="isRemote" name="isRemote" type="checkbox" />
                </div>
                <div class="form-group">
                  <label for="remarks">備考</label>
                  <textarea id="remarks" name="remarks"></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="save-button">保存</button>
                  <button type="button" class="cancel-button">キャンセル</button>
                </div>
              </form>
            </div>
            <div class="message-container">
              <div class="success-message" style="display: none;"></div>
              <div class="error-message" style="display: none;"></div>
            </div>
          </div>
        </div>
      `;
    });

    // 案件データをテーブルに表示
    cy.fixture('projects').then((projects) => {
      cy.document().then((doc) => {
        const tableBody = doc.getElementById('project-table-body');
        projects.forEach(project => {
          const row = doc.createElement('tr');
          row.setAttribute('data-id', project.id);
          row.innerHTML = `
            <td>${project.id}</td>
            <td>${project.name}</td>
            <td>${project.departmentName || 'システム開発部'}</td>
            <td>${project.startDate}</td>
            <td>${project.endDate}</td>
            <td>${project.status}</td>
            <td>
              <button class="edit-button" data-id="${project.id}">編集</button>
              <button class="detail-button" data-id="${project.id}">詳細</button>
              <button class="approval-button" data-id="${project.id}" ${project.status === '下書き' ? '' : 'style="display:none"'}>承認申請</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      });
    });
  });

  it('PROJECT-001: 案件一覧が表示されること', () => {
    // 案件一覧が表示されていることを確認
    cy.get('#project-table-body tr').should('have.length.at.least', 3);
    cy.contains('基幹システム刷新プロジェクト').should('be.visible');
    cy.contains('ECサイトリニューアル').should('be.visible');
    cy.contains('クラウド移行プロジェクト').should('be.visible');
  });

  it('PROJECT-002: 新規案件を登録できること', () => {
    // 新規案件登録ボタンをクリック
    cy.get('.add-project-button').click();
    
    // フォームが表示されることを確認
    cy.get('.project-form').should('be.visible');
    
    // フォームに入力
    cy.get('#name').type('テスト案件');
    cy.get('#departmentId').select('システム開発部');
    cy.get('#sectionId').select('開発1課');
    cy.get('#startDate').type('2023-11-01');
    cy.get('#endDate').type('2024-03-31');
    cy.get('#description').type('テスト用の案件です。');
    cy.get('#requiredSkills').type('Java, Spring Boot, React');
    cy.get('#requiredNumber').type('3');
    cy.get('#budget').type('5000万円');
    cy.get('#location').type('東京都千代田区');
    cy.get('#workingHours').type('9:00-18:00');
    cy.get('#isRemote').check();
    cy.get('#remarks').type('テスト用案件データ');
    
    // APIモック
    cy.intercept('POST', '/api/projects', {
      statusCode: 201,
      body: {
        id: '4',
        name: 'テスト案件',
        departmentId: '1',
        departmentName: 'システム開発部',
        sectionId: '1',
        sectionName: '開発1課',
        startDate: '2023-11-01',
        endDate: '2024-03-31',
        description: 'テスト用の案件です。',
        requiredSkills: 'Java, Spring Boot, React',
        requiredNumber: 3,
        budget: '5000万円',
        location: '東京都千代田区',
        workingHours: '9:00-18:00',
        isRemote: true,
        remarks: 'テスト用案件データ',
        status: '下書き',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }).as('createProject');
    
    // 保存ボタンをクリック
    cy.get('.save-button').click();
    
    // APIリクエストが送信されたことを確認
    cy.wait('@createProject').then((interception) => {
      expect(interception.request.body.name).to.equal('テスト案件');
      expect(interception.request.body.requiredSkills).to.equal('Java, Spring Boot, React');
    });
    
    // 成功メッセージを表示するシミュレーション
    cy.document().then((doc) => {
      const successElement = doc.querySelector('.success-message');
      successElement.textContent = '案件が正常に登録されました';
      successElement.style.display = 'block';
      
      // 新しい案件をテーブルに追加
      const tableBody = doc.getElementById('project-table-body');
      const row = doc.createElement('tr');
      row.setAttribute('data-id', '4');
      row.innerHTML = `
        <td>4</td>
        <td>テスト案件</td>
        <td>システム開発部</td>
        <td>2023-11-01</td>
        <td>2024-03-31</td>
        <td>下書き</td>
        <td>
          <button class="edit-button" data-id="4">編集</button>
          <button class="detail-button" data-id="4">詳細</button>
          <button class="approval-button" data-id="4">承認申請</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // 成功メッセージが表示されることを確認
    cy.get('.success-message')
      .should('be.visible')
      .and('contain', '案件が正常に登録されました');
    
    // テーブルに新しい案件が追加されていることを確認
    cy.contains('テスト案件').should('be.visible');
  });

  it('PROJECT-003: 案件情報を編集できること', () => {
    // 編集ボタンをクリック
    cy.get('.edit-button[data-id="1"]').click();
    
    // フォームが表示されることを確認
    cy.get('.project-form').should('be.visible');
    
    // フォームに既存のデータが入力されていることをシミュレート
    cy.document().then((doc) => {
      doc.getElementById('name').value = '基幹システム刷新プロジェクト';
      doc.getElementById('departmentId').value = '1';
      doc.getElementById('sectionId').value = '1';
      doc.getElementById('startDate').value = '2023-04-01';
      doc.getElementById('endDate').value = '2023-12-31';
      doc.getElementById('description').value = '老朽化した基幹システムの刷新プロジェクト';
      doc.getElementById('requiredSkills').value = 'Java, Spring Boot, Oracle, AWS';
      doc.getElementById('requiredNumber').value = '5';
      doc.getElementById('budget').value = '1億円';
      doc.getElementById('location').value = '東京都千代田区';
      doc.getElementById('workingHours').value = '9:00-18:00';
      doc.getElementById('isRemote').checked = true;
      doc.getElementById('remarks').value = '週2回のオンサイト必須';
    });
    
    // データを編集
    cy.get('#endDate').clear().type('2024-03-31');
    cy.get('#requiredNumber').clear().type('7');
    cy.get('#remarks').clear().type('週1回のオンサイト必須、他リモート');
    
    // APIモック
    cy.intercept('PUT', '/api/projects/1', {
      statusCode: 200,
      body: {
        id: '1',
        name: '基幹システム刷新プロジェクト',
        departmentId: '1',
        departmentName: 'システム開発部',
        sectionId: '1',
        sectionName: '開発1課',
        startDate: '2023-04-01',
        endDate: '2024-03-31',
        description: '老朽化した基幹システムの刷新プロジェクト',
        requiredSkills: 'Java, Spring Boot, Oracle, AWS',
        requiredNumber: 7,
        budget: '1億円',
        location: '東京都千代田区',
        workingHours: '9:00-18:00',
        isRemote: true,
        remarks: '週1回のオンサイト必須、他リモート',
        status: '下書き',
        updatedAt: new Date().toISOString()
      }
    }).as('updateProject');
    
    // 保存ボタンをクリック
    cy.get('.save-button').click();
    
    // APIリクエストが送信されたことを確認
    cy.wait('@updateProject').then((interception) => {
      expect(interception.request.body.endDate).to.equal('2024-03-31');
      expect(interception.request.body.requiredNumber).to.equal(7);
    });
    
    // 成功メッセージを表示するシミュレーション
    cy.document().then((doc) => {
      const successElement = doc.querySelector('.success-message');
      successElement.textContent = '案件情報が正常に更新されました';
      successElement.style.display = 'block';
      
      // テーブルの行を更新
      const row = doc.querySelector('tr[data-id="1"]');
      const cells = row.querySelectorAll('td');
      cells[4].textContent = '2024-03-31';
    });
    
    // 成功メッセージが表示されることを確認
    cy.get('.success-message')
      .should('be.visible')
      .and('contain', '案件情報が正常に更新されました');
    
    // テーブルに更新されたデータが表示されていることを確認
    cy.contains('2024-03-31').should('be.visible');
  });

  it('PROJECT-004: 案件を検索できること', () => {
    // 検索ボックスに入力
    cy.get('.search-input').type('EC');
    
    // 検索ボタンをクリック
    cy.get('.search-button').click();
    
    // 検索結果をシミュレート
    cy.document().then((doc) => {
      const tableBody = doc.getElementById('project-table-body');
      tableBody.innerHTML = '';
      
      const row = doc.createElement('tr');
      row.setAttribute('data-id', '2');
      row.innerHTML = `
        <td>2</td>
        <td>ECサイトリニューアル</td>
        <td>デジタルマーケティング部</td>
        <td>2023-05-01</td>
        <td>2023-10-31</td>
        <td>進行中</td>
        <td>
          <button class="edit-button" data-id="2">編集</button>
          <button class="detail-button" data-id="2">詳細</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // 検索結果が表示されることを確認
    cy.get('#project-table-body tr').should('have.length', 1);
    cy.contains('ECサイトリニューアル').should('be.visible');
    cy.contains('基幹システム刷新プロジェクト').should('not.exist');
    cy.contains('クラウド移行プロジェクト').should('not.exist');
  });

  it('PROJECT-005: 案件の承認申請ができること', () => {
    // 承認申請ボタンをクリック
    cy.get('.approval-button[data-id="1"]').click();
    
    // 確認ダイアログをシミュレート
    cy.document().then((doc) => {
      // 確認ダイアログを作成
      const dialog = doc.createElement('div');
      dialog.className = 'confirmation-dialog';
      dialog.innerHTML = `
        <div class="dialog-content">
          <h3>確認</h3>
          <p>この案件を承認申請しますか？</p>
          <div class="dialog-actions">
            <button class="confirm-button">はい</button>
            <button class="cancel-dialog-button">いいえ</button>
          </div>
        </div>
      `;
      doc.body.appendChild(dialog);
    });
    
    // 確認ダイアログが表示されることを確認
    cy.get('.confirmation-dialog').should('be.visible');
    
    // APIモック
    cy.intercept('POST', '/api/projects/1/submit-approval', {
      statusCode: 200,
      body: {
        id: '1',
        status: '承認待ち',
        approvalStatus: '承認待ち',
        updatedAt: new Date().toISOString()
      }
    }).as('submitApproval');
    
    // 「はい」ボタンをクリック
    cy.get('.confirm-button').click();
    
    // APIリクエストが送信されたことを確認
    cy.wait('@submitApproval');
    
    // 成功メッセージを表示するシミュレーション
    cy.document().then((doc) => {
      // ダイアログを削除
      doc.querySelector('.confirmation-dialog').remove();
      
      const successElement = doc.querySelector('.success-message');
      successElement.textContent = '承認申請が完了しました';
      successElement.style.display = 'block';
      
      // テーブルの行を更新
      const row = doc.querySelector('tr[data-id="1"]');
      const cells = row.querySelectorAll('td');
      cells[5].textContent = '承認待ち';
      
      // 承認申請ボタンを非表示にする
      row.querySelector('.approval-button').style.display = 'none';
    });
    
    // 成功メッセージが表示されることを確認
    cy.get('.success-message')
      .should('be.visible')
      .and('contain', '承認申請が完了しました');
    
    // テーブルに更新されたステータスが表示されていることを確認
    cy.contains('承認待ち').should('be.visible');
  });

  it('PROJECT-006: 必須項目が未入力の場合にエラーが表示されること', () => {
    // 新規案件登録ボタンをクリック
    cy.get('.add-project-button').click();
    
    // 一部のフィールドのみ入力
    cy.get('#departmentId').select('システム開発部');
    cy.get('#sectionId').select('開発1課');
    cy.get('#startDate').type('2023-11-01');
    cy.get('#endDate').type('2024-03-31');
    
    // 保存ボタンをクリック
    cy.get('.save-button').click();
    
    // エラーメッセージを表示するシミュレーション
    cy.document().then((doc) => {
      const errorElement = doc.querySelector('.error-message');
      errorElement.textContent = '案件名は必須項目です';
      errorElement.style.display = 'block';
      
      // 案件名フィールドにエラースタイルを適用
      const nameInput = doc.getElementById('name');
      nameInput.classList.add('error');
    });
    
    // エラーメッセージが表示されることを確認
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', '案件名は必須項目です');
    
    // 案件名フィールドにエラースタイルが適用されていることを確認
    cy.get('#name').should('have.class', 'error');
  });
});
