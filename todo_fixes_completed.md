# パートナー要員管理システム（PMS）修正ガイド

## 1. システム概要と問題点

パートナー要員管理システム（PMS）は、パートナー企業や案件、契約などを管理するためのWebアプリケーションです。以下の問題が発生していました：

1. 左側メニューが表示されない問題
2. データグリッドのレイアウトが崩れる問題
3. 画面遷移時にコンポーネントが正しく表示されない問題
4. コンソールにDataGridCoreコンポーネントに関連するエラーが表示される問題
5. ボタンのスタイリングが適切に適用されない問題

## 2. 修正内容と手順

### 2.1 インポートパスの修正

**問題**: Layout.tsxとSidebar.tsxのインポートパスに誤りがあり、左側メニューが表示されない

**修正手順**:
1. Layout.tsxとSidebar.tsxファイルを開く
2. 以下のインポートパスを修正する

```typescript
// 誤ったパス
import { useAuthStore } from '../../store/user/authStore';

// 正しいパス
import { useAuthStore } from '../../store/authStore';
```

**確認方法**:
- ブラウザで各画面を開き、左側メニューが表示されることを確認
- コンソールにインポートエラーが表示されていないことを確認

### 2.2 DataGrid.cssの作成とスタイリングの統一

**問題**: データグリッドのスタイリングが統一されておらず、レイアウトが崩れる

**修正手順**:
1. `/home/ubuntu/PMS/frontend/src/components/grids/DataGrid.css`ファイルを作成
2. 以下のCSSコードを追加

```css
.data-grid-core {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
}

.data-grid-core table {
  width: 100%;
  border-collapse: collapse;
}

.data-grid-core th {
  background-color: #f3f4f6;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-grid-core td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.data-grid-core tr:hover {
  background-color: #f9fafb;
}

.data-grid-core tr.clickable {
  cursor: pointer;
}

.data-grid-core .selection-column {
  width: 40px;
  text-align: center;
}

.data-grid-loading, .data-grid-empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.data-grid-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.pagination-info {
  color: #4b5563;
  font-size: 0.875rem;
}
```

3. 各コンポーネントにDataGrid.cssをインポート

```typescript
// 以下のファイルにインポート文を追加
// - DataGrid.tsx
// - ProjectList.tsx
// - ApplicationList.tsx
// - ContractList.tsx
// - PartnerList.tsx
// - EvaluationList.tsx
// - UserManagement.tsx
// - Reports.tsx

import '../components/grids/DataGrid.css';  // または適切な相対パス
```

**確認方法**:
- 各画面のデータグリッドが正しく表示されることを確認
- テーブルのヘッダーとセルが適切に整列していることを確認
- ホバー効果が正しく動作することを確認

### 2.3 DataGridToolbar.cssの作成とボタンスタイリングの修正

**問題**: データグリッドのツールバーボタンにスタイルが適用されない

**修正手順**:
1. `/home/ubuntu/PMS/frontend/src/components/grids/DataGridToolbar.css`ファイルを作成
2. 以下のCSSコードを追加

```css
.data-grid-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.data-grid-toolbar-title h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.data-grid-toolbar-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.data-grid-toolbar-search {
  position: relative;
  width: 250px;
}

.data-grid-toolbar-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.data-grid-toolbar-search input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
}

.data-grid-toolbar-search input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.data-grid-toolbar-filters {
  margin-top: 0.75rem;
  width: 100%;
}

/* ボタンスタイルの修正 */
.data-grid-toolbar .button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* プライマリボタン */
.data-grid-toolbar .button.bg-blue-600 {
  background-color: #2563eb;
  color: white;
}

.data-grid-toolbar .button.bg-blue-600:hover {
  background-color: #1d4ed8;
}

/* サクセスボタン */
.data-grid-toolbar .button.bg-green-600 {
  background-color: #16a34a;
  color: white;
}

.data-grid-toolbar .button.bg-green-600:hover {
  background-color: #15803d;
}

/* ワーニングボタン */
.data-grid-toolbar .button.bg-yellow-500 {
  background-color: #eab308;
  color: white;
}

.data-grid-toolbar .button.bg-yellow-500:hover {
  background-color: #ca8a04;
}

/* ボタンサイズ */
.data-grid-toolbar .button.py-2.px-4 {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
```

3. DataGridToolbar.tsxファイルを修正してCSSをインポート

```typescript
// DataGridToolbar.tsxの先頭に追加
import './DataGridToolbar.css';
```

**確認方法**:
- 各画面のツールバーボタン（編集モード、新規登録など）が適切なスタイルで表示されることを確認
- ボタンのホバー効果が正しく動作することを確認
- ボタンのテキストとアイコンが適切に配置されていることを確認

### 2.4 DataGridコンポーネントのプロパティ修正

**問題**: DataGridコンポーネントのプロパティ名が不一致で、データが正しく表示されない

**修正手順**:
1. 各ページコンポーネント（〇〇List.tsx）のDataGridコンポーネント使用部分を修正

```typescript
// 誤ったプロパティ名
<DataGrid
  title="案件一覧"
  data={displayProjects}
  columns={columnDefs}
  actionButtons={actionButtons}
  onRowClick={handleRowClick}
  loading={isLoading}
  error={error}
  exportOptions={{
    fileName: '案件一覧',
    sheetName: '案件',
  }}
  height={600}
  rowSelection={isEditable ? 'multiple' : 'single'}
  editable={isEditable}
  onCellValueChanged={handleCellValueChanged}
  onRowDeleted={handleRowDeleted}
/>

// 正しいプロパティ名
<DataGrid
  title="案件一覧"
  data={displayProjects}
  columns={columnDefs}
  actionButtons={actionButtons}
  onRowClick={handleRowClick}
  loading={isLoading}
  emptyMessage={error || 'データがありません'}
  pagination={true}
  pageSize={10}
  checkboxSelection={isEditable}
/>
```

**確認方法**:
- 各画面のデータグリッドにデータが正しく表示されることを確認
- ページネーションが正しく動作することを確認
- 編集モード時にチェックボックスが表示されることを確認
- コンソールにプロパティ関連のエラーが表示されていないことを確認

### 2.5 スタイル適用方法の修正

**問題**: インラインスタイルの適用方法が誤っている

**修正手順**:
1. 各ページコンポーネントのスタイル適用部分を修正

```typescript
// 誤った方法
<style jsx global>{...}</style>

// 正しい方法
<style dangerouslySetInnerHTML={{__html: `...`}} />
```

**確認方法**:
- スタイルが正しく適用されていることを確認
- コンソールにスタイル関連のエラーが表示されていないことを確認

## 3. 品質確認チェックリスト

### 3.1 機能確認

- [ ] 左側メニューが全ての画面で表示されるか
- [ ] メニュークリックで正しく画面遷移するか
- [ ] データグリッドが全ての画面で正しく表示されるか
- [ ] ボタンが適切なスタイルで表示されるか
- [ ] ボタンクリックで正しく機能するか
- [ ] 編集モードが正しく動作するか
- [ ] 新規登録機能が正しく動作するか
- [ ] 検索機能が正しく動作するか
- [ ] ページネーションが正しく動作するか

### 3.2 スタイリング確認

- [ ] 全ての画面でレイアウトが崩れていないか
- [ ] ボタンのスタイルが統一されているか
- [ ] テーブルのヘッダーとセルが整列しているか
- [ ] フォントサイズと色が適切か
- [ ] ホバー効果が正しく動作するか
- [ ] レスポンシブデザインが機能するか（ブラウザサイズ変更時）

### 3.3 エラー確認

- [ ] コンソールにエラーが表示されていないか
- [ ] ネットワークリクエストが正しく処理されているか
- [ ] 例外処理が適切に実装されているか
- [ ] エラーメッセージが適切に表示されるか

### 3.4 パフォーマンス確認

- [ ] 画面の初期表示が速いか
- [ ] データ読み込み時にローディング表示があるか
- [ ] 大量データ表示時にパフォーマンス低下がないか
- [ ] メモリリークがないか（長時間使用時）

## 4. 残タスク

1. **画面別の修正**:
   - [ ] 案件管理画面のレイアウト修正
   - [ ] 契約管理画面のレイアウト修正
   - [ ] 評価管理画面のレイアウト修正
   - [ ] 申請管理画面のレイアウト修正
   - [ ] レポート画面のレイアウト修正
   - [ ] ユーザー管理画面のレイアウト修正

2. **コンポーネント改善**:
   - [ ] DataGridCoreコンポーネントとDataGridコンポーネント間のプロパティの整合性確保
   - [ ] Button.tsxコンポーネントのバリアント定義の見直し
   - [ ] フォームコンポーネントのバリデーション強化

3. **エラーハンドリング**:
   - [ ] グローバルエラーハンドリングの実装
   - [ ] ユーザーフレンドリーなエラーメッセージの表示
   - [ ] APIエラー時のフォールバック処理の実装

4. **レスポンシブデザイン**:
   - [ ] モバイル表示の最適化
   - [ ] タブレット表示の最適化
   - [ ] 画面サイズに応じたレイアウト調整

5. **パフォーマンス最適化**:
   - [ ] コンポーネントのメモ化（React.memo, useMemo, useCallback）
   - [ ] 不要な再レンダリングの削減
   - [ ] 大量データ処理時のパフォーマンス改善

## 5. デバッグ手順

### 5.1 コンソールエラーの確認

1. ブラウザの開発者ツールを開く（F12またはCtrl+Shift+I）
2. Consoleタブを選択
3. エラーメッセージ（赤色）や警告（黄色）を確認
4. エラーメッセージをクリックして、エラー発生箇所のコードを確認
5. 関連するコンポーネントやファイルを特定して修正

```javascript
// コンソールエラーの例
// TypeError: Cannot read property 'map' of undefined
// -> データが未定義の状態でmap関数を使用している可能性
// 修正例: data && data.map(...) または data?.map(...)
```

### 5.2 レイアウト崩れの確認

1. ブラウザの開発者ツールを開く
2. Elementsタブを選択
3. 問題のある要素を選択
4. Stylesパネルで適用されているCSSを確認
5. Computedタブで最終的に適用されているスタイルを確認
6. Layoutタブでボックスモデルを確認

```css
/* レイアウト崩れの修正例 */
.container {
  display: flex;
  flex-wrap: wrap; /* 追加: 小さい画面でも折り返すように */
  gap: 1rem; /* 追加: 要素間の間隔を確保 */
}

.item {
  width: 100%; /* 修正: 固定幅から100%に変更 */
  max-width: 300px; /* 追加: 最大幅を設定 */
}
```

### 5.3 コンポーネント間の連携確認

1. React Developer Toolsを使用（Chromeの拡張機能）
2. Componentsタブでコンポーネント階層を確認
3. propsの受け渡しが正しく行われているか確認
4. stateの変更が適切に反映されているか確認
5. 親子コンポーネント間のデータフローを追跡

```typescript
// コンポーネント間の連携修正例
// 親コンポーネント
const Parent = () => {
  const [data, setData] = useState([]);
  
  // 子コンポーネントに必要なpropsを全て渡す
  return <Child data={data} setData={setData} loading={loading} error={error} />;
};

// 子コンポーネント
const Child = ({ data, setData, loading, error }) => {
  // propsの存在確認
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!data || data.length === 0) return <Empty />;
  
  return <DataDisplay data={data} />;
};
```

## 6. 修正適用の手順

1. 修正するファイルのバックアップを作成
2. 一つずつ修正を適用し、その都度動作確認
3. コンソールエラーが解消されたか確認
4. 全ての画面で正しく表示されるか確認
5. 修正内容をコミットする前に、コードレビューを実施
6. 修正後の動作確認結果を文書化

## 7. 参考資料

- React公式ドキュメント: https://reactjs.org/docs/getting-started.html
- TypeScript公式ドキュメント: https://www.typescriptlang.org/docs/
- Material-UI（MUI）ドキュメント: https://mui.com/material-ui/getting-started/
- Tailwind CSS ドキュメント: https://tailwindcss.com/docs
- React Router ドキュメント: https://reactrouter.com/en/main
