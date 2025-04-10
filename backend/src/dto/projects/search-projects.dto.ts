import { IsOptional, IsString, IsUUID, IsDateString, IsNumber } from 'class-validator';

export class SearchProjectsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @IsOptional()
  @IsNumber()
  rateMin?: number;

  @IsOptional()
  @IsNumber()
  rateMax?: number;

  @IsOptional()
  @IsString()
  requiredSkills?: string;
}
