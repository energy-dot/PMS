# API統合の実装ドキュメント

## 概要
このドキュメントでは、パートナー要員管理システム（PMS）のフロントエンドとバックエンドAPIの統合実装について説明します。モックデータから本番環境APIへの移行方法と、環境変数による切り替え機能の実装について詳細を記載しています。

## 1. API基盤の整備

### 1.1 API基本設定
`api.ts`ファイルでは、以下の機能を実装しています：
- 環境変数からのベースURL取得
- 認証トークンの自動設定
- リクエスト・レスポンスインターセプター
- エラーハンドリング
- リトライ機能

```typescript
// 環境変数の設定
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
```

### 1.2 環境変数設定
開発環境と本番環境で異なる設定を使用するため、以下の環境変数ファイルを設定しています：

#### 開発環境 (.env.development)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=true
```

#### 本番環境 (.env.production)
```
VITE_API_BASE_URL=https://api.example.com
VITE_USE_MOCK_DATA=false
```

## 2. モックデータの分離

各サービスに埋め込まれていたモックデータを専用のファイルに分離しました：

- `/src/mocks/userMock.ts` - ユーザー情報のモックデータ
- `/src/mocks/projectMock.ts` - プロジェクト情報のモックデータ
- `/src/mocks/staffMock.ts` - スタッフ情報のモックデータ
- `/src/mocks/partnerMock.ts` - パートナー企業情報のモックデータ

これにより、モックデータの管理が容易になり、実際のAPIとの切り替えがスムーズになりました。

## 3. サービスファイルの修正

各サービスファイルを修正し、環境変数に基づいて実際のAPIエンドポイントまたはモックデータを使用するように変更しました：

### 3.1 基本パターン
```typescript
export const getItems = async (): Promise<Item[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockItems;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/items'));
  } catch (error) {
    logError(error, 'getItems');
    throw handleApiError(error, 'アイテム情報の取得に失敗しました');
  }
};
```

### 3.2 修正したサービスファイル
- `userService.ts` - ユーザー関連のAPI
- `projectService.ts` - プロジェクト関連のAPI
- `staffService.ts` - スタッフ関連のAPI
- `partnerService.ts` - パートナー企業関連のAPI

各サービスファイルでは、以下の機能を実装しています：
- 環境変数による切り替え機能
- エラーハンドリングの強化
- リトライ機能の統合
- 一貫したエラーメッセージの提供

## 4. エラーハンドリング機能の強化

### 4.1 エラーハンドリングユーティリティ
`errorHandler.ts`ファイルでは、以下の機能を実装しています：
- ApiErrorクラス
- handleApiError関数
- getHumanReadableErrorMessage関数
- logError関数
- retryOperation関数

### 4.2 エラーハンドリングコンポーネント
- `ErrorBoundary.tsx` - 予期しないエラーをキャッチするReactエラー境界
- `ErrorMessage.tsx` - ユーザーフレンドリーなエラー表示コンポーネント

### 4.3 エラーハンドリングフック
`useErrorHandler.ts`フックでは、以下の機能を提供しています：
- 非同期処理のエラーハンドリング簡素化
- ローディング状態の管理
- エラーメッセージの表示と管理

## 5. テストと検証

API統合の実装をテストするために、以下のテストファイルを作成しました：

### 5.1 API統合テスト
`api-integration.test.ts`ファイルでは、以下をテストしています：
- 各サービスの本番環境モードでのAPI呼び出し
- 検索機能の動作確認
- エラーハンドリングの検証
- リトライ機能のテスト

### 5.2 エラーハンドリングテスト
`error-handling.test.ts`ファイルでは、以下をテストしています：
- ApiErrorクラスの動作確認
- handleApiError関数の検証
- getHumanReadableErrorMessage関数の検証
- retryOperation関数のテスト
- useErrorHandlerフックの動作確認

## 6. 今後の課題

1. **APIエンドポイントの完全実装**
   - 現在は基本的なCRUD操作のみ実装されています
   - より複雑な業務ロジックに対応するエンドポイントの追加が必要

2. **認証・認可の強化**
   - JWTトークンの有効期限管理
   - リフレッシュトークンの実装
   - ロールベースのアクセス制御の強化

3. **パフォーマンス最適化**
   - データキャッシュの実装
   - ページネーションの最適化
   - 大量データ処理の効率化

4. **オフライン対応**
   - オフラインモードの実装
   - データの同期機能の追加

## 7. まとめ

本実装により、開発環境ではモックデータを使用し、本番環境では実際のAPIを使用する柔軟な構成が実現されました。環境変数による切り替え機能により、開発からテスト、本番環境への移行がスムーズに行えるようになりました。また、エラーハンドリング機能の強化により、ユーザー体験の向上とデバッグの容易化が図られています。
