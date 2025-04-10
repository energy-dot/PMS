#!/bin/bash

# パートナー要員管理システム起動スクリプト（修正版）

echo "パートナー要員管理システムを起動しています..."

# 1. PostgreSQLデータベースの起動（Dockerなしで実行）
echo "1. Dockerサービスが利用できないため、データベース起動をスキップします..."
echo "注意: 実際の環境ではPostgreSQLが必要です"

# 2. バックエンドの起動
echo "2. バックエンドサーバーを起動しています..."
cd /home/ubuntu/PMS/backend
echo "注意: NestJSコマンドが見つからないため、npxを使用します"
npx nest start --watch &
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
trap "kill $BACKEND_PID $FRONTEND_PID; echo 'システムを終了しました'" SIGINT SIGTERM

# スクリプトを実行し続ける
wait
