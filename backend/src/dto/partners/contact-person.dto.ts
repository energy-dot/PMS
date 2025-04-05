import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsPhoneNumber } from 'class-validator';
import { Partner } from '../../entities/partner.entity';

export class ContactPersonDto {
  @IsString()
  @IsNotEmpty({ message: 'パートナーIDは必須です' })
  partnerId: string;

  @IsString()
  @IsNotEmpty({ message: '氏名は必須です' })
  name: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  mobilePhone?: string;

  @IsEnum(['主要担当', '営業担当', '技術担当', 'その他'], { 
    message: '担当区分は「主要担当」「営業担当」「技術担当」「その他」のいずれかである必要があります' 
  })
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  preferredContactMethod?: string;
}

export class UpdateContactPersonDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  mobilePhone?: string;

  @IsEnum(['主要担当', '営業担当', '技術担当', 'その他'], { 
    message: '担当区分は「主要担当」「営業担当」「技術担当」「その他」のいずれかである必要があります' 
  })
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  preferredContactMethod?: string;
}
