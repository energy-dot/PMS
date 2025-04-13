FROM node:18-alpine AS build

WORKDIR /app

# パッケージファイルをコピーしてインストール
COPY package*.json ./
RUN npm install
RUN npm install terser@5.19.4 --save-dev
RUN npm install -D tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14

# ソースコードをコピー
COPY . .

# 環境変数を設定
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# ビルドを実行
RUN npm run build

# Nginx向けのルートディレクトリにビルド結果を配置
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# デバッグログを有効化
RUN sed -i 's/access_log.*/access_log \/dev\/stdout;/' /etc/nginx/nginx.conf \
    && sed -i 's/error_log.*/error_log \/dev\/stderr debug;/' /etc/nginx/nginx.conf

# 3002ポートを開放
EXPOSE 3002

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
