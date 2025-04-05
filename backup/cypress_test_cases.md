# パートナー要員管理システム Cypressテストケース

## 1. 概要

このドキュメントでは、パートナー要員管理システムのE2Eテストのためのテストケースを定義します。テストはCypressを使用して実装され、システムの主要機能が正常に動作することを確認します。

## 2. 既存のテストケース

現在、以下のテストケースが実装されています：

### 2.1 パートナー企業管理テスト (`partner_crud.spec.js`)
- パートナー企業を新規登録できること
- パートナー企業情報を更新できること
- パートナー企業を削除できること

### 2.2 反社チェック管理テスト (`antisocial_check_crud.spec.js`)
- 反社チェック情報を新規登録できること
- 反社チェック情報を更新できること
- 反社チェック情報を削除できること

### 2.3 基本契約管理テスト (`base_contract_crud.spec.js`)
- 基本契約情報を新規登録できること
- 基本契約情報を更新できること
- 基本契約情報を削除できること

### 2.4 窓口担当者管理テスト (`contact_person_crud.spec.js`)
- 窓口担当者情報を新規登録できること
- 窓口担当者情報を更新できること
- 窓口担当者情報を削除できること

## 3. 追加テストケース

システムの他の主要機能に対するテストケースを以下に定義します。

### 3.1 認証テスト (`auth.spec.js`)

```javascript
describe('認証機能', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('有効な認証情報でログインできること', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードにリダイレクトされることを確認
    cy.url().should('include', '/dashboard');
    cy.contains('ダッシュボード').should('exist');
  });

  it('無効な認証情報ではログインできないこと', () => {
    cy.get('input[name="username"]').type('invalid');
    cy.get('input[name="password"]').type('invalid');
    cy.get('button[type="submit"]').click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('ユーザー名またはパスワードが正しくありません').should('exist');
    cy.url().should('include', '/login');
  });

  it('ログアウトが正常に機能すること', () => {
    // ログイン
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ログアウト
    cy.contains('ログアウト').click();
    
    // ログイン画面にリダイレクトされることを確認
    cy.url().should('include', '/login');
  });
});
```

### 3.2 案件管理テスト (`project_crud.spec.js`)

```javascript
describe('案件管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // 案件一覧ページに移動
    cy.visit('/projects');
  });

  it('案件を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="name"]').type('テスト案件');
    cy.get('textarea[name="description"]').type('これはテスト案件の説明です。');
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('select[name="status"]').select('募集中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('テスト案件').should('exist');
  });

  it('案件情報を更新できること', () => {
    // 既存の案件を選択
    cy.contains('テスト案件').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="name"]').clear().type('テスト案件（更新）');
    cy.get('textarea[name="description"]').clear().type('これは更新されたテスト案件の説明です。');
    cy.get('select[name="status"]').select('進行中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('テスト案件（更新）').should('exist');
  });

  it('案件を削除できること', () => {
    // 既存の案件を選択
    cy.contains('テスト案件（更新）').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('テスト案件（更新）').should('not.exist');
  });
});
```

### 3.3 要員管理テスト (`staff_crud.spec.js`)

```javascript
describe('要員管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // 要員一覧ページに移動
    cy.visit('/staff');
  });

  it('要員を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('input[name="name"]').type('山田太郎');
    cy.get('select[name="partnerId"]').select('テスト株式会社'); // パートナー企業を選択
    cy.get('input[name="email"]').type('yamada@example.com');
    cy.get('input[name="phone"]').type('090-1234-5678');
    cy.get('select[name="skillLevel"]').select('中級');
    cy.get('input[name="hourlyRate"]').type('5000');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認
    cy.contains('山田太郎').should('exist');
  });

  it('要員情報を更新できること', () => {
    // 既存の要員を選択
    cy.contains('山田太郎').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="name"]').clear().type('山田次郎');
    cy.get('input[name="email"]').clear().type('jiro@example.com');
    cy.get('select[name="skillLevel"]').select('上級');
    cy.get('input[name="hourlyRate"]').clear().type('6000');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('山田次郎').should('exist');
  });

  it('要員を削除できること', () => {
    // 既存の要員を選択
    cy.contains('山田次郎').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('山田次郎').should('not.exist');
  });
});
```

### 3.4 個別契約管理テスト (`contract_crud.spec.js`)

```javascript
describe('個別契約管理 CRUD操作', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // 契約一覧ページに移動
    cy.visit('/contracts');
  });

  it('個別契約を新規登録できること', () => {
    // 新規登録ボタンをクリック
    cy.contains('新規登録').click();
    
    // フォームに入力
    cy.get('select[name="staffId"]').select('山田太郎'); // 要員を選択
    cy.get('select[name="projectId"]').select('テスト案件'); // 案件を選択
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-12-31');
    cy.get('input[name="rate"]').type('5000');
    cy.get('select[name="status"]').select('契約中');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 登録成功の確認（契約IDが表示されることを確認）
    cy.contains('山田太郎').should('exist');
    cy.contains('テスト案件').should('exist');
  });

  it('個別契約情報を更新できること', () => {
    // 既存の契約を選択（山田太郎のテスト案件契約）
    cy.contains('tr', '山田太郎').contains('テスト案件').parent('tr').click();
    
    // 編集ボタンをクリック
    cy.contains('編集').click();
    
    // 情報を更新
    cy.get('input[name="endDate"]').clear().type('2026-03-31');
    cy.get('input[name="rate"]').clear().type('5500');
    cy.get('textarea[name="notes"]').type('契約期間と単価を更新');
    
    // 保存ボタンをクリック
    cy.contains('保存').click();
    
    // 更新成功の確認
    cy.contains('2026-03-31').should('exist');
    cy.contains('5,500').should('exist');
  });

  it('個別契約を削除できること', () => {
    // 既存の契約を選択
    cy.contains('tr', '山田太郎').contains('テスト案件').parent('tr').click();
    
    // 削除ボタンをクリック
    cy.contains('削除').click();
    
    // 確認ダイアログでOKをクリック
    cy.on('window:confirm', () => true);
    
    // 削除成功の確認
    cy.contains('tr', '山田太郎').contains('テスト案件').should('not.exist');
  });
});
```

### 3.5 ダッシュボードテスト (`dashboard.spec.js`)

```javascript
describe('ダッシュボード機能', () => {
  beforeEach(() => {
    // ログイン処理
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // ダッシュボードページに移動
    cy.visit('/dashboard');
  });

  it('ダッシュボードに主要KPIが表示されること', () => {
    // 主要KPIの表示確認
    cy.contains('パートナー会社数').should('exist');
    cy.contains('案件数').should('exist');
    cy.contains('稼働中要員数').should('exist');
  });

  it('ダッシュボードから各機能ページに遷移できること', () => {
    // パートナー一覧へ遷移
    cy.contains('パートナー管理').click();
    cy.url().should('include', '/partners');
    cy.go('back');
    
    // 案件一覧へ遷移
    cy.contains('案件管理').click();
    cy.url().should('include', '/projects');
    cy.go('back');
    
    // 要員一覧へ遷移
    cy.contains('要員管理').click();
    cy.url().should('include', '/staff');
    cy.go('back');
    
    // 契約一覧へ遷移
    cy.contains('契約管理').click();
    cy.url().should('include', '/contracts');
  });
});
```

## 4. テスト実行方法

### 4.1 開発環境でのテスト実行

```bash
# Cypressを開いてテストを選択実行
cd /home/ubuntu/PMS/frontend
npx cypress open

# または、ヘッドレスモードですべてのテストを実行
cd /home/ubuntu/PMS/frontend
npx cypress run
```

### 4.2 CI/CD環境でのテスト実行

CI/CD環境では、以下のコマンドでテストを実行します：

```bash
cd /home/ubuntu/PMS/frontend
npm run test:e2e
```

## 5. テスト実装の優先順位

1. 認証テスト (`auth.spec.js`)
2. ダッシュボードテスト (`dashboard.spec.js`)
3. 案件管理テスト (`project_crud.spec.js`)
4. 要員管理テスト (`staff_crud.spec.js`)
5. 個別契約管理テスト (`contract_crud.spec.js`)

## 6. 注意事項

- テストを実行する前に、バックエンドとフロントエンドが起動していることを確認してください
- テストデータは各テスト実行前に適切に準備する必要があります
- テスト間の依存関係に注意し、テストの順序に依存しないようにしてください
- 実際のUIコンポーネントの構造に合わせてセレクタを調整する必要があります
