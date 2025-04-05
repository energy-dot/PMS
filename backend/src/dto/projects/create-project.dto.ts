import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: '案件名は必須です' })
  name: string;

  @IsString()
  @IsOptional() // departmentを必須から任意に変更
  department?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty({ message: '開始日は必須です' })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty({ message: '終了日は必須です' })
  endDate: Date;

  @IsEnum(['募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了', '進行中'], { 
    message: 'ステータスは「募集中」「選考中」「充足」「承認待ち」「差し戻し」「終了」「進行中」のいずれかである必要があります' 
  })
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  requiredSkills?: string;

  @IsString()
  @IsOptional()
  requiredExperience?: string;

  @IsNumber()
  @IsOptional()
  requiredNumber?: number;

  @IsString()
  @IsOptional()
  budget?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  workingHours?: string;

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;

  @IsString()
  @IsOptional()
  remarks?: string;
}
