import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // バリデーションパイプの設定
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // class-validatorでDIを使用できるようにする
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // CORSの設定 - 開発環境では許容的に設定
  app.enableCors({
    origin: true, // すべてのオリジンを許可（開発環境用）
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    maxAge: 3600,
  });

  // グローバルプレフィックスを削除（フロントエンドとの整合性のため）
  // app.setGlobalPrefix('api');

  // 初期管理者ユーザーを作成
  try {
    const dataSource = app.get(getDataSourceToken());
    await seedInitialUsers(dataSource, logger);
  } catch (error) {
    logger.error(`初期ユーザー作成中にエラーが発生しました: ${error.message}`);
  }

  // ヘルスチェックエンドポイント
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // 起動時のログ出力
  const port = process.env.PORT || 3001;
  try {
    await app.listen(port);
    logger.log(`アプリケーションがポート${port}で起動しました`);

    // フロントエンドの接続先URLを表示
    const protocol = 'http';
    const hostname = 'localhost';
    logger.log(`API URL: ${protocol}://${hostname}:${port}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      // ポートが使用中の場合、別のポートを試行
      const alternativePort = Number(port) + 1;
      logger.warn(`ポート${port}は使用中です。代替ポート${alternativePort}を試行します...`);
      await app.listen(alternativePort);
      logger.log(`アプリケーションが代替ポート${alternativePort}で起動しました`);
      logger.log(`API URL: http://localhost:${alternativePort}`);
    } else {
      logger.error(`アプリケーションの起動に失敗しました: ${error.message}`);
      logger.error(error.stack);
      throw error;
    }
  }
}

// 初期ユーザーデータ作成関数
async function seedInitialUsers(dataSource: DataSource, logger: Logger) {
  try {
    // すでに管理者ユーザーが存在するか確認
    const userRepository = dataSource.getRepository('users');
    const adminExists = await userRepository.findOne({ where: { username: 'admin' } });

    if (!adminExists) {
      logger.log('初期管理者ユーザーを作成します...');

      // パスワードをハッシュ化 (ここではシンプルに'password'を使用)
      const hashedPassword = await bcrypt.hash('password', 10);

      // 管理者ユーザーを作成
      await userRepository.save([
        {
          username: 'admin',
          password: hashedPassword,
          fullName: '管理者',
          role: 'admin',
          isActive: true,
        },
        {
          username: 'partner_manager',
          password: hashedPassword,
          fullName: 'パートナー管理者',
          role: 'partner_manager',
          isActive: true,
        },
        {
          username: 'developer',
          password: hashedPassword,
          fullName: '開発者',
          role: 'developer',
          isActive: true,
        },
        {
          username: 'viewer',
          password: hashedPassword,
          fullName: '閲覧者',
          role: 'viewer',
          isActive: true,
        },
      ]);

      logger.log('初期ユーザーの作成が完了しました');
    } else {
      logger.log('初期ユーザーはすでに存在します');
    }
  } catch (error) {
    logger.error(`ユーザー作成中にエラーが発生しました: ${error.message}`);
    throw error;
  }
}

bootstrap();
