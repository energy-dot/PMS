import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  IsObject,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Partner } from '../../entities/partner.entity';

class PartnerDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

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

  @IsEnum(['稼働中', '待機中', '契約終了', '選考中', '予約済み'], {
    message:
      'ステータスは「稼働中」「待機中」「契約終了」「選考中」「予約済み」のいずれかである必要があります',
  })
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsObject()
  @IsOptional()
  skillLevels?: Record<string, number>;

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

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  sectionId?: string;

  @ValidateNested()
  @Type(() => PartnerDto)
  @IsNotEmpty({ message: '所属会社は必須です' })
  partner: PartnerDto;
}
