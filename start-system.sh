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
