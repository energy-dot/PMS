import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AntisocialCheckDto {
  @IsString()
  @IsNotEmpty({ message: 'パートナーIDは必須です' })
  partnerId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'チェック実施日は必須です' })
  checkDate: Date;

  @IsString()
  @IsOptional()
  checkedBy?: string;

  @IsString()
  @IsOptional()
  checkMethod?: string;

  @IsEnum(['問題なし', '要確認', 'NG'], { 
    message: 'チェック結果は「問題なし」「要確認」「NG」のいずれかである必要があります' 
  })
  @IsNotEmpty({ message: 'チェック結果は必須です' })
  result: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiryDate?: Date;

  @IsString()
  @IsOptional()
  documentFile?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class UpdateAntisocialCheckDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  checkDate?: Date;

  @IsString()
  @IsOptional()
  checkedBy?: string;

  @IsString()
  @IsOptional()
  checkMethod?: string;

  @IsEnum(['問題なし', '要確認', 'NG'], { 
    message: 'チェック結果は「問題なし」「要確認」「NG」のいずれかである必要があります' 
  })
  @IsOptional()
  result?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiryDate?: Date;

  @IsString()
  @IsOptional()
  documentFile?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
