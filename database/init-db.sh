#!/bin/bash

# PostgreSQLデータベースの初期化スクリプト
# このスクリプトはマイグレーションとシードデータを順番に実行します

# マイグレーションファイルの実行
echo "マイグレーションファイルを実行中..."
for migration in /docker-entrypoint-initdb.d/migrations/*.sql
do
  echo "実行中: $migration"
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$migration"
done

# シードデータの実行
echo "シードデータを実行中..."
for seed in /docker-entrypoint-initdb.d/seeds/*.sql
do
  echo "実行中: $seed"
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$seed"
done

echo "データベースの初期化が完了しました。"
