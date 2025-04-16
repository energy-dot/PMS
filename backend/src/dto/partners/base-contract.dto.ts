import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Partner } from '../../entities/partner.entity';

export class BaseContractDto {
  @IsString()
  @IsNotEmpty({ message: 'パートナーIDは必須です' })
  partnerId: string;

  @IsString()
  @IsNotEmpty({ message: '契約名は必須です' })
  name: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '契約開始日は必須です' })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '契約終了日は必須です' })
  endDate: Date;

  @IsEnum(['有効', '更新待ち', '終了'], {
    message: 'ステータスは「有効」「更新待ち」「終了」のいずれかである必要があります',
  })
  @IsNotEmpty({ message: 'ステータスは必須です' })
  status: string;

  @IsString()
  @IsOptional()
  contractType?: string;

  @IsString()
  @IsOptional()
  contractFile?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsBoolean()
  @IsOptional()
  isAutoRenew?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  renewalNoticeDate?: Date;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateBaseContractDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsEnum(['有効', '更新待ち', '終了'], {
    message: 'ステータスは「有効」「更新待ち」「終了」のいずれかである必要があります',
  })
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  contractType?: string;

  @IsString()
  @IsOptional()
  contractFile?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsBoolean()
  @IsOptional()
  isAutoRenew?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  renewalNoticeDate?: Date;

  @IsString()
  @IsOptional()
  remarks?: string;
}
