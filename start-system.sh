#!/bin/bash
echo "パートナー要員管理システムを起動します..."

# 実行環境の判定
if [ -f /.dockerenv ]; then
  # Docker環境内
  ENV="docker"
  echo "Docker環境で起動します"
else
  # ローカル環境
  ENV="local"
  echo "ローカル環境で起動します"
fi

# Docker Composeでシステム起動（docker-compose.ymlのディレクトリで実行）
if [ "$ENV" == "local" ]; then
  SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
  cd "$SCRIPT_DIR"
  
  # Docker Composeがインストールされているか確認
  if command -v docker-compose &> /dev/null; then
    echo "Docker Composeを使用してシステムを起動します..."
    docker-compose down
    docker-compose up -d
  else
    echo "Docker Composeが見つかりません。docker composeコマンドを試します..."
    docker compose down
    docker compose up -d
  fi
  
  # 起動確認
  echo "バックエンドとフロントエンドの起動状態を確認しています..."
  sleep 5
  
  # コンテナの状態を確認
  docker ps | grep pms
  
  echo "システムの起動が完了しました"
  echo "フロントエンド: http://localhost:3002"
  echo "バックエンド: http://localhost:3001"
else
  # Docker環境内での起動（コンテナ内でこのスクリプトを実行した場合）
  echo "Docker環境内で実行されました。各サービスは既に起動しているはずです。"
fi
