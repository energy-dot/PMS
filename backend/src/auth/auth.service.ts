import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    try {
      // データベースからユーザーを検索
      const user = await this.usersRepository.findOne({ where: { username } });

      // ユーザーが存在しない場合
      if (!user) {
        this.logger.warn(`ログイン失敗: ユーザーが見つかりません - ${username}`);
        throw new UnauthorizedException('ユーザー名またはパスワードが正しくありません');
      }

      // パスワードが一致しない場合
      let passwordMatches;
      try {
        passwordMatches = await bcrypt.compare(password, user.password);
      } catch (error) {
        this.logger.error('パスワード照合エラー:', error);
        throw new UnauthorizedException('認証処理中にエラーが発生しました');
      }

      if (!passwordMatches) {
        this.logger.warn(`ログイン失敗: パスワードが不一致 - ${username}`);
        throw new UnauthorizedException('ユーザー名またはパスワードが正しくありません');
      }

      this.logger.log(`ログイン成功: ${username} (${user.role})`);

      // JWTペイロードの作成
      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      // レスポンスの形式を統一
      return {
        accessToken: token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error(`ログイン処理中にエラーが発生しました: ${error.message}`);
      }
      throw error;
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }

    // パスワードを除外して返却
    const { password, ...result } = user;
    return result;
  }
}
