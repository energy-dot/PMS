# パートナー要員管理システム 運用ガイド

このドキュメントでは、パートナー要員管理システム（PMS）の起動方法、停止方法、および基本的な運用手順について説明します。

## 1. システム構成

PMSは以下のコンポーネントで構成されています：

- **バックエンド**: NestJS（TypeScript）
  - ポート: 3001
  - データベース: SQLite

- **フロントエンド**: React + TypeScript（Vite）
  - ポート: 3002（デフォルト）

## 2. 前提条件

システムを起動する前に、以下のソフトウェアがインストールされていることを確認してください：

- Node.js（バージョン16以上）
- npm（バージョン7以上）

## 3. システムの起動方法

### 3.1 バックエンドの起動

1. バックエンドディレクトリに移動します：

```bash
cd /home/ubuntu/PMS/backend
```

2. 依存関係をインストールします（初回のみ）：

```bash
npm install
```

3. 開発モードでバックエンドを起動します：

```bash
npm run start:dev
```

4. 正常に起動すると、以下のメッセージが表示されます：

```
Application is running on: http://[::1]:3001
```

### 3.2 フロントエンドの起動

1. フロントエンドディレクトリに移動します：

```bash
cd /home/ubuntu/PMS/frontend
```

2. 依存関係をインストールします（初回のみ）：

```bash
npm install
```

3. 開発モードでフロントエンドを起動します：

```bash
npm run dev
```

4. 正常に起動すると、以下のメッセージが表示されます：

```
  VITE v6.2.5  ready in XXX ms
  ➜  Local:   http://localhost:3002/
  ➜  Network: http://XXX.XXX.XXX.XXX:3002/
```

### 3.3 システム全体の起動（一括起動）

システム全体を一括で起動するには、以下のコマンドを実行します：

```bash
cd /home/ubuntu/PMS
./start-system.sh
```

注: start-system.shスクリプトが存在しない場合は、以下の内容で作成してください：

```bash
#!/bin/bash
echo "パートナー要員管理システムを起動します..."

# バックエンドの起動
cd /home/ubuntu/PMS/backend
npm run start:dev &
BACKEND_PID=$!
echo "バックエンドを起動しました（PID: $BACKEND_PID）"

# フロントエンドの起動
cd /home/ubuntu/PMS/frontend
npm run dev &
FRONTEND_PID=$!
echo "フロントエンドを起動しました（PID: $FRONTEND_PID）"

echo "システムの起動が完了しました"
echo "バックエンド: http://localhost:3001"
echo "フロントエンド: http://localhost:3002"
```

## 4. システムの停止方法

### 4.1 バックエンドの停止

バックエンドを停止するには、起動したターミナルで `Ctrl+C` を押します。

### 4.2 フロントエンドの停止

フロントエンドを停止するには、起動したターミナルで `Ctrl+C` を押します。

### 4.3 システム全体の停止（一括停止）

システム全体を一括で停止するには、以下のコマンドを実行します：

```bash
cd /home/ubuntu/PMS
./stop-system.sh
```

注: stop-system.shスクリプトが存在しない場合は、以下の内容で作成してください：

```bash
#!/bin/bash
echo "パートナー要員管理システムを停止します..."

# バックエンドプロセスの停止
BACKEND_PID=$(ps -ef | grep "node.*start:dev" | grep -v grep | awk '{print $2}')
if [ -n "$BACKEND_PID" ]; then
  kill $BACKEND_PID
  echo "バックエンドを停止しました（PID: $BACKEND_PID）"
else
  echo "バックエンドは実行されていません"
fi

# フロントエンドプロセスの停止
FRONTEND_PID=$(ps -ef | grep "node.*vite" | grep -v grep | awk '{print $2}')
if [ -n "$FRONTEND_PID" ]; then
  kill $FRONTEND_PID
  echo "フロントエンドを停止しました（PID: $FRONTEND_PID）"
else
  echo "フロントエンドは実行されていません"
fi

# Dockerコンテナが実行中であれば停止
if command -v docker &> /dev/null; then
  if docker ps | grep -q pms-frontend; then
    echo "Dockerコンテナを停止します..."
    docker-compose -f docker-compose.yml down
  fi
fi

echo "システムの停止が完了しました"
```

## 5. システムの動作確認

システムが正常に起動したことを確認するには、以下のURLにアクセスしてください：

- バックエンドAPI: http://localhost:3001/api
- フロントエンドUI: http://localhost:3002

## 6. トラブルシューティング

### 6.1 ポートが既に使用されている場合

バックエンドまたはフロントエンドの起動時に「Port XXXX is already in use」というエラーが表示される場合は、以下の手順を試してください：

1. 使用中のポートを確認します：

```bash
sudo lsof -i :3001  # バックエンドポート
sudo lsof -i :3002  # フロントエンドポート
```

2. 該当するプロセスを停止します：

```bash
kill -9 <PID>  # <PID>は上記コマンドで表示されたプロセスIDに置き換えてください
```

### 6.2 データベース関連の問題

データベース関連のエラーが発生した場合は、以下の手順を試してください：

1. データベースファイルの存在を確認します：

```bash
ls -la /home/ubuntu/PMS/backend/database.sqlite
```

2. データベースファイルが存在しない場合は、マイグレーションを実行します：

```bash
cd /home/ubuntu/PMS/backend
npm run migration:run
```

### 6.3 依存関係の問題

モジュールが見つからないなどのエラーが発生した場合は、依存関係を再インストールしてください：

```bash
cd /home/ubuntu/PMS/backend
rm -rf node_modules
npm install

cd /home/ubuntu/PMS/frontend
rm -rf node_modules
npm install
```

## 7. バックアップと復元

### 7.1 データベースのバックアップ

SQLiteデータベースをバックアップするには、以下のコマンドを実行します：

```bash
cp /home/ubuntu/PMS/backend/database.sqlite /home/ubuntu/PMS/backup/database.sqlite.$(date +%Y%m%d)
```

### 7.2 データベースの復元

バックアップからデータベースを復元するには、以下のコマンドを実行します：

```bash
cp /home/ubuntu/PMS/backup/database.sqlite.<YYYYMMDD> /home/ubuntu/PMS/backend/database.sqlite
```

## 8. システムの更新

システムを更新するには、以下の手順を実行します：

1. 最新のコードを取得します：

```bash
cd /home/ubuntu/PMS
git pull origin main
```

2. 依存関係を更新します：

```bash
cd /home/ubuntu/PMS/backend
npm install

cd /home/ubuntu/PMS/frontend
npm install
```

3. マイグレーションを実行します（必要な場合）：

```bash
cd /home/ubuntu/PMS/backend
npm run migration:run
```

4. システムを再起動します：

```bash
cd /home/ubuntu/PMS
./stop-system.sh
./start-system.sh
```
