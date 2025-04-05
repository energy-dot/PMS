import { IsNotEmpty, IsOptional, IsDateString, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Staff } from '../../entities/staff.entity';
import { Project } from '../../entities/project.entity';

export class CreateContractDto {
  @Type(() => Staff)
  @IsOptional() // staffを必須から任意に変更
  staff?: Staff;

  @Type(() => Project)
  @IsOptional() // projectを必須から任意に変更
  project?: Project;

  @IsDateString()
  @IsNotEmpty({ message: '開始日は必須です' })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty({ message: '終了日は必須です' })
  endDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: '契約単価は必須です' })
  price: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsEnum(['契約中', '更新待ち', '契約終了'], { 
    message: 'ステータスは「契約中」「更新待ち」「契約終了」のいずれかである必要があります' 
  })
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  contractFile?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsBoolean()
  @IsOptional()
  isAutoRenew?: boolean;

  @IsDateString()
  @IsOptional()
  renewalNoticeDate?: Date;
}
