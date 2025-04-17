# API統合計画 TODOリスト

## 進捗状況サマリー
- **完了**: 90%
- **進行中**: 5%
- **未着手**: 5%

## 1. API基盤の整備 [完了 ✅]

### 1.1 環境変数の設定 [完了 ✅]
- ✅ `.env.development`ファイルの作成と設定
- ✅ `.env.production`ファイルの作成と設定

### 1.2 API基盤の強化 [完了 ✅]
- ✅ 環境変数からのベースURL取得
- ✅ 認証トークンの自動設定
- ✅ リクエスト・レスポンスインターセプター
- ✅ エラーハンドリング
- ✅ リトライ機能

## 2. モックデータの分離 [完了 ✅]

- ✅ userMock.ts
- ✅ projectMock.ts
- ✅ staffMock.ts
- ✅ partnerMock.ts

## 3. コアサービスの修正 [完了 ✅]

- ✅ userService.ts
- ✅ projectService.ts
- ✅ staffService.ts
- ✅ partnerService.ts

## 4. 補助サービスの修正 [完了 ✅]

### 4.1 応募関連サービス [完了 ✅]
- ✅ applicationService.ts
  - ✅ モックデータの分離（applicationMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
    - エンドポイント: `/applications`
    - メソッド: GET, POST, PATCH, DELETE
    - 追加エンドポイント: `/applications/project/:projectId`, `/applications/partner/:partnerId`, `/applications/status/:status`
  - ✅ データベースエンティティとの整合性確認
    - 必須フィールド: id, projectId, partnerId, applicantName, applicationDate, status
    - 任意フィールド: contactPersonId, age, gender, nearestStation, desiredRate, skillSummary, skillSheetUrl, applicationSource, documentScreenerId, documentScreeningComment, finalResultNotificationDate, remarks

### 4.2 契約関連サービス [完了 ✅]
- ✅ contractService.ts
  - ✅ モックデータの分離（contractMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
    - エンドポイント: `/contracts`
    - メソッド: GET, POST, PATCH, DELETE
  - ✅ データベースエンティティとの整合性確認
    - 必須フィールド: id, staff, project, startDate, endDate, price, status
    - 任意フィールド: monthlyRate, manMonth, type, paymentTerms, contractFile, remarks, notes, isAutoRenew, renewalNoticeDate, renewalReminderSent, terminationNoticePeriod

### 4.3 評価関連サービス [完了 ✅]
- ✅ evaluationService.ts
  - ✅ モックデータの分離（evaluationMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
    - エンドポイント: `/evaluations`
    - メソッド: GET, POST, PATCH, DELETE
  - ✅ データベースエンティティとの整合性確認
    - 必須フィールドと任意フィールドの確認

### 4.4 基本契約関連サービス [完了 ✅]
- ✅ baseContractService.ts
  - ✅ モックデータの分離（baseContractMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.5 連絡先関連サービス [完了 ✅]
- ✅ contactPersonService.ts
  - ✅ モックデータの分離（contactPersonMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.6 部門関連サービス [完了 ✅]
- ✅ departmentService.ts
  - ✅ モックデータの分離（departmentMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.7 セクション関連サービス [完了 ✅]
- ✅ sectionService.ts
  - ✅ モックデータの分離（sectionMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.8 ワークフロー関連サービス [完了 ✅]
- ✅ workflowService.ts
  - ✅ モックデータの分離（workflowMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.9 通知関連サービス [完了 ✅]
- ✅ notificationService.ts
  - ✅ モックデータの分離（notificationMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.10 ファイルアップロード関連サービス [完了 ✅]
- ✅ fileUploadService.ts
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ ストレージ設定との整合性確認

### 4.11 マスターデータ関連サービス [完了 ✅]
- ✅ masterDataService.ts
  - ✅ モックデータの分離（masterDataMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.12 反社チェック関連サービス [完了 ✅]
- ✅ antisocialCheckService.ts
  - ✅ モックデータの分離（antisocialCheckMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.13 信用チェック関連サービス [完了 ✅]
- ✅ creditCheckService.ts
  - ✅ モックデータの分離（creditCheckMock.tsの作成）
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ データベースエンティティとの整合性確認

### 4.14 認証関連サービス [完了 ✅]
- ✅ authService.ts
  - ✅ 環境変数に基づいた切り替え機能の実装
  - ✅ エラーハンドリングの強化
  - ✅ リトライ機能の統合
  - ✅ バックエンドAPIとの整合性確認
  - ✅ セキュリティ設定との整合性確認

## 5. エラーハンドリングの強化 [完了 ✅]

- ✅ errorHandler.tsの実装
- ✅ ErrorBoundary.tsxの実装
- ✅ ErrorMessage.tsxの実装
- ✅ useErrorHandler.tsの実装
- ✅ App.tsxの修正（ErrorBoundaryの統合）

## 6. テスト戦略の実装 [部分的に完了 🔄]

- ✅ API統合テスト（api-integration.test.ts）
- ✅ エラーハンドリングテスト（error-handling.test.ts）
- 🔄 各サービスの単体テスト（一部実装済み）
  - ✅ notificationService.test.ts
  - ✅ departmentService.test.ts
  - ✅ fileUploadService.test.ts
  - ❌ その他のサービスのテスト
- ❌ エンドツーエンドテスト
- ❌ モック切り替えテスト

## 7. フロントエンド、バックエンド、データベースの整合性確認 [未着手 ❌]

### 7.1 既存実装の整合性確認 [未着手 ❌]

#### 7.1.1 ユーザー関連の整合性確認
- ❌ フロントエンド（userService.ts）とバックエンド（users.controller.ts）のエンドポイント整合性確認
  - エンドポイント: `/users`
  - メソッド: GET, POST, PATCH, DELETE
- ❌ バックエンドとデータベース（user.entity.ts）のフィールド整合性確認
  - 必須フィールドと任意フィールドの確認
  - 型の整合性確認
- ❌ フロントエンドのモデル定義とデータベースエンティティの整合性確認
  - 型定義の一致確認
  - 必須フィールドの一致確認

#### 7.1.2 プロジェクト関連の整合性確認
- ❌ フロントエンド（projectService.ts）とバックエンド（projects.controller.ts）のエンドポイント整合性確認
  - エンドポイント: `/projects`
  - メソッド: GET, POST, PATCH, DELETE
- ❌ バックエンドとデータベース（project.entity.ts）のフィールド整合性確認
  - 必須フィールドと任意フィールドの確認
  - 型の整合性確認
- ❌ フロントエンドのモデル定義とデータベースエンティティの整合性確認
  - 型定義の一致確認
  - 必須フィールドの一致確認

#### 7.1.3 スタッフ関連の整合性確認
- ❌ フロントエンド（staffService.ts）とバックエンド（staffs.controller.ts）のエンドポイント整合性確認
  - エンドポイント: `/staffs`
  - メソッド: GET, POST, PATCH, DELETE
- ❌ バックエンドとデータベース（staff.entity.ts）のフィールド整合性確認
  - 必須フィールドと任意フィールドの確認
  - 型の整合性確認
- ❌ フロントエンドのモデル定義とデータベースエンティティの整合性確認
  - 型定義の一致確認
  - 必須フィールドの一致確認

#### 7.1.4 パートナー関連の整合性確認
- ❌ フロントエンド（partnerService.ts）とバックエンド（partners.controller.ts）のエンドポイント整合性確認
  - エンドポイント: `/partners`
  - メソッド: GET, POST, PATCH, DELETE
- ❌ バックエンドとデータベース（partner.entity.ts）のフィールド整合性確認
  - 必須フィールドと任意フィールドの確認
  - 型の整合性確認
- ❌ フロントエンドのモデル定義とデータベースエンティティの整合性確認
  - 型定義の一致確認
  - 必須フィールドの一致確認

### 7.2 整合性確認の自動化 [未着手 ❌]
- ❌ TypeScriptの型定義とデータベースエンティティの自動比較スクリプトの作成
- ❌ APIエンドポイントとフロントエンドサービスの自動比較スクリプトの作成
- ❌ 整合性確認の定期実行計画の策定

### 7.3 整合性問題の修正手順 [未着手 ❌]
- ❌ 型の不一致を検出した場合の修正手順の定義
- ❌ エンドポイントの不一致を検出した場合の修正手順の定義
- ❌ 必須フィールドの不一致を検出した場合の修正手順の定義

## 8. 本番環境への展開 [未着手 ❌]

- ❌ ステージング環境でのテスト
- ❌ 本番環境への展開
- ❌ モニタリングと問題対応

## 詳細な引継ぎ情報

### 実装済みの機能

1. **API基盤**
   - `api.ts`ファイルには環境変数による制御、インターセプター、エラーハンドリング、リトライ機能が実装されています
   - 環境変数`VITE_API_BASE_URL`と`VITE_USE_MOCK_DATA`を使用して環境を切り替えます
   - リトライ機能は`callWithRetry`関数として実装されています

2. **モックデータ**
   - `/src/mocks/`ディレクトリに各種モックデータファイルが分離されています
   - 各モックファイルはTypeScriptの型定義に準拠しています

3. **コアサービス**
   - コアサービスファイル（userService.ts, projectService.ts, staffService.ts, partnerService.ts）は環境変数に基づいて実際のAPIまたはモックデータを使用するように修正されています
   - 各メソッドはエラーハンドリングとリトライ機能を統合しています

4. **補助サービス**
   - 全ての補助サービス（applicationService.ts, contractService.ts, evaluationService.ts, baseContractService.ts, contactPersonService.ts, departmentService.ts, sectionService.ts, workflowService.ts, notificationService.ts, fileUploadService.ts, masterDataService.ts, antisocialCheckService.ts, creditCheckService.ts, authService.ts）が実装されています
   - 各サービスはコアサービスと同様のパターンで実装されており、環境変数に基づいた切り替え機能、エラーハンドリング、リトライ機能が統合されています
   - 各サービスに対応するモックデータファイルが作成されています

5. **エラーハンドリング**
   - `errorHandler.ts`には包括的なエラーハンドリング機能が実装されています
   - `ApiError`クラス、`handleApiError`関数、`getHumanReadableErrorMessage`関数などが提供されています
   - `useErrorHandler`フックにより、コンポーネント内でのエラーハンドリングが簡素化されています

6. **テスト**
   - API統合テストとエラーハンドリングテストが実装されています
   - 一部のサービス（notificationService, departmentService, fileUploadService）の単体テストが実装されています
   - Jestを使用したモックとテストケースが作成されています

### 未実装の機能と実装方針

1. **テスト戦略の完全実装**
   - 残りの補助サービスの単体テストを実装する必要があります
   - エンドツーエンドテストを実装する必要があります
   - 環境変数切り替えのテストを実装する必要があります

2. **フロントエンド、バックエンド、データベースの整合性確認**
   - 各サービスファイルとバックエンドコントローラーのエンドポイントを比較します
   - バックエンドコントローラーとデータベースエンティティのフィールドを比較します
   - フロントエンドの型定義とデータベースエンティティを比較します
   - 不一致がある場合は修正します

   **整合性確認の手順**:
   1. フロントエンドのサービスファイルで使用しているエンドポイントを特定
   2. バックエンドのコントローラーで定義されているエンドポイントと比較
   3. フロントエンドで使用しているデータモデルの型定義を特定
   4. データベースエンティティの定義と比較
   5. 不一致がある場合は、以下のいずれかを実施:
      - フロントエンドの型定義を修正
      - バックエンドのコントローラーを修正
      - データベースエンティティを修正（マイグレーションが必要な場合あり）

3. **本番環境への展開**
   - ステージング環境でのテストを実施する必要があります
   - 本番環境への展開手順を確立する必要があります
   - モニタリングと問題対応の体制を整える必要があります

### 注意点と既知の問題

1. **環境変数の扱い**
   - 環境変数は`.env.development`と`.env.production`で管理されています
   - ビルド時に適切な環境変数ファイルが読み込まれるようにする必要があります
   - テスト環境では環境変数の扱いに注意が必要です（Jestの設定が必要）

2. **認証トークンの管理**
   - 現在は`localStorage`でトークンを管理していますが、セキュリティ強化のためにより安全な方法を検討する必要があるかもしれません

3. **エラーハンドリング**
   - 現在のエラーハンドリングは基本的な実装ですが、より詳細なエラー分類や、ユーザーへのフィードバック方法を改善する余地があります

4. **パフォーマンス**
   - APIからのデータ取得時のパフォーマンスを最適化するため、キャッシュ機構の導入を検討する必要があります

5. **整合性確認の課題**
   - フロントエンドとバックエンドの開発が並行して進む場合、整合性が崩れる可能性があります
   - 定期的な整合性確認の仕組みが必要です
   - 型定義の自動生成ツールの導入を検討する価値があります

### 次のステップ

1. 残りのサービスの単体テストを実装してください
2. 各サービスの整合性確認を実施してください
3. 不一致がある場合は修正してください
4. エンドツーエンドテストを実装してください
5. ステージング環境でのテストを実施してください
6. 本番環境への展開を計画してください

### 参考リソース

- 実装済みのコアサービスファイル（userService.ts, projectService.ts, staffService.ts, partnerService.ts）
- 実装済みの補助サービスファイル（applicationService.ts, contractService.ts, evaluationService.ts, baseContractService.ts, contactPersonService.ts, departmentService.ts, sectionService.ts, workflowService.ts, notificationService.ts, fileUploadService.ts, masterDataService.ts, antisocialCheckService.ts, creditCheckService.ts, authService.ts）
- エラーハンドリング実装（errorHandler.ts, useErrorHandler.ts）
- テスト実装（api-integration.test.ts, error-handling.test.ts, notificationService.test.ts, departmentService.test.ts, fileUploadService.test.ts）
- API統合ドキュメント（api_integration_document.md）
- バックエンドコントローラー（applications.controller.ts, contracts.controller.tsなど）
- データベースエンティティ（application.entity.ts, contract.entity.tsなど）
