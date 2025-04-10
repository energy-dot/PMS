import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

// テスト環境でのバリデーション設定
beforeAll(() => {
  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  // class-validatorでDIを使用できるようにする
  useContainer({ get: () => null } as any, { fallbackOnErrors: true });
});
