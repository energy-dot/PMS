FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

# 開発環境ではソースコードから直接起動
CMD ["npm", "run", "start:dev"]
