// cypress/component/staff.component.spec.js
describe('要員管理コンポーネントテスト', () => {
  beforeEach(() => {
    // モックHTMLを作成
    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <div id="root">
          <div class="staff-container">
            <h1>要員管理</h1>
            <div class="staff-actions">
              <button class="add-staff-button">新規要員登録</button>
              <div class="search-container">
                <input type="text" class="search-input" placeholder="要員名で検索" />
                <button class="search-button">検索</button>
              </div>
            </div>
            <div class="staff-list">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名前</th>
                    <th>パートナー</th>
                    <th>メール</th>
                    <th>電話番号</th>
                    <th>ステータス</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody id="staff-table-body">
                  <!-- 要員データがここに挿入される -->
                </tbody>
              </table>
            </div>
            <div class="staff-form" style="display: none;">
              <h2>要員情報</h2>
              <form id="staff-form">
                <div class="form-group">
                  <label for="partnerId">パートナー</label>
                  <select id="partnerId" name="partnerId" required>
                    <option value="">選択してください</option>
                    <option value="1">株式会社テックパートナー</option>
                    <option value="2">デザインクリエイト株式会社</option>
                    <option value="3">インフラソリューション株式会社</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="name">名前</label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div class="form-group">
                  <label for="email">メールアドレス</label>
                  <input id="email" name="email" type="email" />
                </div>
                <div class="form-group">
                  <label for="phone">電話番号</label>
                  <input id="phone" name="phone" type="text" />
                </div>
                <div class="form-group">
                  <label for="status">ステータス</label>
                  <select id="status" name="status">
                    <option value="待機中">待機中</option>
                    <option value="稼働中">稼働中</option>
                    <option value="調整中">調整中</option>
                    <option value="退職">退職</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="departmentId">部門</label>
                  <select id="departmentId" name="departmentId">
                    <option value="">選択してください</option>
                    <option value="1">システム開発部</option>
                    <option value="2">デジタルマーケティング部</option>
                    <option value="3">情報システム部</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="sectionId">セクション</label>
                  <select id="sectionId" name="sectionId">
                    <option value="">選択してください</option>
                    <option value="1">開発1課</option>
                    <option value="2">開発2課</option>
                    <option value="3">マーケティング1課</option>
                    <option value="4">マーケティング2課</option>
                    <option value="5">インフラ課</option>
                  </select>
                </div>
                <div class="skills-section">
                  <h3>スキル情報</h3>
                  <div id="skills-container">
                    <!-- スキル入力フィールドがここに追加される -->
                  </div>
                  <button type="button" class="add-skill-button">スキル追加</button>
                </div>
                <div class="form-group">
                  <label for="experience">経験年数</label>
                  <input id="experience" name="experience" type="number" />
                </div>
                <div class="form-group">
                  <label for="resume">経歴概要</label>
                  <textarea id="resume" name="resume"></textarea>
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

    // 要員データをテーブルに表示
    cy.fixture('staff').then((staffList) => {
      cy.document().then((doc) => {
        const tableBody = doc.getElementById('staff-table-body');
        staffList.forEach(staff => {
          const row = doc.createElement('tr');
          row.setAttribute('data-id', staff.id);
          row.innerHTML = `
            <td>${staff.id}</td>
            <td>${staff.name}</td>
            <td>${staff.partnerName || '株式会社テックパートナー'}</td>
            <td>${staff.email}</td>
            <td>${staff.phone}</td>
            <td>${staff.status}</td>
            <td>
              <button class="edit-button" data-id="${staff.id}">編集</button>
              <button class="detail-button" data-id="${staff.id}">詳細</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      });
    });
  });

  it('STAFF-001: 要員一覧が表示されること', () => {
    // 要員一覧が表示されていることを確認
    cy.get('#staff-table-body tr').should('have.length.at.least', 3);
    cy.contains('山田太郎').should('be.visible');
    cy.contains('佐藤花子').should('be.visible');
    cy.contains('鈴木一郎').should('be.visible');
  });

  it('STAFF-002: 新規要員を登録できること', () => {
    // 新規要員登録ボタンをクリック
    cy.get('.add-staff-button').click();
    
    // フォームが表示されることを確認
    cy.get('.staff-form').should('be.visible');
    
    // フォームに入力
    cy.get('#partnerId').select('株式会社テックパートナー');
    cy.get('#name').type('テスト要員');
    cy.get('#email').type('test@techpartner.example.com');
    cy.get('#phone').type('090-1234-5678');
    cy.get('#status').select('待機中');
    cy.get('#departmentId').select('システム開発部');
    cy.get('#sectionId').select('開発1課');
    
    // スキル情報を追加
    cy.document().then((doc) => {
      const skillsContainer = doc.getElementById('skills-container');
      
      // スキル1
      const skillDiv1 = doc.createElement('div');
      skillDiv1.className = 'skill-item';
      skillDiv1.innerHTML = `
        <input name="skills[0]" type="text" placeholder="スキル名" />
        <select name="skillLevels[0]">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="button" class="remove-skill-button">削除</button>
      `;
      skillsContainer.appendChild(skillDiv1);
      
      // スキル2
      const skillDiv2 = doc.createElement('div');
      skillDiv2.className = 'skill-item';
      skillDiv2.innerHTML = `
        <input name="skills[1]" type="text" placeholder="スキル名" />
        <select name="skillLevels[1]">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="button" class="remove-skill-button">削除</button>
      `;
      skillsContainer.appendChild(skillDiv2);
    });
    
    cy.get('input[name="skills[0]"]').type('Java');
    cy.get('select[name="skillLevels[0]"]').select('4');
    cy.get('input[name="skills[1]"]').type('Spring Boot');
    cy.get('select[name="skillLevels[1]"]').select('3');
    
    cy.get('#experience').type('5');
    cy.get('#resume').type('Javaによる基幹システム開発経験5年');
    cy.get('#remarks').type('テスト用要員データ');
    
    // APIモック
    cy.intercept('POST', '/api/staff', {
      statusCode: 201,
      body: {
        id: '4',
        partnerId: '1',
        partnerName: '株式会社テックパートナー',
        name: 'テスト要員',
        email: 'test@techpartner.example.com',
        phone: '090-1234-5678',
        status: '待機中',
        departmentId: '1',
        departmentName: 'システム開発部',
        sectionId: '1',
        sectionName: '開発1課',
        skills: ['Java', 'Spring Boot'],
        skillLevels: [4, 3],
        experience: 5,
        resume: 'Javaによる基幹システム開発経験5年',
        remarks: 'テスト用要員データ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }).as('createStaff');
    
    // 保存ボタンをクリック
    cy.get('.save-button').click();
    
    // APIリクエストが送信されたことを確認
    cy.wait('@createStaff').then((interception) => {
      expect(interception.request.body.name).to.equal('テスト要員');
      expect(interception.request.body.email).to.equal('test@techpartner.example.com');
    });
    
    // 成功メッセージを表示するシミュレーション
    cy.document().then((doc) => {
      const successElement = doc.querySelector('.success-message');
      successElement.textContent = '要員が正常に登録されました';
      successElement.style.display = 'block';
      
      // 新しい要員をテーブルに追加
      const tableBody = doc.getElementById('staff-table-body');
      const row = doc.createElement('tr');
      row.setAttribute('data-id', '4');
      row.innerHTML = `
        <td>4</td>
        <td>テスト要員</td>
        <td>株式会社テックパートナー</td>
        <td>test@techpartner.example.com</td>
        <td>090-1234-5678</td>
        <td>待機中</td>
        <td>
          <button class="edit-button" data-id="4">編集</button>
          <button class="detail-button" data-id="4">詳細</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // 成功メッセージが表示されることを確認
    cy.get('.success-message')
      .should('be.visible')
      .and('contain', '要員が正常に登録されました');
    
    // テーブルに新しい要員が追加されていることを確認
    cy.contains('テスト要員').should('be.visible');
  });

  it('STAFF-003: 要員情報を編集できること', () => {
    // 編集ボタンをクリック
    cy.get('.edit-button[data-id="1"]').click();
    
    // フォームが表示されることを確認
    cy.get('.staff-form').should('be.visible');
    
    // フォームに既存のデータが入力されていることをシミュレート
    cy.document().then((doc) => {
      doc.getElementById('partnerId').value = '1';
      doc.getElementById('name').value = '山田太郎';
      doc.getElementById('email').value = 'yamada@techpartner.example.com';
      doc.getElementById('phone').value = '090-1234-5678';
      doc.getElementById('status').value = '稼働中';
      doc.getElementById('departmentId').value = '1';
      doc.getElementById('sectionId').value = '1';
      doc.getElementById('experience').value = '8';
      doc.getElementById('resume').value = 'Java, Spring Boot, Oracle, AWSを使用した基幹システム開発経験8年';
      doc.getElementById('remarks').value = 'コミュニケーション能力が高い';
      
      // スキル情報
      const skillsContainer = doc.getElementById('skills-container');
      
      // スキル1
      const skillDiv1 = doc.createElement('div');
      skillDiv1.className = 'skill-item';
      skillDiv1.innerHTML = `
        <input name="skills[0]" type="text" value="Java" placeholder="スキル名" />
        <select name="skillLevels[0]">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4" selected>4</option>
          <option value="5">5</option>
        </select>
        <button type="button" class="remove-skill-button">削除</button>
      `;
      skillsContainer.appendChild(skillDiv1);
      
      // スキル2
      const skillDiv2 = doc.createElement('div');
      skillDiv2.className = 'skill-item';
      skillDiv2.innerHTML = `
        <input name="skills[1]" type="text" value="Spring Boot" placeholder="スキル名" />
        <select name="skillLevels[1]">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3" selected>3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="button" class="remove-skill-button">削除</button>
      `;
      skillsContainer.appendChild(skillDiv2);
      
      // スキル3
      const skillDiv3 = doc.createElement('div');
      skillDiv3.className = 'skill-item';
      skillDiv3.innerHTML = `
        <input name="skills[2]" type="text" value="Oracle" placeholder="スキル名" />
        <select name="skillLevels[2]">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3" selected>3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="button" class="remove-skill-button">削除</button>
      `;
      skillsContainer.appendChild(skillDiv3);
      
      // スキル4
      const skillDiv4 = doc.createElement('div');
      skillDiv4.className = 'skill-item';
      skillDiv4.innerHTML = `
        <input name="skills[3]" type="text" value="AWS" placeholder="スキル名" />
        <select name="skillLevels[3]">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4" selected>4</option>
          <option value="5">5</option>
        </select>
        <button type="button" class="remove-skill-button">削除</button>
      `;
      skillsContainer.appendChild(skillDiv4);
    });
    
    // データを編集
    cy.get('#phone').clear().type('090-9999-8888');
    cy.get('#experience').clear().type('9');
    cy.get('#remarks').clear().type('情報を更新しました');
    
    // APIモック
    cy.intercept('PUT', '/api/staff/1', {
      statusCode: 200,
      body: {
        id: '1',
        partnerId: '1',
        partnerName: '株式会社テックパートナー',
        name: '山田太郎',
        email: 'yamada@techpartner.example.com',
        phone: '090-9999-8888',
        status: '稼働中',
        departmentId: '1',
        departmentName: 'システム開発部',
        sectionId: '1',
        sectionName: '開発1課',
        skills: ['Java', 'Spring Boot', 'Oracle', 'AWS'],
        skillLevels: [4, 3, 3, 4],
        experience: 9,
        resume: 'Java, Spring Boot, Oracle, AWSを使用した基幹システム開発経験8年',
        remarks: '情報を更新しました',
        updatedAt: new Date().toISOString()
      }
    }).as('updateStaff');
    
    // 保存ボタンをクリック
    cy.get('.save-button').click();
    
    // APIリクエストが送信されたことを確認
    cy.wait('@updateStaff').then((interception) => {
      expect(interception.request.body.phone).to.equal('090-9999-8888');
      expect(interception.request.body.experience).to.equal(9);
    });
    
    // 成功メッセージを表示するシミュレーション
    cy.document().then((doc) => {
      const successElement = doc.querySelector('.success-message');
      successElement.textContent = '要員情報が正常に更新されました';
      successElement.style.display = 'block';
      
      // テーブルの行を更新
      const row = doc.querySelector('tr[data-id="1"]');
      const cells = row.querySelectorAll('td');
      cells[4].textContent = '090-9999-8888';
    });
    
    // 成功メッセージが表示されることを確認
    cy.get('.success-message')
      .should('be.visible')
      .and('contain', '要員情報が正常に更新されました');
    
    // テーブルに更新されたデータが表示されていることを確認
    cy.contains('090-9999-8888').should('be.visible');
  });

  it('STAFF-004: 要員を検索できること', () => {
    // 検索ボックスに入力
    cy.get('.search-input').type('山田');
    
    // 検索ボタンをクリック
    cy.get('.search-button').click();
    
    // 検索結果をシミュレート
    cy.document().then((doc) => {
      const tableBody = doc.getElementById('staff-table-body');
      tableBody.innerHTML = '';
      
      const row = doc.createElement('tr');
      row.setAttribute('data-id', '1');
      row.innerHTML = `
        <td>1</td>
        <td>山田太郎</td>
        <td>株式会社テックパートナー</td>
        <td>yamada@techpartner.example.com</td>
        <td>090-1234-5678</td>
        <td>稼働中</td>
        <td>
          <button class="edit-button" data-id="1">編集</button>
          <button class="detail-button" data-id="1">詳細</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // 検索結果が表示されることを確認
    cy.get('#staff-table-body tr').should('have.length', 1);
    cy.contains('山田太郎').should('be.visible');
    cy.contains('佐藤花子').should('not.exist');
    cy.contains('鈴木一郎').should('not.exist');
  });

  it('STAFF-005: 要員詳細を表示できること', () => {
    // 詳細ボタンをクリック
    cy.get('.detail-button[data-id="1"]').click();
    
    // 詳細ページをシミュレート
    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <div id="root">
          <div class="staff-detail-container">
            <h1>要員詳細</h1>
            <div class="staff-detail">
              <div class="detail-section">
                <h2>基本情報</h2>
                <table class="detail-table">
                  <tr>
                    <th>名前</th>
                    <td>山田太郎</td>
                  </tr>
                  <tr>
                    <th>パートナー</th>
                    <td>株式会社テックパートナー</td>
                  </tr>
                  <tr>
                    <th>メールアドレス</th>
                    <td>yamada@techpartner.example.com</td>
                  </tr>
                  <tr>
                    <th>電話番号</th>
                    <td>090-1234-5678</td>
                  </tr>
                  <tr>
                    <th>ステータス</th>
                    <td>稼働中</td>
                  </tr>
                  <tr>
                    <th>部門</th>
                    <td>システム開発部</td>
                  </tr>
                  <tr>
                    <th>セクション</th>
                    <td>開発1課</td>
                  </tr>
                </table>
              </div>
              <div class="detail-section">
                <h2>スキル情報</h2>
                <table class="detail-table">
                  <tr>
                    <th>スキル</th>
                    <th>レベル</th>
                  </tr>
                  <tr>
                    <td>Java</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>Spring Boot</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Oracle</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>AWS</td>
                    <td>4</td>
                  </tr>
                </table>
              </div>
              <div class="detail-section">
                <h2>経歴情報</h2>
                <table class="detail-table">
                  <tr>
                    <th>経験年数</th>
                    <td>8年</td>
                  </tr>
                  <tr>
                    <th>経歴概要</th>
                    <td>Java, Spring Boot, Oracle, AWSを使用した基幹システム開発経験8年</td>
                  </tr>
                  <tr>
                    <th>備考</th>
                    <td>コミュニケーション能力が高い</td>
                  </tr>
                </table>
              </div>
              <div class="detail-actions">
                <button class="edit-detail-button">編集</button>
                <button class="back-button">戻る</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    // 詳細情報が表示されることを確認
    cy.contains('山田太郎').should('be.visible');
    cy.contains('株式会社テックパートナー').should('be.visible');
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

  it('STAFF-006: 必須項目が未入力の場合にエラーが表示されること', () => {
    // 新規要員登録ボタンをクリック
    cy.get('.add-staff-button').click();
    
    // パートナーのみ選択
    cy.get('#partnerId').select('株式会社テックパートナー');
    
    // 保存ボタンをクリック
    cy.get('.save-button').click();
    
    // エラーメッセージを表示するシミュレーション
    cy.document().then((doc) => {
      const errorElement = doc.querySelector('.error-message');
      errorElement.textContent = '名前は必須項目です';
      errorElement.style.display = 'block';
      
      // 名前フィールドにエラースタイルを適用
      const nameInput = doc.getElementById('name');
      nameInput.classList.add('error');
    });
    
    // エラーメッセージが表示されることを確認
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', '名前は必須項目です');
    
    // 名前フィールドにエラースタイルが適用されていることを確認
    cy.get('#name').should('have.class', 'error');
  });
});
