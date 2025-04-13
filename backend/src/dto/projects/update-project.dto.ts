import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsNumber, IsString, IsIn, IsBoolean } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsOptional()
  @IsString()
  @IsIn(['募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了'])
  status?: string;

  @IsOptional()
  @IsNumber()
  requiredHeadcount?: number;

  @IsOptional()
  @IsNumber()
  currentHeadcount?: number;

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
  @IsBoolean()
  isApproved?: boolean;
}
