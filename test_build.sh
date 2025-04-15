#!/bin/bash

# バックエンドのマイグレーション実行とビルドテスト
echo "バックエンドのマイグレーションとビルドテストを実行します..."
cd /home/ubuntu/PMS/backend

# 依存関係のインストール
echo "依存関係をインストールしています..."
npm install

# マイグレーションの実行
echo "データベースマイグレーションを実行しています..."
npm run typeorm:run-migrations

# ビルドテスト
echo "バックエンドのビルドテストを実行しています..."
npm run build

# フロントエンドのビルドテスト
echo "フロントエンドのビルドテストを実行します..."
cd /home/ubuntu/PMS/frontend

# 依存関係のインストール
echo "依存関係をインストールしています..."
npm install

# ビルドテスト
echo "フロントエンドのビルドテストを実行しています..."
npm run build

echo "テスト完了"
