// cypress/plugins/index.js
/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  
  // モックサーバーの設定
  on('before:browser:launch', (browser, launchOptions) => {
    // ブラウザ起動前の処理
    return launchOptions;
  });
  
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },
    table(message) {
      console.table(message);
      return null;
    }
  });
  
  return config;
};
