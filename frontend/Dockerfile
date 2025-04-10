FROM node:18-alpine as build

WORKDIR /app

# パッケージファイルをコピーしてインストール
COPY package*.json ./
RUN npm install
RUN npm install terser@5.19.4 --save-dev
RUN npm install -D tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14

# ソースコードをコピー
COPY . .
# エラーの原因となる'eval'変数名を修正
RUN sed -i 's/data.filter(eval => eval.evaluatorName/data.filter(evaluation => evaluation.evaluatorName/g' src/pages/EvaluationList.tsx

# 環境変数を設定
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# ビルドを実行
RUN npm run build

# Nginx向けのルートディレクトリにビルド結果を配置
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3002ポートを開放
EXPOSE 3002

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
