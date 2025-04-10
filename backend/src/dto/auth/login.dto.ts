import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'ユーザー名は必須です' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'パスワードは必須です' })
  password: string;
}
