# パートナー要員管理システム 実装状況とTodoリスト

現在のプロジェクト状況とTodoリストを以下にまとめます。プロジェクトは3層アーキテクチャ（React + TypeScript フロントエンド、NestJS バックエンド、SQLite データベース）で構成されています。

## 現在の実装状況

### フロントエンド (React + TypeScript)

#### 実装済み機能
- 基本的なレイアウト構成（Header, Sidebar, Layout）
- ログイン機能
- ag-Grid を使用したデータグリッド（エクセルライク機能対応）
- 以下の主要ページ：
  - ダッシュボード
  - パートナー会社一覧・詳細
  - 案件一覧・詳細
  - 契約一覧・詳細
  - 要員一覧・詳細

#### 実装中/部分的実装
- パートナー会社関連サブ機能：
  - 信用調査/反社チェック管理
  - 基本契約管理
  - 営業窓口管理
- フォームバリデーション（React Hook Form + Zod）
- 部門・セクションフィルター機能

### バックエンド (NestJS)

#### 実装済み機能
- JWT認証機能
- 主要エンティティの定義：
  - User（ユーザー）
  - Partner（パートナー会社）
  - Project（案件）
  - Staff（要員）
  - Contract（契約）
- RESTful APIエンドポイント：
  - パートナー会社CRUD
  - 案件CRUD
  - 契約CRUD
  - 要員CRUD
- 部門・セクション管理機能のAPI

#### 実装中/部分的実装
- パートナー会社関連サブ機能API：
  - 信用調査/反社チェック管理
  - 基本契約管理
  - 営業窓口管理
- バリデーションとエラー処理
- ロールベースアクセス制御（RBAC）

### データベース

#### 実装済み機能
- SQLiteデータベース設定
- 主要テーブルのマイグレーション：
  - users
  - partners
  - projects
  - staff
  - contracts
  - departments
  - sections
- パートナー関連サブテーブル：
  - antisocial_checks
  - base_contracts
  - contact_persons

#### 実装中/部分的実装
- その他関連テーブルのマイグレーション
- インデックス最適化

## Todoリスト

### フロントエンド

1. **未実装のページ開発：**
   - [ ] 要員募集状況管理（応募管理）機能
   - [ ] 要員評価管理機能
   - [ ] 通知機能
   - [ ] 検索機能の強化
   - [ ] レポート機能
   - [ ] マスターデータ管理機能
   - [ ] ユーザー・アクセス権限管理機能

2. **既存ページの機能強化：**
   - [ ] パートナー会社詳細ページの拡充（信用調査/反社チェック/基本契約/営業窓口の統合管理）
   - [ ] 案件詳細ページの拡充（応募者管理、案件承認ワークフロー）
   - [ ] 契約詳細ページの拡充（契約書管理、契約更新機能）
   - [ ] 要員詳細ページの拡充（スキル管理、評価履歴、契約履歴）

3. **UIの改善：**
   - [ ] ダッシュボード画面のデータ可視化（グラフ・チャート）
   - [ ] レスポンシブデザインの完全対応
   - [ ] ダークモード対応
   - [ ] アクセシビリティ対応

4. **機能・性能強化：**
   - [ ] グローバルな検索機能
   - [ ] ファイルアップロード（スキルシート、契約書など）
   - [ ] Excel/CSVインポート/エクスポート機能強化
   - [ ] パフォーマンス最適化（メモ化、遅延ロードなど）

5. **テスト強化：**
   - [ ] ユニットテストのカバレッジ向上
   - [ ] E2Eテスト（Cypress）の拡充
   - [ ] 境界値・エッジケーステスト

### バックエンド

1. **未実装の機能開発：**
   - [ ] 要員募集状況管理（応募管理）API
   - [ ] 要員評価管理API
   - [ ] 通知機能API（WebSocket対応）
   - [ ] レポート機能API
   - [ ] マスターデータ管理API
   - [ ] ワークフロー管理API（依頼・承認プロセス）

### データベース

1. **テーブル追加：**
   - [ ] 応募者（applications）テーブル
   - [ ] 要員評価（evaluations）テーブル
   - [ ] 通知（notifications）テーブル
   - [ ] 依頼ワークフロー（requests）テーブル
   - [ ] マスターデータ関連テーブル（skills, statuses など）

2. **データベース最適化：**
   - [ ] インデックス最適化
   - [ ] クエリパフォーマンス改善
   - [ ] データバリデーション・整合性ルールの強化

## 優先度の高いTodo項目

主要な機能要件から、最優先で実装すべき項目：

1. **要員募集状況管理（応募管理）機能の実装**
   - フロントエンド：応募者一覧・詳細画面、選考ステータス管理
   - バックエンド：応募者API、選考プロセス管理API
   - データベース：応募者テーブル、選考履歴テーブル

2. **案件承認ワークフローの完全実装**
   - フロントエンド：申請・承認・差し戻しUI
   - バックエンド：ワークフローAPI
   - データベース：申請履歴テーブル

3. **通知機能の実装**
   - フロントエンド：通知表示UI、既読管理
   - バックエンド：通知生成・管理API
   - データベース：通知テーブル

4. **要員評価管理機能の実装**
   - フロントエンド：評価入力・表示UI
   - バックエンド：評価管理API
   - データベース：評価テーブル
