import { IsNotEmpty, IsString, IsEmail, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(['developer', 'partner_manager', 'admin', 'viewer'])
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer';

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
