import { IsNotEmpty, IsOptional, IsUUID, IsDate, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractRenewalDto {
  @IsNotEmpty()
  @IsUUID()
  contractId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  previousStartDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  previousEndDate: Date;

  @IsNotEmpty()
  @IsNumber()
  previousPrice: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  newStartDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  newEndDate: Date;

  @IsNotEmpty()
  @IsNumber()
  newPrice: number;

  @IsOptional()
  @IsString()
  changeReason?: string;

  @IsNotEmpty()
  @IsEnum(['自動更新', '条件変更', '価格変更', '期間延長', 'その他'])
  renewalType: string;

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
