# テスト環境構築手順書

## 1. 概要

本文書は、パートナー要員管理システム（PMS）のテスト環境構築手順を説明します。テスト環境は、ユニットテスト、統合テスト、E2Eテストの実行に必要な設定を含みます。

## 2. 前提条件

- Node.js 14.x以上
- npm 6.x以上
- Git

## 3. リポジトリのクローン

```bash
git clone https://github.com/energy-dot/PMS.git
cd PMS
```

## 4. バックエンドテスト環境構築

### 4.1 依存パッケージのインストール

```bash
cd backend
npm install
npm install --save-dev jest @types/jest ts-jest @nestjs/testing
```

### 4.2 Jest設定ファイルの作成

`backend/jest.config.js`ファイルを以下の内容で作成します：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/test/.*\\.(test|spec))\\.[tj]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

### 4.3 package.jsonのテストスクリプト設定

`backend/package.json`ファイルの`scripts`セクションに以下を追加します：

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:unit": "jest test/unit",
  "test:integration": "jest test/integration",
  "test:e2e": "jest test/e2e"
}
```

### 4.4 テストディレクトリ構造の作成

```bash
mkdir -p test/unit
mkdir -p test/integration
mkdir -p test/e2e
```

## 5. フロントエンドテスト環境構築

### 5.1 依存パッケージのインストール

```bash
cd ../frontend
npm install
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 5.2 テスト設定ファイルの作成

`frontend/jest.config.js`ファイルを以下の内容で作成します：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
};
```

### 5.3 setupTests.tsファイルの作成

`frontend/src/setupTests.ts`ファイルを以下の内容で作成します：

```typescript
import '@testing-library/jest-dom';
```

### 5.4 モックファイルの作成

`frontend/src/__mocks__/fileMock.js`ファイルを以下の内容で作成します：

```javascript
module.exports = 'test-file-stub';
```

## 6. E2Eテスト環境構築

### 6.1 Playwrightのインストール

```bash
cd ../backend
npm install --save-dev @playwright/test
npx playwright install
```

### 6.2 Playwright設定ファイルの作成

`backend/playwright.config.ts`ファイルを以下の内容で作成します：

```typescript
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './test/e2e',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
};

export default config;
```

## 7. テストデータベースの設定

### 7.1 テスト用SQLiteデータベースの作成

```bash
cd ../database
mkdir -p test
touch test/test.db
```

### 7.2 テスト用データベース設定ファイルの作成

`backend/src/config/test.config.ts`ファイルを以下の内容で作成します：

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: path.resolve(__dirname, '../../../database/test/test.db'),
  entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true,
};
```

## 8. 環境変数の設定

`.env.test`ファイルをプロジェクトルートに作成します：

```
NODE_ENV=test
DB_TYPE=sqlite
DB_NAME=test.db
DB_PATH=../database/test
JWT_SECRET=test_secret_key
```

## 9. テスト環境の検証

以下のコマンドを実行して、テスト環境が正しく構築されていることを確認します：

```bash
cd ../backend
npm test -- --testPathIgnorePatterns=e2e
```

正常に実行されれば、テスト環境の構築は完了です。
