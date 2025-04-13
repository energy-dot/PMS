# パートナー要員管理システム (PMS)

## 概要
本システムは、システム開発等で協業するパートナー会社およびその会社に所属する要員（エンジニア等）に関する情報を一元的に管理することを目的としています。

## セットアップ方法

### 1. 依存パッケージのインストール

#### バックエンド
```bash
cd backend
npm install
```

#### フロントエンド
```bash
cd frontend
npm install
```

### 2. データベースのセットアップ
SQLiteを使用しており、初回起動時に自動的にデータベースが作成されます。

### 3. 起動方法

#### Windows
バックエンドとフロントエンドを別々のコマンドプロンプトで起動します。

1. バックエンドの起動:
   - `start-backend.bat` をダブルクリックで実行

2. フロントエンドの起動:
   - `start-frontend.bat` をダブルクリックで実行

#### macOS/Linux
```bash
# バックエンド
cd backend
npm run start:dev

# フロントエンド
cd frontend
npm run dev
```

### 4. アクセス方法
- フロントエンド: http://localhost:3002
- バックエンドAPI: http://localhost:3001

## 初期アカウント
| ユーザー名 | パスワード | 役割 |
|------------|------------|------|
| admin | password | 管理者 |
| partner_manager | password | パートナー管理担当者 |
| developer | password | 開発担当者 |
| viewer | password | 閲覧者 |

## トラブルシューティング

### バックエンドが起動しない場合
1. ポート3001が既に使用されている可能性があります。他のアプリケーションがポートを使用していないか確認してください。
2. `.env`ファイルに正しい設定がされているか確認してください。

### フロントエンドがバックエンドに接続できない場合
1. バックエンドが起動しているか確認してください。
2. フロントエンドの`.env`ファイルに正しいバックエンドURLが設定されているか確認してください。
3. CORSの設定が正しいか確認してください。

### ag-Grid関連の警告が表示される場合
フロントエンドのコンソールにag-Gridに関する警告が表示されることがありますが、基本的な機能には影響しません。これはEnterpriseモジュールが登録されていないためです。必要に応じてEnterpriseライセンスを購入し、該当するモジュールを追加してください。
