# インストールガイド

このガイドでは、パートナー要員管理システム（PMS）の新規インストール手順について詳しく説明します。

## 1. 前提条件

システムをインストールする前に、以下のソフトウェアがインストールされていることを確認してください：

- Node.js（バージョン16以上）
- npm（バージョン7以上）
- Git

## 2. リポジトリのクローン

以下のコマンドを実行して、リポジトリをクローンします：

```bash
git clone https://github.com/energy-dot/PMS.git
cd PMS
```

## 3. 環境変数の設定

プロジェクトルートディレクトリに`.env`ファイルを作成し、以下の設定を行います：

```bash
# バックエンド用設定
NODE_ENV=development
BACKEND_PORT=3001

# フロントエンド用設定
FRONTEND_PORT=3002
```

## 4. バックエンドのセットアップ

### 4.1 依存関係のインストール

```bash
cd backend
npm install
```

### 4.2 アプリケーションのビルド

```bash
npm run build
```

### 4.3 データベースの初期化

SQLiteデータベースが自動的に作成されます。必要に応じて以下のコマンドでマイグレーションを実行します：

```bash
npm run migration:run
```

## 5. フロントエンドのセットアップ

### 5.1 依存関係のインストール

```bash
cd ../frontend
npm install
```

## 6. 起動スクリプトの作成

プロジェクトルートディレクトリに戻り、起動スクリプトと停止スクリプトを作成します：

### 6.1 起動スクリプト（start-system.sh）

```bash
cd ..
cat > start-system.sh << 'EOF'
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
EOF

chmod +x start-system.sh
```

### 6.2 停止スクリプト（stop-system.sh）

```bash
cat > stop-system.sh << 'EOF'
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
EOF

chmod +x stop-system.sh
```

## 7. システムの起動

以下のコマンドを実行して、システムを起動します：

```bash
./start-system.sh
```

## 8. 動作確認

システムが正常に起動したことを確認するには、以下のURLにアクセスしてください：

- バックエンドAPI: http://localhost:3001/api
- フロントエンドUI: http://localhost:3002

注: ポート番号は環境変数で変更している場合は、それに合わせて調整してください。

## 9. トラブルシューティング

### 9.1 ポートが既に使用されている場合

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

### 9.2 依存関係の問題

モジュールが見つからないなどのエラーが発生した場合は、依存関係を再インストールしてください：

```bash
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

### 9.3 Node.jsバージョンの問題

Node.jsのバージョンが古い場合は、nvmを使用して適切なバージョンをインストールしてください：

```bash
# nvmのインストール（まだインストールしていない場合）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc

# Node.jsの最新LTSバージョンをインストール
nvm install --lts
nvm use --lts
```

## 10. システムの更新

システムを更新するには、以下の手順を実行します：

```bash
# システムを停止
./stop-system.sh

# 最新のコードを取得
git pull origin main

# 依存関係を更新
cd backend
npm install
cd ../frontend
npm install

# システムを再起動
cd ..
./start-system.sh
```
