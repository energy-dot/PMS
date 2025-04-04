# パートナー要員管理システム ドキュメント一覧

## 1. システム概要
- [システムアーキテクチャ設計書](/home/ubuntu/architecture/system_architecture.md) - システム全体の構成と設計方針

## 2. 起動・アクセス方法
- [システム起動・アクセスガイド](/home/ubuntu/system_startup_guide.md) - システムの起動方法とアクセス方法の詳細

## 3. 実装報告
- [実装完了報告書](/home/ubuntu/implementation_report.md) - システム実装の概要と成果物の説明

## 4. 開発資料
- [タスク一覧](/home/ubuntu/todo.md) - 実装タスクの一覧と進捗状況

## 5. 構成ファイル
- [Docker Compose設定](/home/ubuntu/docker-compose.yml) - データベースコンテナの設定
- [起動スクリプト（ローカル環境用）](/home/ubuntu/start-system.sh) - ローカル環境での起動スクリプト
- [起動スクリプト（インターネット公開用）](/home/ubuntu/start-system-internet.sh) - インターネット公開用の起動スクリプト

## 6. データベース
- [初期スキーマ](/home/ubuntu/database/migrations/001_initial_schema.sql) - データベースの初期スキーマ定義
- [シードデータ](/home/ubuntu/database/seeds/001_seed_data.sql) - テスト用の初期データ
- [データベース初期化スクリプト](/home/ubuntu/database/init-db.sh) - データベースの初期化スクリプト
