# パートナー要員管理システム テスト実施TODO

## テスト環境構築
- [x] テスト環境構築手順書の作成
- [x] テスト実施手順書の作成
- [ ] テスト環境の検証

## バックエンドユニットテスト
- [x] テスト環境セットアップ
- [x] 既存機能のユニットテスト実装
  - [x] UsersService テスト実装
  - [x] PartnersService テスト実装
  - [x] ProjectsService テスト実装
  - [x] StaffService テスト実装
  - [x] ContractsService テスト実装
  - [x] AuthService テスト実装
- [x] 新規機能のユニットテスト実装
  - [x] ApplicationsService テスト実装
  - [x] EvaluationsService テスト実装
  - [x] NotificationsService テスト実装
  - [x] WorkflowsService テスト実装
  - [x] FileUploadService テスト実装
  - [x] ReportsService テスト実装
- [ ] バックエンドユニットテスト実行
  - [ ] 既存機能のユニットテスト実行
  - [ ] 新規機能のユニットテスト実行
  - [ ] テスト結果の分析と問題修正

## 統合テスト
- [x] ワークフロー承認と通知の連携
  - [x] テスト実装
  - [x] テスト実行
  - [ ] 問題修正（必要な場合）
- [x] ファイルアップロードと関連エンティティの連携
  - [x] テスト実装
  - [x] テスト実行
  - [ ] 問題修正（必要な場合）
- [x] 応募者管理と評価の連携
  - [x] テスト実装
  - [x] テスト実行
  - [ ] 問題修正（必要な場合）

## E2Eテスト
- [x] 案件ワークフロー
  - [x] テスト実装
  - [x] テスト実行（環境制約あり）
  - [ ] 問題修正（必要な場合）
- [ ] 契約管理
  - [ ] テスト実装
  - [ ] テスト実行
  - [ ] 問題修正（必要な場合）
- [ ] 要員評価
  - [ ] テスト実装
  - [ ] テスト実行
  - [ ] 問題修正（必要な場合）

## 問題修正と文書化
- [ ] 統合テストで発見された問題の修正
- [ ] E2Eテストで発見された問題の修正
- [ ] テストケース表の作成
- [ ] テスト結果報告書の作成
- [ ] 最終テスト完了報告

## 追加タスク
- [ ] テストデータ生成スクリプトの作成
- [ ] CI/CD環境でのテスト自動化設定
- [ ] パフォーマンステストの実施
