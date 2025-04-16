import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContractRenewalDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  newStartDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  newEndDate?: Date;

  @IsOptional()
  @IsNumber()
  newPrice?: number;

  @IsOptional()
  @IsString()
  changeReason?: string;

  @IsOptional()
  @IsEnum(['自動更新', '条件変更', '価格変更', '期間延長', 'その他'])
  renewalType?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  approvedDate?: Date;

  @IsOptional()
  @IsEnum(['申請中', '承認済', '却下', '取消'])
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
