// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { mountWithProviders } from './test-providers';

// カスタムコマンド: プロバイダー付きでコンポーネントをマウント
Cypress.Commands.add('mountWithProviders', (component, options) => {
  return mountWithProviders(component, options);
});

// カスタムコマンド: モックユーザーとしてログイン
Cypress.Commands.add('loginAsMockUser', (role = 'admin') => {
  const users = {
    admin: {
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    },
    manager: {
      username: 'manager',
      password: 'manager123',
      role: 'manager'
    },
    user: {
      username: 'user',
      password: 'user123',
      role: 'user'
    }
  };

  const user = users[role] || users.admin;
  
  // ローカルストレージにトークンとユーザー情報を設定
  localStorage.setItem('pms_auth_token', `mock-jwt-token-${role}`);
  localStorage.setItem('pms_user_data', JSON.stringify({
    id: `${role}-id`,
    username: user.username,
    fullName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
    role: user.role
  }));
  
  return cy.wrap(user);
});

// カスタムコマンド: ag-Gridのセルを取得
Cypress.Commands.add('getAgGridCell', (rowIndex, colId) => {
  return cy.get(`.ag-row[row-index="${rowIndex}"] > [col-id="${colId}"]`);
});

// カスタムコマンド: ag-Gridの行を選択
Cypress.Commands.add('selectAgGridRow', (rowIndex) => {
  return cy.get(`.ag-row[row-index="${rowIndex}"]`).click();
});

// カスタムコマンド: ag-Gridのセルを編集
Cypress.Commands.add('editAgGridCell', (rowIndex, colId, newValue) => {
  cy.getAgGridCell(rowIndex, colId).dblclick();
  cy.get('.ag-cell-edit-input').clear().type(`${newValue}{enter}`);
});

// カスタムコマンド: ag-Gridのフィルターを設定
Cypress.Commands.add('setAgGridFilter', (colId, filterValue) => {
  cy.get(`.ag-header-cell[col-id="${colId}"]`)
    .find('.ag-header-cell-menu-button')
    .click();
  
  cy.get('.ag-menu-option')
    .contains('Filter')
    .click();
  
  cy.get('.ag-filter-filter')
    .type(filterValue);
  
  cy.get('.ag-filter-apply-panel-button')
    .contains('Apply')
    .click();
});

// カスタムコマンド: モックAPIレスポンスを設定
Cypress.Commands.add('mockApiResponse', (method, url, response, statusCode = 200) => {
  return cy.intercept(method, url, {
    statusCode,
    body: response
  });
});
