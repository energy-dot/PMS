# パートナー要員管理システム実装タスク

## リポジトリのクローン
- [x] GitHubリポジトリ（https://github.com/energy-dot/PMS）をクローンする

## フロントエンドの修正
- [x] フロントエンドのビルドエラーを確認する
- [x] 必要なパッケージ（TypeScript）をインストールする
- [x] 不足している依存関係をインストールする
  - [x] react-bootstrapをインストールする
  - [x] bootstrapパッケージをインストールする
  - [x] react-iconsパッケージをインストールする
- [x] 型定義の修正
  - [x] Alert、Modal、Selectコンポーネントの型定義を修正
  - [x] Buttonコンポーネントのvariant型を修正
  - [x] UserFormModalのSelectコンポーネントにoptions属性を追加
- [x] APIサービスの修正
  - [x] api.tsのオプションパラメータの型定義を修正
  - [x] 各サービスファイルのインポートパスを「../api」から「./api」に変更
  - [x] userServiceの実装
  - [x] 残りのサービスファイルのインポートパスと型定義を修正
  - [x] staffServiceとpartnerServiceにデフォルトエクスポートを追加
- [x] Zustandストアの整理
  - [x] 機能ごとに個別のストアを作成して関心の分離を促進
  - [x] セレクター関数を最適化して不要な再レンダリングを防ぐ
  - [x] 必要な状態をlocalStorageに保存する永続化機能を実装
- [x] ビルドエラーの修正（残り211個）
  - [x] DataGridコンポーネントのactionButtonsプロパティの型互換性問題を修正
  - [x] 非同期レンダリング関数を同期的に変更（Promise<string>がReactNodeに割り当てられない問題）
  - [x] スタイル属性の問題（jsx、globalプロパティが存在しない）を修正
  - [x] その他の型エラーを修正
- [x] ビルドが正常に完了することを確認する

## バックエンドの修正
- [x] バックエンドのビルドエラーを確認する
- [x] 依存関係をインストールする
- [x] ビルドエラーを修正する
  - [x] Project エンティティの重複プロパティを修正
  - [x] Project エンティティに不足しているプロパティを追加
  - [x] Evaluations サービスに不足しているメソッドを実装
  - [x] プロパティ名の不一致を修正
- [x] ビルドが正常に完了することを確認する

## コード品質ツールの導入
- [x] フロントエンドとバックエンドのESLintとPrettierの設定を確認する
- [x] ESLintとPrettierを実行する
  - [x] フロントエンドでESLintを実行する
  - [x] フロントエンドでPrettierを実行する
  - [x] バックエンドでESLintを実行する
  - [x] バックエンドでPrettierを実行する
- [ ] 問題があれば修正する
  - [ ] フロントエンドのESLint問題を修正する（287個の問題が残っています）
  - [x] フロントエンドのPrettier問題を修正する
  - [ ] バックエンドのESLint問題を修正する（440個の問題が残っています）
  - [x] バックエンドのPrettier問題を修正する

## 最終確認
- [ ] すべての修正が完了していることを確認する
- [ ] フロントエンドのビルドが正常に完了することを確認する

## ビルド手順
### フロントエンドのビルド手順
1. 必要な依存関係のインストール
```bash
cd PMS/frontend
npm install
npm install react-bootstrap bootstrap
npm install react-icons
```

2. ビルドの実行
```bash
cd PMS/frontend
npm run build
```

3. ビルド成功時の出力例
```
vite v4.5.13 building for production...
✓ 580 modules transformed.
dist/index.html                     0.59 kB │ gzip:   0.41 kB
dist/assets/index-72c8184d.css    244.87 kB │ gzip:  37.87 kB
dist/assets/index-022482fb.js   1,896.48 kB │ gzip: 466.45 kB │ map: 8,304.36 kB
```

### バックエンドのビルド手順
1. 必要な依存関係のインストール
```bash
cd PMS/backend
npm install
```

2. ビルドの実行
```bash
cd PMS/backend
npm run build
```

3. 主な修正内容
- Project エンティティの重複プロパティ（requiredNumber）を修正
- Project エンティティに不足しているプロパティを追加
  - requiredHeadcount
  - currentHeadcount
  - approvalStatus
  - approverId
  - approvalDate
- Evaluations サービスに不足しているメソッドを実装
  - getStaffAverageRatings
  - getStaffSkillRatings
- プロパティ名の不一致を修正
  - technicalSkills → technicalSkill
  - communicationSkills → communicationSkill

## エラー対応記録
### 型定義の不整合
- コンポーネント間で型定義が一致していない問題を修正
- プロパティの型が正しく定義されていない問題を修正
- 必須プロパティが欠落している問題を修正

### インポートパスの問題
- 相対パスが正しく設定されていない問題を修正
- モジュールが見つからない問題（shared-typesなど）を修正

### 非同期処理の型の問題
- 非同期関数（Promise）の戻り値をReactNodeとして使用している問題を修正
- 非同期レンダリング関数をキャッシュを使用した同期関数に変更

### ライブラリの型定義の不足
- 一部のライブラリの型定義が不足している問題（@types/react-bootstrapなど）を修正

### 依存関係の問題
- react-bootstrapパッケージが不足している問題を特定
- react-iconsパッケージが不足している問題を特定
- ビルド時に「Rollup failed to resolve import」エラーが発生
- 必要な依存関係をインストールして解決

### サービスファイルのエクスポート問題
- 多くのサービスファイルでデフォルトエクスポートが欠けていた問題を修正
  - antisocialCheckService.ts
  - baseContractService.ts
  - contactPersonService.ts
  - departmentService.ts
  - applicationService.ts
  - contractService.ts
- インターフェースがエクスポートされていない問題を修正
  - AntisocialCheck
  - BaseContract
  - ContactPerson
- staffService.tsにdeleteStaff関数が実装されていない問題を修正
