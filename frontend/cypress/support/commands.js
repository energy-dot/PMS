// cypress/commands.js
// カスタムコマンドの追加

// パートナー企業を作成するコマンド
Cypress.Commands.add('createPartner', (partnerData) => {
  cy.visit('/partners');
  cy.contains('新規登録').click();
  
  // デフォルト値を設定
  const defaultData = {
    name: 'テスト株式会社',
    address: '東京都渋谷区1-1-1',
    phone: '03-1234-5678',
    email: 'test@example.com',
    website: 'https://example.com',
    status: '候補'
  };
  
  // 引数のデータとデフォルト値をマージ
  const data = { ...defaultData, ...partnerData };
  
  // フォームに入力
  cy.get('input[name="name"]').type(data.name);
  cy.get('input[name="address"]').type(data.address);
  cy.get('input[name="phone"]').type(data.phone);
  cy.get('input[name="email"]').type(data.email);
  cy.get('input[name="website"]').type(data.website);
  cy.get('select[name="status"]').select(data.status);
  
  // 保存ボタンをクリック
  cy.contains('保存').click();
});

// 反社チェック情報を作成するコマンド
Cypress.Commands.add('createAntisocialCheck', (partnerId, checkData) => {
  cy.visit(`/partners/${partnerId}/antisocial-checks`);
  cy.contains('新規登録').click();
  
  // デフォルト値を設定
  const defaultData = {
    checkDate: '2025-04-01',
    result: '問題なし',
    validUntil: '2026-03-31',
    remarks: 'テスト用反社チェック'
  };
  
  // 引数のデータとデフォルト値をマージ
  const data = { ...defaultData, ...checkData };
  
  // フォームに入力
  cy.get('input[name="checkDate"]').type(data.checkDate);
  cy.get('select[name="result"]').select(data.result);
  cy.get('input[name="validUntil"]').type(data.validUntil);
  cy.get('textarea[name="remarks"]').type(data.remarks);
  
  // 保存ボタンをクリック
  cy.contains('保存').click();
});

// 基本契約情報を作成するコマンド
Cypress.Commands.add('createBaseContract', (partnerId, contractData) => {
  cy.visit(`/partners/${partnerId}/base-contracts`);
  cy.contains('新規登録').click();
  
  // デフォルト値を設定
  const defaultData = {
    contractNumber: 'CT-2025-001',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: '有効',
    autoRenewal: 'あり',
    notificationDate: '2026-01-31',
    remarks: 'テスト用基本契約'
  };
  
  // 引数のデータとデフォルト値をマージ
  const data = { ...defaultData, ...contractData };
  
  // フォームに入力
  cy.get('input[name="contractNumber"]').type(data.contractNumber);
  cy.get('input[name="startDate"]').type(data.startDate);
  cy.get('input[name="endDate"]').type(data.endDate);
  cy.get('select[name="status"]').select(data.status);
  cy.get('select[name="autoRenewal"]').select(data.autoRenewal);
  cy.get('input[name="notificationDate"]').type(data.notificationDate);
  cy.get('textarea[name="remarks"]').type(data.remarks);
  
  // 保存ボタンをクリック
  cy.contains('保存').click();
});

// 営業窓口担当者を作成するコマンド
Cypress.Commands.add('createContactPerson', (partnerId, personData) => {
  cy.visit(`/partners/${partnerId}/contact-persons`);
  cy.contains('新規担当者登録').click();
  
  // デフォルト値を設定
  const defaultData = {
    name: '山田太郎',
    type: '営業担当',
    position: '営業部長',
    department: '営業部',
    email: 'yamada@example.com',
    phone: '03-1234-5678',
    mobilePhone: '090-1234-5678',
    remarks: 'テスト用担当者'
  };
  
  // 引数のデータとデフォルト値をマージ
  const data = { ...defaultData, ...personData };
  
  // フォームに入力
  cy.get('input[name="name"]').type(data.name);
  cy.get('select[name="type"]').select(data.type);
  cy.get('input[name="position"]').type(data.position);
  cy.get('input[name="department"]').type(data.department);
  cy.get('input[name="email"]').type(data.email);
  cy.get('input[name="phone"]').type(data.phone);
  cy.get('input[name="mobilePhone"]').type(data.mobilePhone);
  cy.get('textarea[name="remarks"]').type(data.remarks);
  
  // 保存ボタンをクリック
  cy.contains('保存').click();
});
