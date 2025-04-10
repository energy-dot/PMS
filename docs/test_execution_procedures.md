# テスト実施手順書

## 1. 概要

本文書は、パートナー要員管理システム（PMS）のテスト実施手順を説明します。ユニットテスト、統合テスト、E2Eテストの実行方法と結果の確認方法を記載しています。

## 2. バックエンドユニットテスト実行手順

### 2.1 全てのユニットテストを実行

```bash
cd /home/ubuntu/PMS/backend
npm run test:unit
```

### 2.2 特定のユニットテストを実行

```bash
cd /home/ubuntu/PMS/backend
npm test -- test/unit/users.service.spec.ts
```

### 2.3 カバレッジレポートの生成

```bash
cd /home/ubuntu/PMS/backend
npm run test:cov
```

カバレッジレポートは `coverage` ディレクトリに生成されます。

## 3. バックエンド統合テスト実行手順

### 3.1 全ての統合テストを実行

```bash
cd /home/ubuntu/PMS/backend
npm run test:integration
```

### 3.2 特定の統合テストを実行

```bash
cd /home/ubuntu/PMS/backend
npm test -- test/integration/workflow-notification.spec.ts
```

## 4. E2Eテスト実行手順

### 4.1 アプリケーションの起動

E2Eテストを実行する前に、バックエンドとフロントエンドのアプリケーションを起動する必要があります。

```bash
# バックエンドの起動
cd /home/ubuntu/PMS/backend
npm run start:dev

# 別のターミナルでフロントエンドを起動
cd /home/ubuntu/PMS/frontend
npm start
```

### 4.2 Playwrightを使用したE2Eテストの実行

```bash
cd /home/ubuntu/PMS/backend
npx playwright test
```

### 4.3 特定のE2Eテストを実行

```bash
cd /home/ubuntu/PMS/backend
npx playwright test test/e2e/project-workflow.spec.ts
```

### 4.4 ヘッドフルモードでE2Eテストを実行（ブラウザが表示される）

```bash
cd /home/ubuntu/PMS/backend
npx playwright test --headed
```

### 4.5 テスト結果の確認

Playwrightは、失敗したテストのスクリーンショットとトレースを `test-results` ディレクトリに保存します。

```bash
cd /home/ubuntu/PMS/backend
npx playwright show-report
```

## 5. テスト結果の解釈

### 5.1 成功したテスト

テストが成功すると、以下のような出力が表示されます：

```
PASS  test/unit/users.service.spec.ts
 UsersService
   ✓ should be defined (5ms)
   ✓ should find all users (3ms)
   ✓ should find one user by id (2ms)
   ✓ should create a new user (4ms)
   ✓ should update a user (3ms)
   ✓ should delete a user (2ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.145s
```

### 5.2 失敗したテスト

テストが失敗すると、以下のような出力が表示されます：

```
FAIL  test/unit/users.service.spec.ts
 UsersService
   ✓ should be defined (5ms)
   ✓ should find all users (3ms)
   ✓ should find one user by id (2ms)
   ✕ should create a new user (4ms)
   ✓ should update a user (3ms)
   ✓ should delete a user (2ms)

 ● UsersService › should create a new user

   expect(received).toBe(expected) // Object.is equality

   Expected: "user1"
   Received: "user2"

     23 |     const result = await service.create(createUserDto);
     24 |     expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
   > 25 |     expect(result.id).toBe('user1');
        |                        ^
     26 |   });
     27 | 
     28 |   it('should update a user', async () => {

     at Object.<anonymous> (test/unit/users.service.spec.ts:25:24)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        2.145s
```

### 5.3 カバレッジレポートの解釈

カバレッジレポートには、以下の情報が含まれます：

- **Statements**: コード内のステートメントの実行率
- **Branches**: 条件分岐の実行率
- **Functions**: 関数の実行率
- **Lines**: コード行の実行率

一般的に、80%以上のカバレッジが望ましいとされています。

## 6. テスト実行時の注意事項

### 6.1 テストデータベースの準備

統合テストを実行する前に、テストデータベースが正しく設定されていることを確認してください。

```bash
cd /home/ubuntu/PMS/database
rm -f test/test.db
touch test/test.db
```

### 6.2 環境変数の設定

テスト実行時に正しい環境変数が設定されていることを確認してください。

```bash
export NODE_ENV=test
```

### 6.3 モックの使用

外部依存関係（データベース、外部API、ファイルシステムなど）にアクセスするテストでは、適切なモックを使用してください。

### 6.4 並列実行の注意点

テストを並列実行する場合、テスト間の依存関係や共有リソースへのアクセスに注意してください。

## 7. テスト結果の報告

テスト実行後、以下の情報を含むテスト結果報告書を作成してください：

1. 実行したテストの種類と数
2. 成功したテストの数と失敗したテストの数
3. 失敗したテストの詳細と原因
4. カバレッジ情報
5. 発見された問題と修正方法
6. 次のステップと推奨事項

テスト結果報告書のテンプレートは `docs/test_result_report_template.md` にあります。
