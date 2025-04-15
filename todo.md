# パートナー要員管理システム リファクタリングTODO

## データベーススキーマ改善
- [x] 部署構造の移行完了のためのマイグレーションファイル作成
- [x] 旧departmentカラムの削除とNOT NULL制約の追加
- [x] インデックスの追加によるパフォーマンス向上
- [x] 循環参照の適切な処理

## バックエンド改善
### エンティティ定義の更新
- [x] Project、Department、Sectionエンティティの循環参照問題の解決
- [x] 型安全性の向上
- [x] リレーションシップの制約追加（onDelete: 'RESTRICT'など）

### サービスの更新
- [x] ProjectsServiceの更新（部署構造の変更対応）
- [x] DTOクラスの更新（departmentIdとsectionIdを必須フィールドに）
- [x] ReportsServiceの機能別分割
  - [x] ProjectStatusReportService
  - [x] PartnerReportService
  - [x] ApplicationReportService
  - [x] EvaluationReportService
  - [x] ContractReportService
- [ ] EvaluationsServiceの機能別分割
- [ ] ProjectsServiceの機能別分割

### 共通ユーティリティの作成
- [x] 日付処理ユーティリティの作成（DateUtilsService）
- [ ] バリデーションユーティリティの作成
- [x] フォーマット処理ユーティリティの作成（FilterUtilsService）
- [ ] エラーハンドリングの共通化

### エラー処理の改善
- [ ] グローバルエラーハンドラーの実装
- [ ] 例外フィルターの追加
- [ ] エラーログの強化

## フロントエンド改善
### コンポーネントの更新
- [x] ProjectDetail.tsxの更新（部署表示部分の新構造対応）
- [x] ProjectList.tsxの更新（旧departmentフィールド列の削除）
- [x] DataGridコンポーネントの分割
  - [x] DataGridCore
  - [x] DataGridToolbar
  - [x] DataGridFooter
- [x] UserManagementコンポーネントの分割
  - [x] UserTabs
  - [x] UserList
  - [x] RoleList
  - [x] UserFormModal
  - [x] RoleFormModal
- [ ] ProjectListコンポーネントの分割

### 状態管理の改善
- [ ] Zustandストアの整理
- [ ] React Queryの活用
- [ ] グローバル状態とローカル状態の適切な分離

### パフォーマンス最適化
- [ ] メモ化の適切な使用
- [ ] 不要な再レンダリングの防止
- [ ] コード分割の実装

## コード品質向上
### リンター・フォーマッター
- [x] ESLint設定ファイルの追加（フロントエンド）
- [x] ESLint設定ファイルの追加（バックエンド）
- [x] Prettier設定ファイルの追加（フロントエンド）
- [x] Prettier設定ファイルの追加（バックエンド）

### 未使用コードの削除
- [x] 未使用のコントローラーメソッドの削除
- [x] 未使用のサービスメソッドの削除
- [x] 未使用のDTOクラスの削除
- [x] 未使用のエンティティフィールドの削除

### テスト強化
- [ ] ユニットテストの追加
- [ ] 統合テストの追加
- [ ] モックの適切な使用

### CI/CD
- [ ] GitHub Actionsの設定（対応不要）
- [ ] 自動テストの設定（対応不要）
- [ ] 自動デプロイの設定（対応不要）

## テストと検証
- [x] バックエンドのビルドテスト
- [x] フロントエンドのビルドテスト
- [ ] 統合テスト
- [ ] エンドツーエンドテスト
- [ ] パフォーマンステスト
