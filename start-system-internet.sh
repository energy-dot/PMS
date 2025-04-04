#!/bin/bash

# パートナー要員管理システム インターネット公開スクリプト

echo "パートナー要員管理システムをインターネットに公開しています..."

# 1. PostgreSQLデータベースの起動
echo "1. データベースを起動しています..."
docker-compose up -d postgres
sleep 5  # データベースの起動を待つ

# 2. バックエンドの起動（0.0.0.0にバインド）
echo "2. バックエンドサーバーを起動しています..."
cd /home/ubuntu/backend
# .envファイルのホスト設定を一時的に変更
sed -i 's/DB_HOST=localhost/DB_HOST=0.0.0.0/g' .env
# バックエンドを起動（全てのインターフェースでリッスン）
NODE_ENV=production HOST=0.0.0.0 npm run start:prod &
BACKEND_PID=$!
sleep 5  # バックエンドの起動を待つ

# 3. フロントエンドの起動（0.0.0.0にバインド）
echo "3. フロントエンドサーバーを起動しています..."
cd /home/ubuntu/frontend
# フロントエンドを起動（全てのインターフェースでリッスン）
npm run preview -- --host 0.0.0.0 &
FRONTEND_PID=$!

echo "システムが起動しました！"
echo "ローカルアクセス:"
echo "フロントエンド: http://localhost:4173"
echo "バックエンドAPI: http://localhost:3001/api"
echo ""
echo "インターネット経由でアクセスするには、以下のコマンドを実行してください:"
echo "フロントエンド: curl -X POST http://localhost:8080/api/v1/expose-port -d '{\"port\": 4173}'"
echo "バックエンド: curl -X POST http://localhost:8080/api/v1/expose-port -d '{\"port\": 3001}'"
echo ""
echo "終了するには Ctrl+C を押してください"

# 終了時の処理
trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose down; echo 'システムを終了しました'" SIGINT SIGTERM

# スクリプトを実行し続ける
wait
