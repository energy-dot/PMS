import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'パートナー要員管理システム（PMS）へようこそ！';
  }
}
