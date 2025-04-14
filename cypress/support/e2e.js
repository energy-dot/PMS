// cypress/support/e2e.js
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
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

// Alternatively you can use CommonJS syntax:
// require('./commands')

// モックサーバーのセットアップ
beforeEach(() => {
  setupMockServer();
});

// グローバルエラーハンドリング
Cypress.on('uncaught:exception', (err, runnable) => {
  // テスト実行を継続するためにfalseを返す
  return false
})

// ローカルストレージの保持
Cypress.Cookies.defaults({
  preserve: ['pms_auth_token', 'pms_user_data'],
})
