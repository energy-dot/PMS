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
