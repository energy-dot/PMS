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

export class UpdateCreditCheckDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkDate?: Date;

  @IsOptional()
  @IsString()
  checkedBy?: string;

  @IsOptional()
  @IsString()
  checkMethod?: string;

  @IsOptional()
  @IsEnum(['良好', '注意', '不良'])
  result?: string;

  @IsOptional()
  @IsNumber()
  creditScore?: number;

  @IsOptional()
  @IsString()
  financialStability?: string;

  @IsOptional()
  @IsString()
  paymentHistory?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  documentFile?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
