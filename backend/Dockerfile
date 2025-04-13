FROM node:20-alpine AS builder

WORKDIR /app

# パッケージファイルをコピーしてインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# ビルドを実行
RUN npm run build

# 本番環境用の軽量イメージを作成
FROM node:20-alpine

WORKDIR /app

# ビルドステージからpackage.jsonとビルド成果物をコピー
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# 本番依存関係のみをインストール
RUN npm install --omit=dev

# ポート3001を開放
EXPOSE 3001

# アプリケーションを起動
CMD ["node", "dist/main"]
