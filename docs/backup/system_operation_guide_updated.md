# パートナー要員管理システム 運用ガイド（更新版）

このドキュメントでは、パートナー要員管理システム（PMS）の起動方法、停止方法、および基本的な運用手順について説明します。

## 1. システム構成

PMSは以下のコンポーネントで構成されています：

- **バックエンド**: NestJS（TypeScript）
  - デフォルトポート: 3001（環境変数で変更可能）
  - データベース: SQLite（ファイルベース）

- **フロントエンド**: React + TypeScript（Vite）
  - デフォルトポート: 3002（環境変数で変更可能）

## 2. 前提条件

システムを起動する前に、以下のソフトウェアがインストールされていることを確認してください：

- Node.js（バージョン16以上）
- npm（バージョン7以上）

## 3. 環境設定

システムは環境変数を使用して設定できます。プロジェクトルートディレクトリに`.env`ファイルを作成し、以下の設定を行うことができます：

```bash
# バックエンド用設定
NODE_ENV=development
BACKEND_PORT=3001

# フロントエンド用設定
FRONTEND_PORT=3002
```

## 4. システムの起動方法

### 4.1 バックエンドの起動

1. バックエンドディレクトリに移動します：

```bash
cd /path/to/PMS/backend
```

2. 依存関係をインストールします（初回のみ）：

```bash
npm install
```

3. 開発モードでバックエンドを起動します：

```bash
npm run start:dev
```

4. 正常に起動すると、以下のようなメッセージが表示されます：

```
[Nest] XXXXX  - MM/DD/YYYY, HH:MM:SS AM     LOG [NestApplication] Nest application successfully started
[Nest] XXXXX  - MM/DD/YYYY, HH:MM:SS AM     LOG [Bootstrap] アプリケーションがポート3001で起動しました
```

### 4.2 フロントエンドの起動

1. フロントエンドディレクトリに移動します：

```bash
cd /path/to/PMS/frontend
```

2. 依存関係をインストールします（初回のみ）：

```bash
npm install
```

3. 開発モードでフロントエンドを起動します：

```bash
npm run dev
```

4. 正常に起動すると、以下のようなメッセージが表示されます：

```
  VITE v6.2.5  ready in XXX ms
  ➜  Local:   http://localhost:3002/
  ➜  Network: http://XXX.XXX.XXX.XXX:3002/
```

### 4.3 システム全体の起動（一括起動）

システム全体を一括で起動するには、以下のコマンドを実行します：

```bash
cd /path/to/PMS
./start-system.sh
```

注: start-system.shスクリプトが存在しない場合は、以下の内容で作成してください：

```bash
#!/bin/bash
echo "パートナー要員管理システムを起動します..."

# 環境変数の読み込み
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# バックエンドの起動
cd backend
npm run start:dev &
BACKEND_PID=$!
echo "バックエンドを起動しました（PID: $BACKEND_PID）"

# フロントエンドの起動
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "フロントエンドを起動しました（PID: $FRONTEND_PID）"

cd ..
echo "システムの起動が完了しました"
echo "バックエンド: http://localhost:${BACKEND_PORT:-3001}"
echo "フロントエンド: http://localhost:${FRONTEND_PORT:-3002}"
```

## 5. システムの停止方法

### 5.1 バックエンドの停止

バックエンドを停止するには、起動したターミナルで `Ctrl+C` を押します。

### 5.2 フロントエンドの停止

フロントエンドを停止するには、起動したターミナルで `Ctrl+C` を押します。

### 5.3 システム全体の停止（一括停止）

システム全体を一括で停止するには、以下のコマンドを実行します：

```bash
cd /path/to/PMS
./stop-system.sh
```

注: stop-system.shスクリプトが存在しない場合は、以下の内容で作成してください：

```bash
#!/bin/bash
echo "パートナー要員管理システムを停止します..."

# バックエンドプロセスの停止
BACKEND_PID=$(pgrep -f "node.*start:dev")
if [ -n "$BACKEND_PID" ]; then
  kill $BACKEND_PID
  echo "バックエンドを停止しました（PID: $BACKEND_PID）"
else
  echo "バックエンドは実行されていません"
fi

# フロントエンドプロセスの停止
FRONTEND_PID=$(pgrep -f "node.*vite")
if [ -n "$FRONTEND_PID" ]; then
  kill $FRONTEND_PID
  echo "フロントエンドを停止しました（PID: $FRONTEND_PID）"
else
  echo "フロントエンドは実行されていません"
fi

echo "システムの停止が完了しました"
```

## 6. システムの動作確認

システムが正常に起動したことを確認するには、以下のURLにアクセスしてください：

- バックエンドAPI: http://localhost:3001/api
- フロントエンドUI: http://localhost:3002

注: ポート番号は環境変数で変更している場合は、それに合わせて調整してください。

## 7. トラブルシューティング

### 7.1 ポートが既に使用されている場合

バックエンドまたはフロントエンドの起動時に「Port XXXX is already in use」というエラーが表示される場合：

- 自動代替ポート機能が有効になっているため、次の利用可能なポートが自動的に使用されます
- 特定のポートを使用したい場合は、以下の手順を試してください：

1. 使用中のポートを確認します：

```bash
sudo lsof -i :3001  # バックエンドポート
sudo lsof -i :3002  # フロントエンドポート
```

2. 該当するプロセスを停止します：

```bash
kill -9 <PID>  # <PID>は上記コマンドで表示されたプロセスIDに置き換えてください
```

3. 環境変数でポートを変更します（.envファイル）：

```bash
BACKEND_PORT=3001
FRONTEND_PORT=3002
```

### 7.2 データベース関連の問題

データベース関連のエラーが発生した場合は、以下の手順を試してください：

1. データベースファイルの存在を確認します：

```bash
ls -la /path/to/PMS/backend/database.sqlite
```

2. データベースファイルが存在しない場合は、マイグレーションを実行します：

```bash
cd /path/to/PMS/backend
npm run migration:run
```

### 7.3 依存関係の問題

モジュールが見つからないなどのエラーが発生した場合は、依存関係を再インストールしてください：

```bash
cd /path/to/PMS/backend
rm -rf node_modules
npm install

cd /path/to/PMS/frontend
rm -rf node_modules
npm install
```

## 8. バックアップと復元

### 8.1 データベースのバックアップ

SQLiteデータベースをバックアップするには、以下のコマンドを実行します：

```bash
cp /path/to/PMS/backend/database.sqlite /path/to/PMS/backup/database.sqlite.$(date +%Y%m%d)
```

### 8.2 データベースの復元

バックアップからデータベースを復元するには、以下のコマンドを実行します：

```bash
cp /path/to/PMS/backup/database.sqlite.<YYYYMMDD> /path/to/PMS/backend/database.sqlite
```

## 9. システムの更新

システムを更新するには、以下の手順を実行します：

1. 最新のコードを取得します：

```bash
cd /path/to/PMS
git pull origin main
```

2. 依存関係を更新します：

```bash
cd /path/to/PMS/backend
npm install

cd /path/to/PMS/frontend
npm install
```

3. マイグレーションを実行します（必要な場合）：

```bash
cd /path/to/PMS/backend
npm run migration:run
```

4. システムを再起動します：

```bash
cd /path/to/PMS
./stop-system.sh
./start-system.sh
```

## 10. インストール手順

新規環境にシステムをインストールする場合は、以下の手順を実行してください：

### 10.1 リポジトリのクローン

```bash
git clone https://github.com/energy-dot/PMS.git
cd PMS
```

### 10.2 環境変数の設定

プロジェクトルートに`.env`ファイルを作成します：

```bash
cat > .env << EOF
# バックエンド用設定
NODE_ENV=development
BACKEND_PORT=3001

# フロントエンド用設定
FRONTEND_PORT=3002
EOF
```

### 10.3 バックエンドのセットアップ

```bash
cd backend
npm install
npm run build
```

### 10.4 フロントエンドのセットアップ

```bash
cd ../frontend
npm install
```

### 10.5 システムの起動

```bash
cd ..
./start-system.sh
```

## 11. 技術仕様

### 11.1 使用技術

- バックエンド: NestJS, TypeScript, SQLite
- フロントエンド: React, TypeScript, Vite, ag-Grid

### 11.2 データベース

- タイプ: SQLite（ファイルベース）
- ファイル場所: /path/to/PMS/backend/database.sqlite
- エンティティ: Partner, Project, Staff, Contract, User, AntisocialCheck, BaseContract, ContactPerson

### 11.3 API エンドポイント

主要なAPIエンドポイントは以下の通りです：

- パートナー: /partners
- プロジェクト: /projects
- スタッフ: /staff
- 契約: /contracts
- 基本契約: /base-contracts
- 連絡先: /contact-persons
