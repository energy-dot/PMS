# PMSフロントエンド修正タスク

## 問題点の分析

### 1. コンポーネント構造の問題
- [x] Layout.tsxとSidebar.tsxの両方にメニュー項目の定義がある
- [x] 両方のコンポーネントが同時に使用されている可能性がある
- [x] これが「英語 日本語」表示問題の原因と考えられる
- [x] 責任の不明確さ: レイアウト構造とナビゲーション機能の責任分担が不明確

### 2. ルーティングパスの不一致
- [x] Layout.tsx: `/staffs`
- [x] App.tsx: `/staff`
- [x] Sidebar.tsx: `/staff`
- [x] 他のパスにも不一致がある可能性（`/applications`など）
- [x] 404エラー: 不一致によりメニュークリック時に404エラーが発生

### 3. スタイリングとUI問題
- [x] Sidebarでは「material-icons」クラスを使用
- [x] Layoutでは「i」タグを使用
- [x] Layout.cssがインポートされているが、ファイルが存在するか不明
- [x] Tailwind CSSが正しく適用されていない可能性
- [x] サイドバーが表示されない問題が発生

## モジュール間の依存関係

### 1. コンポーネント構造の問題
- **重複するメニュー定義**: Layout.tsxとSidebar.tsxの両方にメニュー項目の定義が存在
- **責任の不明確さ**: レイアウト構造とナビゲーション機能の責任分担が不明確
- **「英語 日本語」表示問題**: 重複するメニュー定義により、一部が英語、一部が日本語で表示される

### 2. ルーティングの不一致
- **パス定義の不一致**: `/staff`と`/staffs`のように同じ機能に対して複数のパスが存在
- **コンポーネント間の不整合**: Sidebar.tsxでは`/staff`、Layout.tsxでは`/staffs`と定義
- **404エラー**: 不一致によりメニュークリック時に404エラーが発生

### 3. スタイリングとUI問題
- **CSSの適用不足**: 全体的にCSSが適切に適用されていない
- **Material Iconsの不整合**: 異なる方法でアイコンを使用（`material-icons`クラスvs`i`タグ）
- **サイドバー表示の問題**: サイドバーが正しく表示されない

## モジュール間の依存関係

### コアコンポーネント
1. **App.tsx**
   - 依存: Layout, ProtectedRoute, 各ページコンポーネント
   - 役割: ルーティング定義、アプリケーション構造の提供

2. **Layout.tsx**
   - 依存: Sidebar, NotificationBell, useAuthStore
   - 役割: 全体レイアウト構造の提供、認証状態の管理

3. **Sidebar.tsx**
   - 依存: useAuthStore, NotificationBell
   - 役割: ナビゲーションメニューの表示、ユーザー情報表示

4. **ProtectedRoute.tsx**
   - 依存: useAuthStore
   - 役割: 認証とアクセス制御

### サービス層
1. **authService.ts**
   - 依存: api
   - 役割: 認証関連API呼び出し

2. **notificationService.ts**
   - 依存: api
   - 役割: 通知関連API呼び出し

3. **その他サービス**
   - userService, projectService, staffService等
   - 役割: 各機能のAPI呼び出し

### 状態管理
1. **authStore.ts**
   - 依存: authService, storageUtils
   - 役割: 認証状態の管理

## 修正計画と進捗状況

### 1. 単一責任の原則に基づく修正
- [x] **メニュー定義の集約**: `constants/menuItems.ts`に全メニュー項目を定義
- [x] **Sidebar.tsxの修正**: 集約されたメニュー定義を使用するよう変更
  - 作業予定: 2025/04/16
  - 詳細: menuItems.tsからメニュー項目を取得し、重複コードを削除
  - 完了: Sidebar.tsxを修正し、constants/menuItems.tsからメニュー項目を取得するように変更
- [x] **Layout.tsxの修正**: レイアウト構造のみを担当するよう変更
  - 作業予定: 2025/04/16
  - 詳細: メニュー定義を削除し、Sidebarコンポーネントを適切に配置
  - 完了: Layout.tsxからメニュー定義を削除し、Sidebarコンポーネントを使用するように変更

### 2. ルーティングの統一
- [x] **App.tsxの修正**: 冗長なルート定義を削除（`/staffs`など）
  - 作業予定: 2025/04/16
  - 詳細: 標準パスのみを残し、重複パスを削除（例: `/staff`を標準とし、`/staffs`を削除）
  - 完了: 冗長な`/staffs`ルートと`/applications`ルートを削除
- [x] **パス参照の統一**: すべてのコンポーネントで統一されたパスを使用
  - 作業予定: 2025/04/16
  - 詳細: menuItems.tsの定義に合わせてすべてのコンポーネントのパス参照を更新
  - 完了: menuItems.tsの定義に合わせてApp.tsxのルートを統一

### 3. スタイリングの改善
- [x] **Layout.cssファイルの作成**: 必要なスタイルを定義
- [x] **Material Iconsの追加**: index.htmlにMaterial Iconsのリンクを追加
- [x] **Material Iconsの統一**: すべてのコンポーネントで一貫した使用方法に統一
  - 作業予定: 2025/04/16
  - 詳細: `material-icons`クラスを使用する方法に統一
  - 完了: コードを確認し、すべてのコンポーネントで`material-icons`クラスが一貫して使用されていることを確認
- [x] **CSSの適用確認**: すべての必要なCSSが正しく適用されているか確認
  - 作業予定: 2025/04/16
  - 詳細: Layout.css、index.cssの適用状況を確認し、必要に応じて修正
  - 完了: Layout.cssとindex.cssの内容を確認し、必要なスタイルが適切に定義され適用されていることを確認

### 4. テストと検証
- [x] **各メニュー項目のテスト**: すべてのメニュー項目が正しく動作するか確認
  - 作業予定: 2025/04/16
  - 詳細: 各メニュー項目をクリックし、正しいページに遷移するか確認
  - 完了: 開発サーバーを起動し、メニュー項目の表示と遷移を確認
- [x] **ダッシュボード**
- [x] **パートナー管理**
- [x] **スタッフ管理**
- [x] **プロジェクト管理**
- [x] **申請管理**
- [x] **契約管理**
- [x] **評価管理**
- [x] **レポート**
- [x] **ユーザー管理**

## 実装方針

### 1. アーキテクチャの改善
- **コンポーネント分離**: 各コンポーネントの責任を明確に分離
  - Layout: 全体レイアウト構造のみを担当
  - Sidebar: ナビゲーションメニューの表示のみを担当
  - 共通定義: constants/menuItems.tsで一元管理

### 2. 段階的アプローチ
- **優先順位**:
  1. メニュー定義の集約と構造改善（現在の作業）
  2. ルーティングの統一
  3. UIとスタイリングの改善
  4. 機能テストと検証
