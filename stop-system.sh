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
