#!/bin/bash

# パートナー要員管理システム起動スクリプト

echo "パートナー要員管理システムを起動しています..."

# 1. PostgreSQLデータベースの起動
echo "1. データベースを起動しています..."
cd /home/ubuntu/PMS
docker-compose up -d postgres
sleep 5  # データベースの起動を待つ

# 2. バックエンドの起動
echo "2. バックエンドサーバーを起動しています..."
cd /home/ubuntu/PMS/backend
npm run start:dev &
BACKEND_PID=$!
sleep 5  # バックエンドの起動を待つ

# 3. フロントエンドの起動
echo "3. フロントエンドサーバーを起動しています..."
cd /home/ubuntu/PMS/frontend
npm run dev &
FRONTEND_PID=$!

echo "システムが起動しました！"
echo "フロントエンド: http://localhost:5173"
echo "バックエンドAPI: http://localhost:3001/api"
echo ""
echo "終了するには Ctrl+C を押してください"

# 終了時の処理
trap "kill $BACKEND_PID $FRONTEND_PID; cd /home/ubuntu/PMS && docker-compose down; echo 'システムを終了しました'" SIGINT SIGTERM

# スクリプトを実行し続ける
wait
