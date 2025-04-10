# パートナー要員管理システム 実装報告書

## 1. 実施内容

パートナー要員管理システム（PMS）の実装において、以下の問題を特定し修正しました。

### 1.1 バックエンド（NestJS）の問題と修正

#### 問題点
- NestJSのCLIツールがインストールされていないため、`npm run start:dev`コマンドが失敗
- データベース接続設定の不一致（SQLiteとPostgreSQLの混在）
- ポート競合の問題（ポート3000が既に使用中）

#### 修正内容
1. NestJSのCLIツールをインストール
   ```bash
   npm install -D @nestjs/cli
   ```

2. データベース接続設定の修正
   - app.module.tsにSQLiteデータベースを使用するための条件分岐を追加
   ```typescript
   process.env.NODE_ENV === 'test'
     ? TypeOrmModule.forRoot({
         type: 'sqlite',
         database: ':memory:',
         entities: [Partner, Project, Staff, Contract, User, AntisocialCheck, BaseContract, ContactPerson],
         synchronize: true,
         dropSchema: true,
         autoLoadEntities: true,
       })
     : process.env.DB_TYPE === 'sqlite'
     ? TypeOrmModule.forRoot({
         type: 'sqlite',
         database: join(__dirname, '..', 'database.sqlite'),
         entities: [Partner, Project, Staff, Contract, User, AntisocialCheck, BaseContract, ContactPerson],
         synchronize: true,
       })
     : TypeOrmModule.forRoot({
         type: 'postgres',
         host: process.env.DB_HOST || 'localhost',
         port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
         username: process.env.DB_USERNAME || 'postgres',
         password: process.env.DB_PASSWORD || 'postgres',
         database: process.env.DB_DATABASE || 'pms',
         entities: [Partner, Project, Staff, Contract, User, AntisocialCheck, BaseContract, ContactPerson],
         synchronize: process.env.NODE_ENV !== 'production',
       }),
   ```

3. 環境変数の設定（.envファイル作成）
   ```
   NODE_ENV=development
   DB_TYPE=sqlite
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=pms
   ```

4. ポート設定の修正
   - main.tsのポート番号を3000から3001に変更
   ```typescript
   await app.listen(3001);
   ```

### 1.2 フロントエンド（Vite/React）の問題と修正

#### 問題点
- ポート設定の不一致（システム運用ガイドではポート3002と記載されているが、実際の設定は3000）
- 公開ドメインへのアクセス時にホスト名が許可されていないエラー

#### 修正内容
1. ポート設定の修正
   - vite.config.tsのポート番号を3000から3002（後に3003）に変更
   ```typescript
   server: {
     port: 3003,
     host: '0.0.0.0',
     allowedHosts: ['3003-i2zg0ncchlsc6yuqj4osz-853b7697.manus.computer'],
   },
   ```

2. 公開ドメインの許可設定
   - allowedHostsに公開ドメインを追加

## 2. 動作確認結果

### 2.1 バックエンド
- NestJSアプリケーションが正常に起動
- ポート3001で動作確認
- データベース接続（SQLite）が正常に機能

### 2.2 フロントエンド
- Viteサーバーが正常に起動
- ポート3003で動作確認

## 3. 今後の課題

1. フロントエンドとバックエンドの連携
   - APIエンドポイントの実装と接続確認

2. 環境変数の管理
   - 本番環境と開発環境の設定分離

3. ポート設定の標準化
   - システム運用ガイドとの整合性確保

4. デプロイ手順の整備
   - コンテナ化やCI/CDパイプラインの構築

## 4. 参考資料

- NestJS公式ドキュメント: https://docs.nestjs.com/
- Vite公式ドキュメント: https://vitejs.dev/config/
- TypeORM公式ドキュメント: https://typeorm.io/
