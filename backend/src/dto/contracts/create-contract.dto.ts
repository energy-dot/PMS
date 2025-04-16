import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsString,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Staff } from '../../entities/staff.entity';
import { Project } from '../../entities/project.entity';
import { IsAfterDate } from '../../validators/date-validation.decorator';

export class CreateContractDto {
  @Type(() => Staff)
  @IsNotEmpty({ message: 'スタッフは必須です' })
  staff: Staff;

  @Type(() => Project)
  @IsNotEmpty({ message: 'プロジェクトは必須です' })
  project: Project;

  @IsOptional()
  @IsUUID()
  staffId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsDateString()
  @IsNotEmpty({ message: '開始日は必須です' })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty({ message: '終了日は必須です' })
  @IsAfterDate('startDate', { message: '終了日は開始日より後の日付である必要があります' })
  endDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: '契約単価は必須です' })
  price: number;

  @IsOptional()
  @IsNumber()
  monthlyRate?: number;

  @IsOptional()
  @IsNumber()
  manMonth?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsEnum(['契約中', '更新待ち', '契約終了'], {
    message: 'ステータスは「契約中」「更新待ち」「契約終了」のいずれかである必要があります',
  })
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  contractFile?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isAutoRenew?: boolean;

  @IsDateString()
  @IsOptional()
  renewalNoticeDate?: Date;
}
