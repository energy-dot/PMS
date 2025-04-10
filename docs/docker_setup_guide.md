# パートナー要員管理システム Docker設定手順書

このドキュメントでは、パートナー要員管理システム（PMS）をDockerコンテナとして実行するための設定手順を説明します。

## 前提条件

- Docker がインストールされていること
- Docker Compose がインストールされていること
- Git がインストールされていること

## 1. プロジェクトの準備

### 1.1 リポジトリのクローン

```bash
git clone https://github.com/energy-dot/PMS.git
cd PMS
```

### 1.2 ファイル構成の確認

以下のファイルが正しく配置されていることを確認してください：

- `backend/Dockerfile` - バックエンド用Dockerファイル
- `frontend/Dockerfile` - フロントエンド用Dockerファイル
- `frontend/nginx.conf` - Nginx設定ファイル
- `docker-compose.yml` - Docker Compose設定ファイル

## 2. 環境設定

### 2.1 バックエンドの環境設定

必要に応じて、バックエンドの環境変数を設定します。

```bash
# 例: .env ファイルを作成
cat > backend/.env << EOL
NODE_ENV=production
PORT=3001
# その他の環境変数
EOL
```

### 2.2 フロントエンドの環境設定

必要に応じて、フロントエンドの環境変数を設定します。

```bash
# 例: .env ファイルを作成
cat > frontend/.env << EOL
VITE_API_URL=http://localhost:3001
FRONTEND_PORT=3002
# その他の環境変数
EOL
```

## 3. Dockerコンテナのビルドと起動

### 3.1 Docker Composeを使用したビルドと起動

```bash
docker-compose up -d --build
```

このコマンドは以下の処理を行います：
- バックエンドとフロントエンドのDockerイメージをビルド
- コンテナを起動
- バックグラウンドで実行（-dオプション）

### 3.2 コンテナの状態確認

```bash
docker-compose ps
```

正常に起動していれば、以下のようなコンテナが表示されます：
- `pms-backend` - バックエンドサービス（ポート3001）
- `pms-frontend` - フロントエンドサービス（ポート3002）

## 4. アプリケーションへのアクセス

- フロントエンド: http://localhost:3002
- バックエンドAPI: http://localhost:3001

## 5. コンテナの管理

### 5.1 ログの確認

```bash
# すべてのコンテナのログを表示
docker-compose logs

# 特定のサービスのログを表示
docker-compose logs backend
docker-compose logs frontend

# ログをリアルタイムで表示
docker-compose logs -f
```

### 5.2 コンテナの停止

```bash
docker-compose down
```

### 5.3 コンテナの再起動

```bash
docker-compose restart
```

### 5.4 特定のサービスの再起動

```bash
docker-compose restart backend
docker-compose restart frontend
```

## 6. トラブルシューティング

### 6.1 コンテナが起動しない場合

```bash
# 詳細なログを確認
docker-compose logs

# コンテナの状態を確認
docker ps -a
```

### 6.2 ネットワーク接続の問題

フロントエンドからバックエンドへの接続に問題がある場合：

1. Nginx設定ファイル（`frontend/nginx.conf`）を確認
2. Docker Composeのネットワーク設定を確認
3. バックエンドサービスが正常に起動しているか確認

### 6.3 ボリュームのクリーンアップ

問題が解決しない場合、ボリュームをクリーンアップして再試行：

```bash
docker-compose down -v
docker-compose up -d --build
```

## 7. 本番環境へのデプロイ

本番環境にデプロイする場合は、以下の点に注意してください：

1. 環境変数の適切な設定
2. セキュリティ設定の見直し
3. SSL/TLS証明書の設定
4. バックアップ戦略の策定

## 8. 開発環境での利用

開発環境では、ホットリロードなどの機能を活用するために、別の設定が必要になる場合があります。開発用のDocker Compose設定ファイル（`docker-compose.dev.yml`）を作成することをお勧めします。

```bash
# 開発環境での起動例
docker-compose -f docker-compose.dev.yml up
```

## 9. 参考資料

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)
- [Nginx公式ドキュメント](https://nginx.org/en/docs/)
