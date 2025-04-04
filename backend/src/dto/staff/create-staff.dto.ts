import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Partner } from '../../entities/partner.entity';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty({ message: '氏名は必須です' })
  name: string;

  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(['稼働中', '待機中', '契約終了'], { 
    message: 'ステータスは「稼働中」「待機中」「契約終了」のいずれかである必要があります' 
  })
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsNumber()
  @IsOptional()
  experience?: number;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  resume?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @Type(() => Partner)
  @IsNotEmpty({ message: '所属会社は必須です' })
  partner: Partner;
}
