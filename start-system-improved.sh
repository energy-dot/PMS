#!/bin/bash

# パートナー要員管理システム起動スクリプト（修正版）

echo "パートナー要員管理システムを起動しています..."

# 1. PostgreSQLデータベースの起動
echo "1. データベースを起動しています..."
# Dockerサービスが利用できない場合の代替手段
if sudo systemctl start docker; then
  echo "Dockerサービスが起動しました。PostgreSQLコンテナを起動します。"
  cd /home/ubuntu/PMS
  docker-compose -f docker-compose-alt.yml up -d postgres
  sleep 5  # データベースの起動を待つ
else
  echo "Dockerサービスの起動に失敗しました。"
  echo "注意: 実際の環境ではPostgreSQLが必要です。現在はモック環境として続行します。"
fi

# 2. バックエンドの起動
echo "2. バックエンドサーバーを起動しています..."
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
trap "kill $BACKEND_PID $FRONTEND_PID; cd /home/ubuntu/PMS && docker-compose -f docker-compose-alt.yml down 2>/dev/null; echo 'システムを終了しました'" SIGINT SIGTERM

# スクリプトを実行し続ける
wait
