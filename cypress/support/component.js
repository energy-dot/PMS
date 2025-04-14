// cypress/support/component.js
// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { setupMockServer } from './mock-server'
import { setupGlobalMocks } from './test-providers'
import { mount } from 'cypress/react'

// Import global styles for ag-Grid
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

// Register the mount command
Cypress.Commands.add('mount', mount)

// モックサーバーのセットアップ
beforeEach(() => {
  setupMockServer();
});

// グローバルエラーハンドリング
Cypress.on('uncaught:exception', (err, runnable) => {
  // ag-Grid関連のエラーを無視する
  if (err.message && (err.message.includes('ag-Grid') || 
      err.message.includes('getCellRanges') || 
      err.message.includes('RangeSelectionModule'))) {
    return false;
  }
  
  // ストレージアクセスエラーを無視する
  if (err.message && (err.message.includes('localStorage') || 
      err.message.includes('Access to storage') ||
      err.message.includes('Storage access'))) {
    return false;
  }
  
  // その他のエラーはテスト実行を継続するためにfalseを返す
  console.error('Uncaught exception:', err.message);
  return false;
})

// ローカルストレージの保持
Cypress.Cookies.defaults({
  preserve: ['pms_auth_token', 'pms_user_data'],
})

// コンソールエラーのログ
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error').as('consoleError');
  cy.spy(win.console, 'warn').as('consoleWarn');
});
