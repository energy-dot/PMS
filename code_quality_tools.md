# コード品質向上ツール導入計画

## 概要

パートナー要員管理システム（PMS）のコード品質を向上させるために、静的解析ツール、コードフォーマッター、テストツールなどの導入計画を作成しました。これらのツールを導入することで、コードの一貫性、可読性、保守性が向上し、バグの早期発見や未使用コードの削除が容易になります。

## 導入ツール一覧

### 1. ESLint - 静的コード解析

**目的**: コードの品質問題を早期に発見し、一貫したコーディング規約を適用する

**導入手順**:

#### バックエンド (NestJS/TypeScript)

```bash
cd PMS/backend
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports eslint-plugin-prettier eslint-config-prettier
```

設定ファイル (`.eslintrc.js`):

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 
        vars: 'all', 
        varsIgnorePattern: '^_', 
        args: 'after-used', 
        argsIgnorePattern: '^_' 
      },
    ],
  },
};
```

#### フロントエンド (React/TypeScript)

```bash
cd PMS/frontend
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-unused-imports eslint-plugin-prettier eslint-config-prettier
```

設定ファイル (`.eslintrc.js`):

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'unused-imports'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
```

### 2. Prettier - コードフォーマッター

**目的**: コードスタイルの一貫性を保ち、フォーマットに関する議論を排除する

**導入手順**:

#### バックエンドとフロントエンド共通

```bash
# バックエンド
cd PMS/backend
npm install --save-dev prettier

# フロントエンド
cd PMS/frontend
npm install --save-dev prettier
```

設定ファイル (`.prettierrc`):

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

`.prettierignore` ファイル:

```
node_modules
dist
build
coverage
.next
```

### 3. TypeScript の厳格モード

**目的**: 型安全性を向上させ、潜在的なバグを早期に発見する

**導入手順**:

#### バックエンドとフロントエンド共通

`tsconfig.json` の更新:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 4. Jest - テストフレームワーク

**目的**: 単体テストと統合テストを実行し、コードの品質と信頼性を確保する

**導入手順**:

#### バックエンド (NestJS)

NestJSには既にJestが含まれていますが、設定を最適化します:

```bash
cd PMS/backend
npm install --save-dev jest @types/jest ts-jest jest-sonar-reporter
```

`jest.config.js` の更新:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/migrations/**/*.ts',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testResultsProcessor: 'jest-sonar-reporter',
};
```

#### フロントエンド (React)

```bash
cd PMS/frontend
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-sonar-reporter
```

`jest.config.js` の更新:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/setupTests.ts',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testResultsProcessor: 'jest-sonar-reporter',
};
```

`setupTests.ts` の更新:

```typescript
import '@testing-library/jest-dom';
```

### 5. SonarQube / SonarCloud - コード品質分析

**目的**: 包括的なコード品質分析を提供し、技術的負債を可視化する

**導入手順**:

#### SonarCloud (クラウドベース)

1. [SonarCloud](https://sonarcloud.io/) でアカウントを作成
2. 新しいプロジェクトを作成し、GitHubリポジトリと連携
3. プロジェクトルートに `sonar-project.properties` ファイルを作成:

```properties
sonar.projectKey=energy-dot_PMS
sonar.organization=energy-dot

# ソースコードのパス
sonar.sources=PMS/backend/src,PMS/frontend/src

# テストのパス
sonar.tests=PMS/backend/test,PMS/frontend/src/__tests__

# テストレポートのパス
sonar.testExecutionReportPaths=PMS/backend/test-report.xml,PMS/frontend/test-report.xml

# カバレッジレポートのパス
sonar.javascript.lcov.reportPaths=PMS/backend/coverage/lcov.info,PMS/frontend/coverage/lcov.info

# 除外パス
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/coverage/**,**/*.spec.ts,**/*.test.tsx

# TypeScriptの設定
sonar.typescript.tsconfigPath=PMS/backend/tsconfig.json,PMS/frontend/tsconfig.json
```

4. GitHub Actions ワークフローファイル (`.github/workflows/sonarcloud.yml`) を作成:

```yaml
name: SonarCloud Analysis
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies and run tests with coverage
        run: |
          cd PMS/backend
          npm ci
          npm run test:cov
          cd ../frontend
          npm ci
          npm run test:cov
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 6. Husky と lint-staged - コミット前検証

**目的**: コミット前に自動的にリントとフォーマットを実行し、品質の低いコードがリポジトリに入るのを防ぐ

**導入手順**:

#### プロジェクトルート

```bash
cd PMS
npm install --save-dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

`package.json` に設定を追加:

```json
{
  "lint-staged": {
    "PMS/backend/src/**/*.ts": [
      "cd PMS/backend && eslint --fix",
      "cd PMS/backend && prettier --write"
    ],
    "PMS/frontend/src/**/*.{ts,tsx}": [
      "cd PMS/frontend && eslint --fix",
      "cd PMS/frontend && prettier --write"
    ]
  }
}
```

### 7. Webpack Bundle Analyzer - バンドル分析 (フロントエンド)

**目的**: フロントエンドのバンドルサイズを分析し、最適化の機会を特定する

**導入手順**:

```bash
cd PMS/frontend
npm install --save-dev rollup-plugin-visualizer
```

`vite.config.ts` の更新:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

### 8. npm-check - 依存関係の分析

**目的**: 古い、未使用、または脆弱性のある依存関係を特定する

**導入手順**:

```bash
# グローバルにインストール
npm install -g npm-check

# バックエンドとフロントエンドで実行
cd PMS/backend
npm-check -u

cd PMS/frontend
npm-check -u
```

## NPMスクリプトの追加

### バックエンド (`package.json`)

```json
{
  "scripts": {
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "analyze": "npm-check",
    "typecheck": "tsc --noEmit"
  }
}
```

### フロントエンド (`package.json`)

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.{ts,tsx}\" --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "analyze": "npm-check",
    "analyze:bundle": "vite build --mode analyze",
    "typecheck": "tsc --noEmit"
  }
}
```

## CI/CD パイプラインの設定

### GitHub Actions ワークフロー (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: PMS/backend/package-lock.json
      - name: Install dependencies
        run: cd PMS/backend && npm ci
      - name: Lint
        run: cd PMS/backend && npm run lint
      - name: Type check
        run: cd PMS/backend && npm run typecheck
      - name: Test
        run: cd PMS/backend && npm run test:cov

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: PMS/frontend/package-lock.json
      - name: Install dependencies
        run: cd PMS/frontend && npm ci
      - name: Lint
        run: cd PMS/frontend && npm run lint
      - name: Type check
        run: cd PMS/frontend && npm run typecheck
      - name: Test
        run: cd PMS/frontend && npm run test:cov
      - name: Build
        run: cd PMS/frontend && npm run build
```

## VSCode 設定

### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "jest.autoRun": {
    "watch": false,
    "onSave": "test-file"
  }
}
```

### `.vscode/extensions.json`

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "orta.vscode-jest",
    "sonarsource.sonarlint-vscode"
  ]
}
```

## 導入スケジュール

1. **準備フェーズ** (1日)
   - プロジェクトチームへの説明と合意形成
   - 開発環境の準備

2. **基本ツールの導入** (1日)
   - ESLint と Prettier の導入
   - TypeScript の厳格モードの有効化
   - Husky と lint-staged の設定

3. **テスト環境の整備** (2日)
   - Jest の設定最適化
   - テストカバレッジ目標の設定
   - 既存テストの修正

4. **コード品質分析の導入** (1日)
   - SonarCloud の設定
   - CI/CD パイプラインの構築

5. **開発者トレーニング** (1日)
   - ツールの使用方法の説明
   - コーディング規約の確認
   - コードレビュープロセスの改善

6. **移行期間** (1週間)
   - 既存コードの段階的な修正
   - 問題の優先順位付けと対応

## 期待される効果

1. **コード品質の向上**
   - 一貫したコーディングスタイルの適用
   - 型安全性の向上
   - 潜在的なバグの早期発見

2. **開発効率の向上**
   - 自動化されたコード検証によるレビュー時間の短縮
   - 明確なコーディング規約による意思決定の簡素化
   - 技術的負債の可視化と管理

3. **保守性の向上**
   - 読みやすく一貫性のあるコードベース
   - 未使用コードの削減
   - 依存関係の最適化

4. **品質文化の醸成**
   - 品質指標の可視化
   - 継続的な改善プロセスの確立
   - チーム全体の品質意識の向上

## 結論

コード品質向上ツールの導入は、パートナー要員管理システムの品質と保守性を大幅に向上させる重要な投資です。ESLint、Prettier、TypeScriptの厳格モード、Jest、SonarCloud、Huskyなどのツールを組み合わせることで、一貫したコーディングスタイル、型安全性、テストカバレッジを確保し、潜在的なバグを早期に発見できます。

これらのツールをCI/CDパイプラインに統合することで、品質チェックを自動化し、開発者の負担を軽減しながら、高品質なコードベースを維持することができます。また、VSCode設定を標準化することで、開発者体験を向上させ、品質向上の取り組みをサポートします。

段階的な導入アプローチにより、チームへの影響を最小限に抑えながら、コード品質の向上を実現します。
