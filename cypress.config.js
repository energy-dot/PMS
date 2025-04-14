const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: null, // サーバー接続チェックを無効化
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        // ブラウザ起動前の処理
        return launchOptions;
      });
      
      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    experimentalRunAllSpecs: true,
    experimentalStudio: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalSourceRewriting: false,
    chromeWebSecurity: false,
    testIsolation: false,
    includeShadowDom: true
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: require('./webpack.config.js'),
    },
    specPattern: 'cypress/component/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  }
})
