# パートナー要員管理システム - システムアーキテクチャ設計

## 1. 全体アーキテクチャ

パートナー要員管理システムは、以下の3層アーキテクチャで構成されます：

1. **フロントエンド層**：React + TypeScriptを使用したSPA（Single Page Application）
2. **バックエンド層**：NestJS（Node.js）を使用したRESTful APIサーバー
3. **データベース層**：PostgreSQLを使用したリレーショナルデータベース

![アーキテクチャ概要](./architecture_overview.png)

### 1.1 技術スタック

| 層 | 技術 | 主な役割 |
|---|---|---|
| フロントエンド | React 18.x | UIコンポーネントライブラリ |
| | TypeScript 5.x | 型安全な開発言語 |
| | ag-Grid Community/React | データグリッド表示 |
| | Zustand | 状態管理 |
| | React Hook Form + Zod | フォーム管理とバリデーション |
| | React Router | ルーティング |
| | Axios | HTTP通信 |
| バックエンド | NestJS 10.x | バックエンドフレームワーク |
| | TypeScript 5.x | 型安全な開発言語 |
| | TypeORM | ORMツール |
| | Passport | 認証ライブラリ |
| | class-validator | バリデーション |
| | JWT | トークンベース認証 |
| データベース | PostgreSQL 15.x | リレーショナルデータベース |

## 2. 型定義の共有方法

フロントエンドとバックエンド間で一貫した型定義を維持するために、以下のアプローチを採用します：

### 2.1 共有型定義パッケージ

プロジェクト内に`shared-types`というパッケージを作成し、フロントエンドとバックエンドの両方から参照できるようにします。

```
/project-root
  /shared-types
    /src
      /dto
      /entities
      /enums
      index.ts
    package.json
    tsconfig.json
  /frontend
  /backend
```

### 2.2 型定義の自動生成

バックエンドのエンティティとDTOから、フロントエンドで使用する型定義を自動生成する仕組みを導入します。

1. バックエンドのエンティティとDTOを定義
2. スクリプトを実行して型定義ファイルを生成
3. 生成された型定義を`shared-types`パッケージに配置
4. フロントエンドからインポートして使用

## 3. データフロー

システム内のデータフローは以下のように設計します：

### 3.1 基本的なデータフロー

1. **ユーザー操作** → フロントエンドのUIコンポーネント
2. **UIコンポーネント** → Zustandストア（状態更新）
3. **Zustandストア** → APIサービス（HTTP通信）
4. **APIサービス** → バックエンドのコントローラー
5. **コントローラー** → サービス層（ビジネスロジック）
6. **サービス層** → リポジトリ層（データアクセス）
7. **リポジトリ層** → データベース
8. **データベース** → リポジトリ層（結果取得）
9. **リポジトリ層** → サービス層 → コントローラー → フロントエンド（レスポンス）
10. **フロントエンド** → Zustandストア（状態更新）→ UIコンポーネント（表示更新）

### 3.2 認証フロー

1. ユーザーがログイン情報を入力
2. フロントエンドが認証APIを呼び出し
3. バックエンドが認証を検証し、JWTトークンを発行
4. フロントエンドがトークンを保存（localStorage）
5. 以降のAPIリクエストにトークンを含める
6. バックエンドがトークンを検証し、ユーザー情報とロールを取得
7. ロールに基づいてアクセス制御を実施

### 3.3 通知フロー

1. バックエンドでイベント発生（申請承認など）
2. 通知サービスがイベントを処理し、通知レコードを作成
3. WebSocketを通じてリアルタイム通知をフロントエンドに送信
4. フロントエンドが通知を受信し、UIに表示

## 4. コンポーネント設計

### 4.1 フロントエンドコンポーネント構成

```
/frontend
  /src
    /assets        # 静的ファイル（画像など）
    /components    # 再利用可能なUIコンポーネント
      /common      # 汎用コンポーネント
      /layout      # レイアウト関連コンポーネント
      /forms       # フォーム関連コンポーネント
      /grids       # ag-Grid関連コンポーネント
      /modals      # モーダルダイアログ
    /hooks         # カスタムReactフック
    /pages         # 画面コンポーネント
    /services      # APIサービス
    /store         # Zustandストア
    /types         # 型定義（shared-typesからインポート）
    /utils         # ユーティリティ関数
    /constants     # 定数定義
    App.tsx        # ルートコンポーネント
    index.tsx      # エントリーポイント
```

### 4.2 バックエンドモジュール構成

```
/backend
  /src
    /auth          # 認証関連
    /common        # 共通機能（フィルター、インターセプターなど）
    /config        # 設定
    /dto           # データ転送オブジェクト
    /entities      # データベースエンティティ
    /enums         # 列挙型
    /interfaces    # インターフェース定義
    /modules       # 機能モジュール
      /partner     # パートナー会社関連
      /project     # 案件関連
      /staff       # 要員関連
      /contract    # 契約関連
      /workflow    # ワークフロー関連
      /master      # マスターデータ関連
      /report      # レポート関連
      /notification # 通知関連
    /utils         # ユーティリティ関数
    app.module.ts  # ルートモジュール
    main.ts        # エントリーポイント
```

## 5. API設計

### 5.1 API命名規則

RESTful APIの原則に従い、以下の命名規則を採用します：

- リソース名は複数形で表現（例：`/partners`, `/projects`）
- HTTPメソッドでアクションを表現（GET, POST, PUT, DELETE）
- ネストしたリソースはパスで表現（例：`/partners/{id}/contacts`）

### 5.2 主要APIエンドポイント

#### 認証API

- `POST /auth/login` - ログイン
- `POST /auth/logout` - ログアウト
- `GET /auth/me` - 現在のユーザー情報取得

#### パートナー会社API

- `GET /partners` - パートナー会社一覧取得
- `GET /partners/{id}` - パートナー会社詳細取得
- `POST /partners` - パートナー会社登録
- `PUT /partners/{id}` - パートナー会社更新
- `DELETE /partners/{id}` - パートナー会社削除（論理削除）
- `GET /partners/{id}/contacts` - パートナー会社の営業窓口一覧
- `GET /partners/{id}/checks` - パートナー会社の信用調査/反社チェック一覧
- `GET /partners/{id}/contracts` - パートナー会社の基本契約一覧

#### 案件API

- `GET /projects` - 案件一覧取得
- `GET /projects/{id}` - 案件詳細取得
- `POST /projects` - 案件登録
- `PUT /projects/{id}` - 案件更新
- `POST /projects/{id}/approve` - 案件承認
- `POST /projects/{id}/reject` - 案件差し戻し
- `POST /projects/{id}/send` - 案件募集送信
- `GET /projects/{id}/applications` - 案件への応募一覧

#### 要員API

- `GET /staff` - 要員一覧取得
- `GET /staff/{id}` - 要員詳細取得
- `POST /staff` - 要員登録
- `PUT /staff/{id}` - 要員更新
- `GET /staff/{id}/contracts` - 要員の個別契約一覧
- `GET /staff/{id}/evaluations` - 要員の評価一覧

#### ワークフローAPI

- `GET /requests` - 依頼一覧取得
- `GET /requests/{id}` - 依頼詳細取得
- `POST /requests` - 依頼登録
- `POST /requests/{id}/approve` - 依頼承認
- `POST /requests/{id}/reject` - 依頼差し戻し

### 5.3 レスポンス形式

すべてのAPIレスポンスは以下の標準フォーマットに従います：

```typescript
interface ApiResponse<T> {
  success: boolean;        // 処理成功フラグ
  data?: T;                // 成功時のデータ
  error?: {
    code: string;          // エラーコード
    message: string;       // エラーメッセージ
    details?: any;         // 詳細情報（バリデーションエラーなど）
  };
  meta?: {
    pagination?: {
      page: number;        // 現在のページ
      limit: number;       // 1ページあたりの件数
      totalItems: number;  // 総件数
      totalPages: number;  // 総ページ数
    };
  };
}
```

## 6. セキュリティ設計

### 6.1 認証・認可

- JWT（JSON Web Token）を使用したトークンベース認証
- ロールベースアクセス制御（RBAC）による権限管理
- パスワードはbcryptでハッシュ化して保存
- トークンの有効期限設定（アクセストークン：1時間、リフレッシュトークン：2週間）

### 6.2 データ保護

- HTTPS通信の強制（SSL/TLS）
- センシティブデータの暗号化（個人情報など）
- CSRFトークンによるクロスサイトリクエストフォージェリ対策
- Content Security Policy（CSP）の適用

### 6.3 入力検証

- フロントエンドでのZodによるバリデーション
- バックエンドでのclass-validatorによるバリデーション
- SQLインジェクション対策（TypeORMのパラメータバインディング）
- XSS対策（エスケープ処理、DOMPurify）

## 7. エラーハンドリング

### 7.1 フロントエンドのエラーハンドリング

- Axiosインターセプターによるグローバルエラーハンドリング
- エラー種別に応じた適切なUIフィードバック
- オフライン状態の検出と再接続機能

### 7.2 バックエンドのエラーハンドリング

- グローバル例外フィルターによる一貫したエラーレスポンス
- ドメイン固有の例外クラス定義
- 構造化されたログ出力（Winston）

## 8. パフォーマンス最適化

### 8.1 フロントエンド最適化

- コンポーネントのメモ化（React.memo, useMemo, useCallback）
- 遅延ロード（React.lazy, Suspense）
- ag-Gridの仮想スクロール活用
- 画像の最適化（WebP形式、適切なサイズ）

### 8.2 バックエンド最適化

- データベースインデックスの適切な設計
- クエリの最適化（N+1問題の回避）
- キャッシュの活用（Redis）
- 非同期処理の活用（バックグラウンドジョブ）

## 9. スケーラビリティ

- 水平スケーリング可能なアーキテクチャ
- ステートレスなバックエンド設計
- マイクロサービスへの移行を考慮した設計
- コンテナ化（Docker）とオーケストレーション（Kubernetes）の準備

## 10. 監視とロギング

- 構造化ログ（JSON形式）
- エラー監視（Sentry）
- パフォーマンスモニタリング（New Relic）
- ユーザー行動分析（Google Analytics）

## 11. 開発・デプロイメントフロー

- GitHubフローによるバージョン管理
- CI/CD（GitHub Actions）
- 環境分離（開発、テスト、本番）
- インフラストラクチャのコード化（Terraform）
