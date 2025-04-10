import { IsOptional, IsString, IsUUID, IsNumber, IsEnum } from 'class-validator';

export class SearchStaffDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  nameKana?: string;

  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsNumber()
  skillLevelMin?: number;

  @IsOptional()
  @IsNumber()
  skillLevelMax?: number;

  @IsOptional()
  @IsNumber()
  yearsOfExperienceMin?: number;

  @IsOptional()
  @IsNumber()
  yearsOfExperienceMax?: number;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsOptional()
  @IsNumber()
  rateMin?: number;

  @IsOptional()
  @IsNumber()
  rateMax?: number;

  @IsOptional()
  @IsEnum(['available', 'unavailable', 'partially_available'])
  availability?: 'available' | 'unavailable' | 'partially_available';
}
