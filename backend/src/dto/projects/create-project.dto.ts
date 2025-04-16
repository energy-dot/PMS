import {
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsIn,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  sectionId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  @IsIn(['募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了'])
  status?: string = '承認待ち';

  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @IsOptional()
  @IsString()
  requiredExperience?: string;

  @IsOptional()
  @IsNumber()
  requiredNumber?: number;

  @IsOptional()
  @IsNumber()
  requiredHeadcount?: number;

  @IsOptional()
  @IsNumber()
  currentHeadcount?: number = 0;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  workingHours?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean = false;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rateMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rateMax?: number;
}
