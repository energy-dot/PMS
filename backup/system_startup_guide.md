# パートナー要員管理システム 起動・アクセスガイド

## 1. システム起動方法

### ローカル環境での起動

1. 以下のコマンドを実行して、システムを起動します：

```bash
cd /home/ubuntu
./start-system.sh
```

このスクリプトは以下の処理を自動的に行います：
- PostgreSQLデータベースの起動（Docker Compose）
- バックエンドサーバーの起動（NestJS/Express）
- フロントエンドサーバーの起動（React/Vite）

2. 起動後、以下のURLでアクセスできます：
   - フロントエンド: http://localhost:5173
   - バックエンドAPI: http://localhost:3001/api

3. システムを終了するには、起動スクリプトを実行しているターミナルで `Ctrl+C` を押します。

### インターネット経由でのアクセス設定

1. 以下のコマンドを実行して、インターネットアクセス用の設定でシステムを起動します：

```bash
cd /home/ubuntu
./start-system-internet.sh
```

このスクリプトは以下の処理を行います：
- PostgreSQLデータベースの起動
- バックエンドサーバーを全てのインターフェースでリッスンするよう起動
- フロントエンドサーバーを全てのインターフェースでリッスンするよう起動

2. システムが起動したら、以下のコマンドを実行してポートを公開します：

フロントエンドの公開：
```bash
curl -X POST http://localhost:8080/api/v1/expose-port -d '{"port": 4173}'
```

バックエンドの公開：
```bash
curl -X POST http://localhost:8080/api/v1/expose-port -d '{"port": 3001}'
```

3. 上記コマンドの実行結果として表示されるURLを使用して、インターネット経由でアクセスできます。
   例：
   - フロントエンド: https://4173-xxxx.proxy.runpod.net
   - バックエンドAPI: https://3001-xxxx.proxy.runpod.net/api

## 2. ログイン情報

システムには以下のユーザーアカウントでログインできます：

| ユーザー名 | パスワード | 役割 |
|------------|------------|------|
| admin | password | 管理者 |
| partner_manager | password | パートナー管理者 |
| developer | password | 開発者 |
| viewer | password | 閲覧者 |

## 3. 注意事項

- インターネット公開用のURLは一時的なものであり、システムを再起動すると変更されます
- 本番環境での利用には、適切なセキュリティ対策（強力なパスワード、HTTPS設定など）が必要です
- データベースはDockerコンテナ内で動作しており、システム終了時にデータが失われる可能性があります
- 重要なデータは定期的にバックアップすることをお勧めします

## 4. トラブルシューティング

問題が発生した場合は、以下の手順を試してください：

1. システムを完全に停止する：

```bash
docker-compose down
pkill -f "npm run"
```

2. ポートが使用中でないか確認する：
```bash
lsof -i :3001
lsof -i :5173
lsof -i :4173
lsof -i :5432
```

3. システムを再起動する：
```bash
./start-system.sh
# または
./start-system-internet.sh
```
