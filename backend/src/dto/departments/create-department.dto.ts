import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDepartmentDto {
  @IsString({ message: 'コードは文字列で入力してください' })
  @IsNotEmpty({ message: 'コードは必須です' })
  @MaxLength(20, { message: 'コードは20文字以内で入力してください' })
  @Transform(({ value }) => value?.trim())
  code: string;

  @IsString({ message: '名前は文字列で入力してください' })
  @IsNotEmpty({ message: '名前は必須です' })
  @MaxLength(100, { message: '名前は100文字以内で入力してください' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNumber({}, { message: '表示順は数値で入力してください' })
  @IsOptional()
  @Min(0, { message: '表示順は0以上の値を入力してください' })
  @Max(9999, { message: '表示順は9999以下の値を入力してください' })
  displayOrder?: number;

  @IsBoolean({ message: '有効フラグはtrueまたはfalseで入力してください' })
  @IsOptional()
  isActive?: boolean;
}
