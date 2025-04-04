import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty({ message: '会社名は必須です' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '住所は必須です' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: '電話番号は必須です' })
  phone: string;

  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @IsOptional()
  email?: string;

  @IsUrl({}, { message: '有効なURLを入力してください' })
  @IsOptional()
  website?: string;

  @IsEnum(['取引中', '取引停止', '候補'], { message: 'ステータスは「取引中」「取引停止」「候補」のいずれかである必要があります' })
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  businessCategory?: string;

  @IsNumber()
  @IsOptional()
  establishedYear?: number;

  @IsNumber()
  @IsOptional()
  employeeCount?: number;

  @IsString()
  @IsOptional()
  annualRevenue?: string;

  @IsBoolean()
  @IsOptional()
  antisocialCheckCompleted?: boolean;

  @IsOptional()
  antisocialCheckDate?: Date;

  @IsBoolean()
  @IsOptional()
  creditCheckCompleted?: boolean;

  @IsOptional()
  creditCheckDate?: Date;

  @IsString()
  @IsOptional()
  remarks?: string;
}
