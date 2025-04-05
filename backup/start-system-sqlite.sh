#!/bin/bash

# パートナー要員管理システム起動スクリプト（SQLite版）

echo "パートナー要員管理システムを起動しています（SQLite版）..."

# 1. バックエンドの起動
echo "1. バックエンドサーバーを起動しています..."
cd /home/ubuntu/PMS/backend
# NestJSコマンドが利用可能かチェック
if command -v nest &> /dev/null; then
  nest start --watch &
else
  echo "NestJSコマンドが見つかりません。npxを使用します。"
  npx nest start --watch &
fi
BACKEND_PID=$!
sleep 5  # バックエンドの起動を待つ

# 2. フロントエンドの起動
echo "2. フロントエンドサーバーを起動しています..."
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
